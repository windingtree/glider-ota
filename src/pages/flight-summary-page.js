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
import {SearchResultsWrapper} from "../utils/flight-search-results-transformer";
import Spinner from "../components/common/spinner"


function RenderPleaseWait(){
    return (
        <>
            <div className='glider-font-text24medium-fg'>
                Please wait while we are confirming your price with an airline
                <Spinner enabled={true}></Spinner>
            </div>
        </>
    )
}


export default function FlightSummaryPage({match}) {
    let history = useHistory();
    const [passengerDetails,setPassengerDetails] = useState();
    const [confirmedOffer,setConfirmedOffer] = useState();
    const [loadInProgress,setLoadInProgress] = useState(false);
    let offerId = match.params.offerId;
    let searchResults = retrieveSearchResultsFromLocalStorage();
    let searchResultsWrapper = new SearchResultsWrapper(searchResults);
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


    function repriceItemsInCart(){
        setLoadInProgress(true)
        let response=repriceShoppingCartContents();
        response.then(offer=>{
            console.log("Repriced offer:", offer);
            setConfirmedOffer(offer)
        }).catch(err=>{
            console.error("Failed to reprice cart", err);
            //TODO - add proper error handling (show user a message)
        }).finally(()=>{
            setLoadInProgress(false)
        });
    }




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
                    {passengerDetails && <PaxSummary passengers={passengerDetails} onEditFinished={onEditFinished}/>}
                    {confirmedOffer && <PaymentSummary totalPrice={confirmedOffer.offer.price} pricedItems={confirmedOffer.offer.pricedItems} />}
                    {confirmedOffer && <TotalPriceButton price={confirmedOffer.offer.price} proceedButtonTitle="Proceed to payment" onProceedClicked={onProceedButtonClick}/>}
                </div>
            </div>
        </>
    )
}

