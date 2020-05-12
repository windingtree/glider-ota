import React, {useState,useEffect} from 'react';
import Header from '../components/common/header/header';
import {useHistory} from "react-router-dom";
import {retrieveOfferFromLocalStorage} from "../utils/search"
import {Button} from "react-bootstrap";


export default function FlightSummaryPage({match}) {
    let history = useHistory();
    let offerId = match.params.offerId;
    let offer = retrieveOfferFromLocalStorage(offerId);

    function onProceedButtonClick(){

    }

    return (
        <>
            <div>
                <Header violet={true}/>
                <div className='root-container-subpages'>

                    Summary: {offerId}

                    <Button className='primary' onClick={onProceedButtonClick}>Pay</Button>
                </div>
            </div>
        </>
    )
}
