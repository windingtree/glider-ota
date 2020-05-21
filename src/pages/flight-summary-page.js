import React, {useState,useEffect} from 'react';
import Header from '../components/common/header/header';
import {useHistory} from "react-router-dom";
import {retrieveOfferFromLocalStorage} from "../utils/local-storage-cache"
import {Button} from "react-bootstrap";
import PaxSummary from "../components/passengers/pax-summary";
import {repriceShoppingCartContents, retrievePassengerDetails} from "../utils/api-utils";
import TotalPriceButton from "../components/common/totalprice/total-price";
import PaymentSummary from "../components/payment/payment-summary";


export default function FlightSummaryPage({match}) {
    let history = useHistory();
    const [passengerDetails,setPassengerDetails] = useState();
    const [confirmedOffer,setConfirmedOffer] = useState();
    let offerId = match.params.offerId;

    let offer = retrieveOfferFromLocalStorage(offerId);


    function onProceedButtonClick(){

    }

    console.log("FlightSummaryPage, offerID:",offerId," offer from local storage:", offer)

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
        let response=repriceShoppingCartContents();
        response.then(offer=>{
            console.log("Repriced offer:", offer);
            setConfirmedOffer(offer)
        }).catch(err=>{
            console.error("Failed to reprice cart", err);
            //TODO - add proper error handling (show user a message)
        })
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
                    {passengerDetails && <PaxSummary passengers={passengerDetails} onEditFinished={onEditFinished}/>}
                    {confirmedOffer && <PaymentSummary totalPrice={confirmedOffer.offer.price} pricedItems={confirmedOffer.offer.pricedItems} />}
                    {confirmedOffer && <TotalPriceButton price={confirmedOffer.offer.price} proceedButtonTitle="Proceed to payment" onProceedClicked={onProceedButtonClick}/>}
                </div>
            </div>
        </>
    )
}
