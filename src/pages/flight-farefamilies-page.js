import React, {useState,useEffect} from 'react';
import Header from '../components/common/header/header';
import {useHistory} from "react-router-dom";
import {retrieveOfferFromLocalStorage} from "../utils/search"
import {Button} from "react-bootstrap";


export default function FlightFareFamiliesPage({match}) {
    let history = useHistory();
    let offerId = match.params.offerId;
    let itineraryId = match.params.itineraryId;
    let offer = retrieveOfferFromLocalStorage(offerId);

    function onProceedButtonClick(){
        let url='/flights/passengers/'+offerId;
        history.push(url);
    }

    return (
        <>
            <div>
                <Header violet={true}/>
                <div className='root-container-subpages'>

                    Fare family selection for offer: {offerId}, itineraryId:{itineraryId}

                    <Button className='primary' onClick={onProceedButtonClick}>Proceed to passenger details</Button>
                </div>
            </div>
        </>
    )
}
