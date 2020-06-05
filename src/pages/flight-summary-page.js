import React, {useState,useEffect} from 'react';
import Header from '../components/common/header/header';
import {useHistory} from "react-router-dom";
import {retrieveOfferFromLocalStorage, retrieveSearchResultsFromLocalStorage} from "../utils/local-storage-cache"
import {Button} from "react-bootstrap";
import PaxSummary from "../components/passengers/pax-summary";
import {repriceShoppingCartContents, retrievePassengerDetails} from "../utils/api-utils";
import TotalPriceButton from "../components/common/totalprice/total-price";
import PaymentSummary from "../components/payment/payment-summary";
import {RouteOverview} from "../components/flightdetails/trip-details";
import {FlightSearchResultsWrapper} from "../utils/flight-search-results-wrapper";
import Spinner from "../components/common/spinner";
import Alert from 'react-bootstrap/Alert';


function RenderPleaseWait(){
    return (
        <>
            <div className='glider-font-text24medium-fg'>
                Please wait while we are confirming your price with the airline
                <Spinner enabled={true}></Spinner>
            </div>
        </>
    )
}


export default function FlightSummaryPage({match}) {
    let history = useHistory();
    const [passengerDetails, setPassengerDetails] = useState();
    const [confirmedOffer, setConfirmedOffer] = useState();
    const [loadInProgress, setLoadInProgress] = useState(false);
    const [pricingFailed, setPricingFailed] = useState(false);
    let offerId = match.params.offerId;
    let searchResults = retrieveSearchResultsFromLocalStorage();
    let searchResultsWrapper = new FlightSearchResultsWrapper(searchResults);
    let itineraries = searchResultsWrapper.getOfferItineraries(offerId);

    let offer = retrieveOfferFromLocalStorage(offerId);


    function onProceedButtonClick(){
        let url='/payment/'+confirmedOffer.offerId;
        history.push(url);
    }

    console.debug("FlightSummaryPage, offerID:",offerId," offer from local storage:", offer)

    function onEditFinished(){
        loadPassengerDetailsFromServer();
    }

    function loadPassengerDetailsFromServer(){
        let response=retrievePassengerDetails();
        response.then(passengers=>{
            setPassengerDetails(passengers);
        }).catch(err=>{
            console.error("Failed to load passenger details", err);
            //TODO - add proper error handling (show user a message)
        })
    }

    // Validate the price of the shopping cart
    function repriceItemsInCart() {
        setLoadInProgress(true);
        setPricingFailed(false);
        let response=repriceShoppingCartContents();
        response.then(offer=>{
            console.log("Repriced offer:", offer);
            setConfirmedOffer(offer)
        }).catch(err=>{
            console.error("Failed to reprice cart", err);
            setPricingFailed(true);
        }).finally(()=>{
            setLoadInProgress(false)
        });
    }

    const PricingErrorAlert = () => (
        <Alert variant="danger">
            <Alert.Heading>We could not confirm your final price</Alert.Heading>
            <p>
                We are sorry, we could not confirm the final price with the airline.
                This indicates that this itinerary can not be sold at the moment.
                Please retry or change your itinerary.
            </p>
            <Button
                onClick={repriceItemsInCart}
                disabled={loadInProgress}>
                Retry
            </Button>
            <Button
                variant="secondary"
                onClick={()=>history.push('/flights')}
                disabled={loadInProgress}>
                New Search
            </Button>
        </Alert>
    );

    //Populate summary with passengers details from session
    useEffect(()=>{
        repriceItemsInCart();
        loadPassengerDetailsFromServer();
    },[])

    return (
        <>
            <div>
                <Header violet={true}/>
                <div className='root-container-subpages'>
                    <RouteOverview itineraries={itineraries}/>
                    {loadInProgress && <RenderPleaseWait/>}
                    {pricingFailed && PricingErrorAlert()}
                    {passengerDetails && <PaxSummary passengers={passengerDetails} onEditFinished={onEditFinished}/>}
                    {confirmedOffer && <PaymentSummary totalPrice={confirmedOffer.offer.price} pricedItems={confirmedOffer.offer.pricedItems} options={confirmedOffer.offer.options}/>}
                    {confirmedOffer && <TotalPriceButton price={confirmedOffer.offer.price} proceedButtonTitle="Proceed to payment" onProceedClicked={onProceedButtonClick}/>}
                </div>
            </div>
        </>
    )
}

