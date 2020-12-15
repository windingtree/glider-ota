import React, {useState,useEffect} from 'react';
import PaxDetails from "./pax-details";
import {storePassengerDetails,retrievePassengerDetails} from "../../../utils/api-utils"
import Alert from 'react-bootstrap/Alert';
import Spinner from "../common/spinner";
import DevConLayout from "../layout/devcon-layout";
import {
    flightOfferSelector,
    hotelOfferSelector, isShoppingCartInitializedSelector,
    requestCartRestoreFromServer
} from "../../../redux/sagas/shopping-cart-store";
import {connect} from "react-redux";
import {Button, Col, Row} from "react-bootstrap";
import {useHistory} from "react-router-dom";

import {
    flightSearchResultsSelector,
    requestSearchResultsRestoreFromCache, isShoppingResultsRestoreInProgressSelector, isShoppingFlowStoreInitialized
} from "../../../redux/sagas/shopping-flow-store";


export function PaxDetailsContent({flightSearchResults,hotelSearchResults, onRestoreSearchResults,onRestoreShoppingCart, refreshInProgress, isShoppingFlowStoreInitialized, isShoppingCartStoreInitialized, areStoresInitialized}) {
    const [passengerDetails, setPassengerDetails] = useState();
    const [passengerDetailsValid,setPassengerDetailsValid] = useState(false);
    const [highlightInvalidFields, setHighlightInvalidFields] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    let history = useHistory();
    console.log(`PaxDetailsContent refreshed,refreshInProgress=${refreshInProgress}, ${isShoppingFlowStoreInitialized}, ${isShoppingCartStoreInitialized},${areStoresInitialized}`);
    function onPaxDetailsChange(paxData, allPassengersDetailsAreValid){
        setPassengerDetails(paxData)
        setPassengerDetailsValid(allPassengersDetailsAreValid)
    }

    //Populate form with either passengers from session (if e.g. user refreshed page or clicked back) or initialize with number of passengers (and types) specified in a search form
    useEffect(()=>{

        if(!isShoppingFlowStoreInitialized){
            console.log('Initialize shopping flow')
            //no search results in store - probably page was refreshed, try to restore search results from cache
            onRestoreSearchResults();
            return
        }else{
            console.log('we have shopping results - initialize passengers')
        }

        if(!isShoppingCartStoreInitialized){
            console.log('Initialize shopping cart')
            onRestoreShoppingCart();
        }

        //initialize passengers
        let passengers = passengerDetails || createInitialPassengersFromSearch(flightSearchResults,hotelSearchResults);
        let response=retrievePassengerDetails();
        response.then(result=> {
            if(Array.isArray(result)) {
                // Index passengers to ease the update
                let indexedPassengers = passengers.reduce((acc, passenger) => {
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
            console.log('DCFlightPassengersPage - useEffect finally passengers:', passengerDetails)
            setPassengerDetails(passengers);
        })
    },[flightSearchResults,hotelSearchResults]);

    function redirectToPrevStep(){
        let url='/dc/';
        history.push(url);
    }
    function redirectToNextStep(){
        let url='/dc/ancillaries';
        history.push(url);
    }

    function savePassengerDetailsAndProceed() {
        setIsLoading(true);
        let results = storePassengerDetails(passengerDetails);
            results.then((response) => {
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
            {refreshInProgress && syncInProgressSpinner()}
            {/*<ItinerarySummary itinerary={itinerary}/>*/}
                    <PaxDetails
                        passengers={passengerDetails}
                        onDataChange={onPaxDetailsChange}
                        highlightInvalidFields={highlightInvalidFields}
                    />
                    {highlightInvalidFields && PassengerInvalidAlert()}
                    {isLoading && loadingSpinner()}
                    <NaviButtons prevEnabled={true} nextEnabled={passengerDetailsValid} onPrev={redirectToPrevStep} onNext={savePassengerDetailsAndProceed}/>
        </DevConLayout>
    )
}

const NaviButtons = ({prevEnabled, nextEnabled, onPrev, onNext})=>{
    return(
        <Row>
            <Col sm={4}>
                <Button className={'btn-block'} variant="outline-primary"  disabled={prevEnabled===false} onClick={onPrev}>Back</Button>
            </Col>
            <Col sm={4}>
            </Col>
            <Col sm={4}>
                <Button className={'btn-block'} variant="primary"  disabled={nextEnabled===false} onClick={onNext}>Proceed</Button>
            </Col>
        </Row>
    )
}
const PrevPageButton=({disabled,onClick}) => {
    return (<>
            <Button className={'btn-block'} variant="outline-primary"  disabled={disabled} onClick={onClick}>Back</Button>
        </>
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
    refreshInProgress:isShoppingResultsRestoreInProgressSelector(state),
    isShoppingFlowStoreInitialized: isShoppingFlowStoreInitialized(state),
    isShoppingCartStoreInitialized: isShoppingCartInitializedSelector(state)
});


const mapDispatchToProps = (dispatch) => {
    return {
        onRestoreSearchResults: () =>{
            dispatch(requestSearchResultsRestoreFromCache());
        },
        onRestoreShoppingCart: () =>{
            dispatch(requestCartRestoreFromServer());
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(PaxDetailsContent);
