import React, {useState, useEffect} from 'react';
import PaxDetails from './pax-details';
import {storePassengerDetails, retrievePassengerDetails} from '../../../utils/api-utils'
import Alert from 'react-bootstrap/Alert';
import Spinner from '../common/spinner';
import {
    flightOfferSelector,
    hotelOfferSelector, isShoppingCartInitializedSelector,
    requestCartUpdateAction
} from '../../../redux/sagas/shopping-cart-store';
import {connect} from 'react-redux';
import {Button, Col, Row} from 'react-bootstrap';
import {useHistory} from 'react-router-dom';

import {
    flightSearchResultsSelector,
    requestSearchResultsRestoreFromCache,
    isShoppingResultsRestoreInProgressSelector,
    isShoppingFlowStoreInitialized,
    hotelSearchResultsSelector
} from '../../../redux/sagas/shopping-flow-store';
import {JourneySummary} from '../flight-blocks/journey-summary';
import {HotelOfferSummary} from '../hoteldetails/hotel-offer-summary';


export function PaxDetailsContent(props) {
    const {
        flightSearchResults,
        hotelSearchResults,
        onRestoreSearchResults,
        onRestoreShoppingCart,
        refreshInProgress,
        isShoppingFlowStoreInitialized,
        isShoppingCartStoreInitialized,
        flightOffer,
        hotelOffer
    } = props;
    const [passengerDetails, setPassengerDetails] = useState();
    const [passengerDetailsValid, setPassengerDetailsValid] = useState(false);
    const [highlightInvalidFields, setHighlightInvalidFields] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    let history = useHistory();

    function onPaxDetailsChange(paxData, allPassengersDetailsAreValid) {
        setPassengerDetails(paxData)
        setPassengerDetailsValid(allPassengersDetailsAreValid)
    }

    //Populate form with either passengers from session (if e.g. user refreshed page or clicked back) or initialize with number of passengers (and types) specified in a search form
    useEffect(() => {
        if (!isShoppingFlowStoreInitialized) {
            //no search results in store - probably page was refreshed, try to restore search results from cache
            try {
                onRestoreSearchResults();
            } catch (err) {
                console.log('Restore from cache failed', err)
            }
        }

        if (!isShoppingCartStoreInitialized) {
            //same as above but for shopping cart - reload it first
            try {
                onRestoreShoppingCart();
            } catch (err) {
                console.log('Restore of cart failed', err)
            }
        }

        //only when we have cart and search results we can proceed with creating pax for
        if (isShoppingCartStoreInitialized === true && isShoppingFlowStoreInitialized === true) {
            //initialize passengers
            let passengers = passengerDetails || createInitialPassengersFromSearch(flightSearchResults, hotelSearchResults);
            let passengersFromSessionStorage = retrievePassengerDetailsFromSessionStorage();
            setIsLoading(true);
            let passengersFromShoppingCartPromise = retrievePassengerDetailsFromShoppingCart();
            passengersFromShoppingCartPromise.then(passengersFromShoppingCart => {

                // Index passengers (from search) to ease the update
                let indexedPassengers = passengers.reduce((acc, passenger) => {
                    acc[passenger.id] = passenger;
                    return acc;
                }, {});

                if (Array.isArray(passengersFromShoppingCart)) {
                    //we have passenger details already in shopping cart - probably page refresh or user came back to pax details page
                    // Assign each received passenger to the passengers, if id matches.
                    passengersFromShoppingCart.forEach(pax => {
                        if (indexedPassengers.hasOwnProperty(pax.id)) {
                            indexedPassengers[pax.id] = pax;
                        }
                    })
                    // Update the value
                    passengers = Object.values(indexedPassengers);
                }else{
                    if(Array.isArray(passengersFromSessionStorage)){
                        //here we have a case where there are passengers details stored in sessionStorage(probably previous search)
                        //in this scenario paxID from search most likely will not match with paxIDs in session storage (as it comes from different searches)
                        //we need to try to match passengers by their type, rather than paxID
                        let passengersFromSessionStorage = retrievePassengerDetailsFromSessionStorage();
                        //iterate over passengers from search
                        passengers.map(pax=>{
                            console.log('Pax from search to find data for:', pax)
                            //try to find passenger with same passenger type in sessionStorage and use it's data
                            let paxFromSession = passengersFromSessionStorage.find(p=>(p.type === pax.type));
                            if(paxFromSession){
                                console.log('Candidate from session:', paxFromSession)
                                //we found candidate (same pax type) in session
                                //use this passenger details
                                let searchPaxId = pax.id;   //we need to retain passenger ID from search
                                Object.assign(pax,paxFromSession);
                                pax.id = searchPaxId;       //prev step might have overriden passenger ID from search
                                console.log('Pax from search with data copied:', pax)
                                //now remove the passenger we already used from array so that we don't use it second time
                                passengersFromSessionStorage = passengersFromSessionStorage.filter(p=>(p.id !== paxFromSession.id));
                                console.log('passengersFromSessionStorage after removal:',passengersFromSessionStorage)
                            }
                        })
                        console.log('Final passengers to be used:',passengers)
                    }
                }
            }).catch(err => {
                console.error("Failed to load passenger details", err);
                //TODO - add proper error handling (show user a message)
            }).finally(() => {
                setIsLoading(false);
                setPassengerDetails(passengers);
            })
        }
    }, [isShoppingCartStoreInitialized, isShoppingFlowStoreInitialized]);

    function redirectToPrevStep() {
        let url = '/dc/';
        history.push(url);
    }

    //redirect to the next page in the flow
    function redirectToNextStep() {
        let url = '/dc/ancillaries';
        if (!flightOffer) {   //if there are no flights in cart - redirect to summary
            url = '/dc/summary';
        }
        history.push(url);
    }

    function storePassengerDetailsInSessionStorage(passengerDetails){
        try{
            sessionStorage.setItem('passengerDetails', JSON.stringify(passengerDetails))
        }catch(err){
            console.error(err)
        }
    }
    function retrievePassengerDetailsFromSessionStorage(){
        try{
            let data = sessionStorage.getItem('passengerDetails')
            return JSON.parse(data)
        }catch(err){
            console.error(err)
        }
    }

    function storePassengerDetailsInShoppingCart(passengerDetails){
        return storePassengerDetails(passengerDetails);
    }

    function retrievePassengerDetailsFromShoppingCart(){
        return retrievePassengerDetails();
    }

    function savePassengerDetailsAndProceed() {
        setIsLoading(true);
        //store pax details in session storage so that it can be reused with consecutive searches
        storePassengerDetailsInSessionStorage(passengerDetails);
        //store pax details also in cart
        let results = storePassengerDetailsInShoppingCart(passengerDetails);
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
                <span>Please wait...</span>
            </div>
        );

    }


    /**
     * if initial search was for e.g. 2 adults and 1 child, we need to initialize passenger form with 2 adults and 1 child.
     * This function does that (based on search form criteria)
     * @returns {[]}
     */
    const createInitialPassengersFromSearch = (flightSearchResults, hotelSearchResults) => {
        let searchResults = flightSearchResults ? flightSearchResults : hotelSearchResults;
        let paxData = searchResults.passengers;
        return Object.keys(paxData).map(paxId => {
            return {
                id: paxId,
                type: paxData[paxId].type
            }
        });
    }

    const displayFlightSummary = () => {
        return (<><JourneySummary itineraries={flightOffer.itineraries}/>
            <div className={'pb-1'}></div>
        </>)
    }
    const displayHotelSummary = () => {
        const {room, hotel, offer} = hotelOffer;
        return (<><HotelOfferSummary room={room} hotel={hotel} offer={offer}/>
            <div className={'pb-1'}></div>
        </>)
    }


    return (
        <div>
            {flightOffer && displayFlightSummary()}
            {hotelOffer && displayHotelSummary()}
            <PaxDetails
                passengers={passengerDetails}
                onDataChange={onPaxDetailsChange}
                highlightInvalidFields={highlightInvalidFields}
            />
            {highlightInvalidFields && PassengerInvalidAlert()}
            {(isLoading || refreshInProgress) && loadingSpinner()}
            <NaviButtons prevEnabled={true} nextEnabled={passengerDetailsValid} onPrev={redirectToPrevStep}
                         onNext={savePassengerDetailsAndProceed}/>
        </div>
    )
}

const NaviButtons = ({prevEnabled, nextEnabled, onPrev, onNext}) => {
    return (<>
            <Row className={'pt-3 pb-5'}>
                <Col xs={5} >
                    <Button className={'btn-block'} variant="outline-primary" disabled={prevEnabled === false}
                            onClick={onPrev}>Back</Button>
                </Col>
                <Col xs={0}>
                    <div className={'pt-2'}></div>
                </Col>
                <Col xs={5}>
                    <Button className={'btn-block'} variant="primary" disabled={nextEnabled === false}
                            onClick={onNext}>Proceed</Button>
                </Col>
            </Row></>
    )
}

const mapStateToProps = state => ({
    flightSearchResults: flightSearchResultsSelector(state),
    hotelSearchResults: hotelSearchResultsSelector(state),
    refreshInProgress: isShoppingResultsRestoreInProgressSelector(state),
    isShoppingFlowStoreInitialized: isShoppingFlowStoreInitialized(state),
    isShoppingCartStoreInitialized: isShoppingCartInitializedSelector(state),
    flightOffer: flightOfferSelector(state),
    hotelOffer: hotelOfferSelector(state),

});


const mapDispatchToProps = (dispatch) => {
    return {
        onRestoreSearchResults: () => {
            dispatch(requestSearchResultsRestoreFromCache());
        },
        onRestoreShoppingCart: () => {
            dispatch(requestCartUpdateAction());
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(PaxDetailsContent);
