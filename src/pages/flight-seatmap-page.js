import React, { useState, useEffect } from 'react';
import {useHistory} from "react-router-dom";
import Spinner from "../components/common/spinner";
import Header from '../components/common/header/header';
import SeatMap from '../components/seatmap';
import {
    retrieveOfferFromLocalStorage,
    retrieveSegmentFromLocalStorage,
    retrieveFlightFromLocalStorage,
} from "../utils/local-storage-cache";
import {
    retrieveSeatmap,
    addSeats,
} from '../utils/api-utils';
import Footer from "../components/common/footer/footer";
import './flight-seatmap-page.scss';


// SeatMap page rendering
export default function FlightSeatmapPage({match}) {
    let history = useHistory();
    let offerId = match.params.offerId;
    let offer = retrieveOfferFromLocalStorage(offerId);

    // States of the component
    const [isLoading, setIsLoading] = useState(false);
    const [indexedSeatmap, setIndexedSeatmap] = useState();
    const [activeSegmentIndex, setActiveSegmentIndex] = useState(0);
    const [seatOptions, setSeatOptions] = useState([]);
    const [totalPrice, setTotalPrice] = useState(Number(offer.price.public));

    // Create required variables from history
    const passengersFromHistory = history.location.state.passengers;
    const passengers = passengersFromHistory && passengersFromHistory.map(passenger => {
        return {
            id: passenger.id,
            type: passenger.type,
            name: [
                passenger.civility,
                passenger.lastName,
                passenger.middleName,
                passenger.firstName,
            ].join(' '),
        }
    });

    // Load the seatmap on first component mounting
    useEffect(() => {
        // Prepare spinner
        setIsLoading(true);

        // Load the seat map
        retrieveSeatmap()
            // Load results in state
            .then(result => {
                if(result.error) {
                    console.log(`[SEATMAP Page] Error ${result.error.code}: ${result.error.message}`);
                    proceedToSummary();
                } else {
                    setIndexedSeatmap(result);
                }
            })

            // Handle error
            .catch(error => {
                console.log('[SEATMAP Page] Error while retrieving seatmap', error);
                proceedToSummary();
            })

            // Stop spinner
            .finally(() => {
                setIsLoading(false);
            })
    }, []);

    // Proceed to summary
    const proceedToSummary = () => {
        let url='/flights/summary/'+ offerId
        history.push(url);
    };

    // Handle the next step.
    const handleNext = (currentSeatOptions=[]) => {
        // Update the seat options
        setSeatOptions(currentSeatOptions);

        // If there are more segments with seatmaps, show the next one
        if(activeSegmentIndex < Object.keys(indexedSeatmap).length - 1) {
            setActiveSegmentIndex(activeSegmentIndex + 1);
        }

        // Otherwise proceed to summary
        else {
            // Call the API to add the seats if any
            if(currentSeatOptions.length > 0) {
                setIsLoading(true);
                addSeats(currentSeatOptions)
                    .then(() => {
                        proceedToSummary();
                    })
                    .catch(error => {
                        console.log(error);
                    })
                    .finally(() => {
                        setIsLoading(false);
                    });
            } else {
                proceedToSummary();
            }
        }
    };

    // Handle click on the Skip button
    const handleSkip = () => {
        handleNext(seatOptions);
    }

    // Handle a click on continue in the seatmap
    const handleContinue = (selectedSeats) => {
        const activeSegmentKey = Object.keys(indexedSeatmap)[activeSegmentIndex];

        // Get seats in a suitable format for the API
        const seats = selectedSeats.map(({number, optionCode, passengerIndex}) => {
            return {
                seatNumber: number,
                code: optionCode,
                passenger: passengers[passengerIndex].id,
                segment: activeSegmentKey,
            };
        });

        // Update the current total price
        setTotalPrice(seats.reduce((subtotal, seat) => {
            const seatprice = indexedSeatmap[activeSegmentKey].prices[seat.code];
            return (subtotal + (seatprice ? Number(seatprice.public) : 0));
        }, totalPrice));

        handleNext(seatOptions.concat(seats));
    };

    // Get the details of a segment
    const getSeatMapSegment = (segmentKey) => {
        // Get the list of flights from the offer
        const flightKeys = Object.keys(offer.pricePlansReferences).reduce((f, pricePlanKey) => {
            return f.concat(offer.pricePlansReferences[pricePlanKey].flights);
        }, []);
        const flights = flightKeys.map(flightKey => retrieveFlightFromLocalStorage(flightKey));

        // Retrieve current flight
        let currentFlight = flights.find(flight => flight.includes(segmentKey));
        if(!currentFlight) {
            // Workaround for segment reference bug
            console.error(`[SEATMAP PAGE] FIXME Segment ${segmentKey} from seatmap API response does not match any flight!`);
            const segmentIndex = Object.keys(indexedSeatmap).indexOf(segmentKey);
            if(segmentIndex < flights[0].length) {
                segmentKey = flights[0][segmentIndex];
                currentFlight = flights[0];
            } else {
                segmentKey = flights[1][segmentIndex - flights[0].length];
                currentFlight = flights[1];
            }
            console.info(`[SEATMAP PAGE] Guess segment is ${segmentKey}`);
        }

        // Retrieve segments associated with current flight
        const currentFlightSegments = currentFlight.map(segmentId => retrieveSegmentFromLocalStorage(segmentId));

        // Retrieve stops
        const iataStops = currentFlightSegments.reduce((acc, segment) => {
            return acc.concat(segment.destination.city_name);
        },[currentFlightSegments[0].origin.city_name]);

        // Compute flight time
        const segmentFlightIndex = currentFlight.indexOf(segmentKey);
        const timeDelta = (
            new Date(currentFlightSegments[segmentFlightIndex].arrivalTime) -
            new Date(currentFlightSegments[segmentFlightIndex].departureTime)
        );
        const timeDeltaHours = Number(timeDelta/(1000*60*60)).toFixed(0);
        const timeDeltaMinutes = Number((timeDelta-1000*60*60*timeDeltaHours)/(1000*60)).toFixed(0);

        return {
            stops: iataStops,
            flightTime: `${timeDeltaHours}h ${timeDeltaMinutes}min`,
            index: segmentFlightIndex,
        };
    };

    // Get the details of a cabin
    const getSeatMapCabin = (segmentKey) => {
            // Destructure the API response
            const { cabins, prices } = indexedSeatmap[segmentKey];

            // Create the cabin properties
            return {
                layout: cabins[0].layout,
                name: cabins[0].name,
                firstRow: Number(cabins[0].firstRow),
                lastRow: Number(cabins[0].lastRow),
                wingFirst: Number(cabins[0].wingFirst),
                wingLast: Number(cabins[0].wingLast),
                seats: cabins[0].seats,
                prices: prices,
            };
    };

    // Display the current seatmap
    const currentSeatmap = () => {
        if(!isLoading && indexedSeatmap) {
            // Retrieve segment details
            const activeSegmentKey = Object.keys(indexedSeatmap)[activeSegmentIndex];

            return (
                <SeatMap
                    cabin={getSeatMapCabin(activeSegmentKey)}
                    segment={getSeatMapSegment(activeSegmentKey)}
                    passengers={passengers}
                    initialPrice={totalPrice}
                    currency={offer.price.currency}
                    handleSeatMapContinue={handleContinue}
                    handleSeatMapSkip={handleSkip}
                />
            );
        }
    };

    // Display a loading spinner
    const loadingSpinner = () => {
        if(isLoading) {
            let message;
            if(!indexedSeatmap) {
                message = "We are retrieving available seats for your journey, this can take up to 60 seconds.";
            } else if(seatOptions.length > 0) {
                message = "We are adding your seat selection to your booking.";
            }
            return (
                <>
                <div className='seatmap-loading-message'>
                    <Spinner enabled={true}></Spinner>
                    {message}
                </div>
            </>
            );
        }
    }

    return (
        <>
            <div>
                <Header violet={true}/>
                <div className='root-container-subpages'>
                    {loadingSpinner()}
                    {currentSeatmap()}
                </div>
                <Footer/>

            </div>
        </>
    );
}
