import React, { useState, useEffect } from 'react';
import Header from '../components/common/header/header';
import {useHistory} from "react-router-dom";
import SeatMap from '../components/seatmap';
import {
    retrieveOfferFromLocalStorage,
    retrieveSegmentFromLocalStorage,
    retrieveFlightFromLocalStorage,
} from "../utils/local-storage-cache";
import { retrieveSeatmap } from '../utils/api-utils';
import Spinner from "../components/common/spinner";


export default function FlightSeatmapPage({match}) {
    let history = useHistory();
    let offerId = match.params.offerId;
    let segmentId = match.params.segmentId;
    let offer = retrieveOfferFromLocalStorage(offerId);
    console.log('[SEATMAP PAGE] Offer: ', offer);

    // Get the Details from API and storage
    // @fixme: To be implemented with Glider API
    const [isLoading, setIsLoading] = useState(false);
    const [indexedSeatmap, setIndexedSeatmap] = useState();
    const [activeSegmentIndex, setActiveSegmentIndex] = useState(0);

    // Load the seatmap on first component mounting
    useEffect(() => {
        // Prepare spinner
        setIsLoading(true);

        // Load the seat map
        retrieveSeatmap()
            // Load results in state
            .then(res => {
                setIndexedSeatmap(res);
            })

            // Handle error
            .catch(console.log)

            // Stop spinner
            .finally(() => {
                setIsLoading(false);
            })
    }, []);

    // Proceed to summary
    const proceedToSummary = () => {
        let url='/flights/summary/'+ offerId
        history.push(url);
    }

    // Handle a click on continue in the seatmap
    const handleContinue = (selectedSeats) => {
        //@TODO: Add seats to basket and load next segment
        console.log('[SEATMAP PAGE] continue');
        proceedToSummary();
    };

    // Handle a click on skip on the seatmap
    const handleSkip = () => {
        //@TODO: Load next segment without adding items in basket
        console.log('[SEATMAP PAGE] Skip');
        proceedToSummary();
    };

    // Get the details of a segment
    const getSeatMapSegment = (segmentKey) => {
        // Get the list of flights from the offer
        const flightKeys = Object.keys(offer.pricePlansReferences).reduce((f, pricePlan) => {
            return f.concat(offer.pricePlansReferences[pricePlan].flights);
        }, []);
        console.log('flightKeys>>>', flightKeys);
        const flights = flightKeys.map(flightKey => retrieveFlightFromLocalStorage(flightKey));
        console.log('flights>>>', flights);
        
        // Retrieve current flight and segments
        const currentFlight = flights.find(flight => flight.includes(segmentKey));
        const currentFlightSegments = currentFlight.map(segmentId => retrieveSegmentFromLocalStorage(segmentId));

        // Retrieve stops
        const iataStops = currentFlightSegments.reduce((acc, segment) => {
            return acc.concat(segment.destination.iataCode);
        },[currentFlightSegments[0].origin.iataCode]);

        // Compute flight time
        const segmentFlightIndex = currentFlight.indexOf(segmentKey);
        const timeDelta = (
            new Date(currentFlightSegments[segmentFlightIndex].arrivalTime) - 
            new Date(currentFlightSegments[segmentFlightIndex].departureTime)
        );
        const timeDeltaHours = Number(timeDelta/(1000*60*60)).toFixed(0);
        const timeDeltaMinutes = Number((timeDelta-timeDeltaHours)/(1000*60)).toFixed(0);

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
        if(indexedSeatmap) {
            // Retrieve segment details
            const activeSegmentKey = Object.keys(indexedSeatmap)[activeSegmentIndex];
            
            // Retrieve passenger details
            const passengers = [
                {
                    type: 'ADT',
                    name: 'Doe John'
                },
                {
                    type: 'CHD',
                    name: 'Doe Johnny'
                },
            ];

            return (
                <SeatMap
                    cabin={getSeatMapCabin(activeSegmentKey)}
                    segment={getSeatMapSegment(activeSegmentKey)}
                    passengers={passengers}
                    initialPrice={offer.price}
                    currency={offer.currency}
                    handleSeatMapContinue={handleContinue}
                    handleSeatMapSkip={handleSkip}
                />
            );
        }
    };



    return (
        <>
            <div>
                <Header violet={true}/>
                <div className='root-container-subpages'>
                    <div>Seatmap for offer: {offerId}, segmentId:{segmentId}</div>
                    <Spinner enabled={isLoading}/>
                    {currentSeatmap()}
                </div>
            </div>
        </>
    );
}