import React, {useState,useEffect} from 'react';
import PaxDetails from "./pax-details";
import {storePassengerDetails,retrievePassengerDetails} from "../../../utils/api-utils"
import Alert from 'react-bootstrap/Alert';
import Spinner from "../common/spinner";
import DevConLayout from "../layout/devcon-layout";
import {flightOfferSelector, hotelOfferSelector, restoreCartFromServerAction} from "../../../redux/sagas/cart";
import {connect} from "react-redux";
import {Button} from "react-bootstrap";
import {useHistory} from "react-router-dom";

import {
    isFlightSearchInProgressSelector,
    isHotelSearchInProgressSelector,
    flightSearchResultsSelector,
    hotelSearchResultsSelector,
    requestSearchResultsRestoreFromCache
} from "../../../redux/sagas/shopping";


export function PaxDetailsContent({flightSearchResults,hotelSearchResults, onRestoreSearchResults, refreshInProgress}) {
    const [passengerDetails, setPassengerDetails] = useState();
    const [passengerDetailsValid,setPassengerDetailsValid] = useState(false);
    const [highlightInvalidFields, setHighlightInvalidFields] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    let history = useHistory();

    function onPaxDetailsChange(paxData, allPassengersDetailsAreValid){
        setPassengerDetails(paxData)
        setPassengerDetailsValid(allPassengersDetailsAreValid)
    }

    console.log('DCFlightPassengersPage')
    //Populate form with either passengers from session (if e.g. user refreshed page or clicked back) or initialize with number of passengers (and types) specified in a search form
    useEffect(()=>{
        if(!flightSearchResults && !hotelSearchResults){
            console.log('No shopping results - refresh first')
            onRestoreSearchResults();
            return
        }else{
            console.log('we have shopping results - initialize passengers')
        }


        let passengers = passengerDetails || createInitialPassengersFromSearch(flightSearchResults,hotelSearchResults);
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
    },[flightSearchResults,hotelSearchResults]);

    function redirectToNextStep(){
        let url='/dc/ancillaries';
        history.push(url);

    }

    function savePassengerDetailsAndProceed() {
        setIsLoading(true);
        let results = storePassengerDetails(passengerDetails);
            results.then((response) => {
                // console.debug("Successfully saved pax details", response);
                redirectToNextStep();
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

    // Display a loading spinner
    const syncInProgressSpinner = () => {
        return (
            <div>
                <Spinner enabled={true}/>
                <span>Please wait</span>
            </div>
        );

    }


    /**
     * if initial search was for e.g. 2 adults and 1 child, we need to initialize passenger form with 2 adults and 1 child.
     * This function does that (based on search form criteria)
     * @returns {[]}
     */
    function createInitialPassengersFromSearch(flightSearchResults,hotelSearchResults)
    {
        let searchResults = flightSearchResults?flightSearchResults:hotelSearchResults;
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
        <DevConLayout>
            <Button onClick={onRestoreSearchResults}>Restore search results</Button>
            {refreshInProgress && syncInProgressSpinner()}
                    <PaxDetails
                        passengers={passengerDetails}
                        onDataChange={onPaxDetailsChange}
                        highlightInvalidFields={highlightInvalidFields}
                    />
                    {highlightInvalidFields && PassengerInvalidAlert()}
                    {isLoading && loadingSpinner()}
                    <NextPageButton onClick={savePassengerDetailsAndProceed} disabled={passengerDetailsValid===false}/>
        </DevConLayout>
    )
}

const NextPageButton=({disabled,onClick}) => {
    return (<>
            <Button className={'btn-block'} variant="primary"  disabled={disabled} onClick={onClick}>Proceed</Button>
        </>
    )
}



const mapStateToProps = state => ({
    flightSearchResults:flightSearchResultsSelector(state),
    hotelSearchResults:hotelOfferSelector(state),
    refreshInProgress:(isFlightSearchInProgressSelector(state)===true || isHotelSearchInProgressSelector(state)===true)
});


const mapDispatchToProps = (dispatch) => {
    return {
        restoreCart: (offer) => {
            dispatch(restoreCartFromServerAction())
        },
        onRestoreSearchResults: () =>{
            dispatch(requestSearchResultsRestoreFromCache());
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(PaxDetailsContent);
