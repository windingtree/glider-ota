import React, {useState,useEffect} from 'react';
import Header from '../components/common/header/header';
import {useHistory} from "react-router-dom";
import {retrieveOfferFromLocalStorage} from "../utils/local-storage-cache"
import {Button} from "react-bootstrap";
import PaxSummary from "../components/passengers/pax-summary";
import {retrievePassengerDetails} from "../utils/api-utils";


export default function FlightSummaryPage({match}) {
    let history = useHistory();
    const [passengerDetails,setPassengerDetails] = useState()
    let offerId = match.params.offerId;
    let offer = retrieveOfferFromLocalStorage(offerId);

    function onProceedButtonClick(){

    }

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

    //Populate summary with passengers details from session
    useEffect(()=>{
        loadPassengerDetailsFromServer();
    },[])

    return (
        <>
            <div>
                <Header violet={true}/>
                <div className='root-container-subpages'>
                    <PaxSummary passengers={passengerDetails} onEditFinished={onEditFinished}/>
                    <Button className='primary' onClick={onProceedButtonClick}>Proceed to payment</Button>
                </div>
            </div>
        </>
    )
}
