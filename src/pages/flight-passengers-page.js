import React, {useState,useEffect} from 'react';
import Header from '../components/common/header/header';
import {useHistory} from "react-router-dom";
import {retrieveOfferFromLocalStorage, retrieveSearchResultsFromLocalStorage} from "../utils/local-storage-cache"
import PaxDetails from "../components/passengers/pax-details";
import {storePassengerDetails,retrievePassengerDetails} from "../utils/api-utils"
import TotalPriceButton from "../components/common/totalprice/total-price";
import {FlightSearchResultsWrapper} from "../utils/flight-search-results-wrapper";
import TripDetails from "../components/flightdetails/trip-details";
import Footer from "../components/common/footer/footer";
import Alert from 'react-bootstrap/Alert';
import Spinner from "../components/common/spinner";


export default function FlightPassengersPage({match}) {
    let history = useHistory();
    const [passengerDetails, setPassengerDetails] = useState(history.location.state.passengers);
    const [passengerDetailsValid,setPassengerDetailsValid] = useState(false);
    const [highlightInvalidFields, setHighlightInvalidFields] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    let offerId = match.params.offerId;
    let searchResults = retrieveSearchResultsFromLocalStorage();
    let searchResultsWrapper = new FlightSearchResultsWrapper(searchResults);
    let itineraries = searchResultsWrapper.getOfferItineraries(offerId);

    let offer = retrieveOfferFromLocalStorage(offerId);
    function onPaxDetailsChange(paxData, allPassengersDetailsAreValid){
        setPassengerDetails(paxData)
        setPassengerDetailsValid(allPassengersDetailsAreValid)
    }

    //Populate form with either passengers from session (if e.g. user refreshed page or clicked back) or initialize with number of passengers (and types) specified in a search form
    useEffect(()=>{
        let passengers = passengerDetails || createInitialPassengersFromSearch();
        let response=retrievePassengerDetails();
        response.then(result=> {
            if(Array.isArray(result)) {
                // Index passengers to ease the update
                let indexedPassengers = passengerDetails.reduce((acc, passenger) => {
                    acc[passenger.id] = passenger;
                    return acc;
                }, {});

                // Assign each received passenger to the passengers, if id matches.
                result.forEach(pax => {
                    if(indexedPassengers.hasOwnProperty(pax.id)) {
                        indexedPassengers[pax.id] = pax;
                    }
                })

                // Update the value
                passengers = Object.values(indexedPassengers);

            }
        }).catch(err=>{
            console.error("Failed to load passenger details", err);
            //TODO - add proper error handling (show user a message)
        }).finally(()=>{
            setPassengerDetails(passengers);
        })
    },[]);

    function redirectToSeatmap(){
        let url='/flights/seatmap/'+offerId;
        history.push(url, {passengers: passengerDetails});
    }

    function savePassengerDetailsAndProceed() {
        setIsLoading(true);
        let results = storePassengerDetails(passengerDetails);
            results.then((response) => {
                console.debug("Successfully saved pax details", response);
                redirectToSeatmap();
         }).catch(err => {
             console.error("Failed to store passenger details", err);
             setHighlightInvalidFields(true);
             setPassengerDetailsValid(false);
         })
         .finally(() => {
            setIsLoading(false);
         });
    }

    const PassengerInvalidAlert = () => (
        <Alert variant="danger">
            <Alert.Heading>Some passenger details are invalid</Alert.Heading>
            <p>
                We are sorry, we are missing some passenger details for this reservation.<br/>
                Please review and complete the passenger details to proceed.
            </p>
        </Alert>
    );

    // Display a loading spinner
    const loadingSpinner = () => {
        return (
            <div>
                <Spinner enabled={true}/>
                <span>We are validating the passenger details</span>
            </div>
        );
        
    }

    /**
     * if initial search was for e.g. 2 adults and 1 child, we need to initialize passenger form with 2 adults and 1 child.
     * This function does that (based on search form criteria)
     * @returns {[]}
     */
    function createInitialPassengersFromSearch()
    {
        let searchResults = retrieveSearchResultsFromLocalStorage();
        let paxData = searchResults.passengers;
        let passengers = Object.keys(paxData).map(paxId => {
            return {
                id: paxId,
                type: paxData[paxId].type
            }
        });
        return passengers;
    }
    return (
        <>
            <div>
                <Header violet={true}/>
                <div className='root-container-subpages'>
                    <TripDetails 
                        itineraries={itineraries}
                    />
                    <PaxDetails 
                        passengers={passengerDetails}
                        onDataChange={onPaxDetailsChange}
                        highlightInvalidFields={highlightInvalidFields}
                    />
                    {highlightInvalidFields && PassengerInvalidAlert()}
                    {isLoading && loadingSpinner()}
                    <TotalPriceButton
                        price={offer.price}
                        proceedButtonTitle="Proceed"
                        disabled={!passengerDetailsValid}
                        onProceedClicked={savePassengerDetailsAndProceed}
                    />
                </div>
                <Footer/>

            </div>
        </>
    )
}
