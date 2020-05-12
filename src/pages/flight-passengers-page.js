import React, {useState,useEffect} from 'react';
import Header from '../components/common/header/header';
import {useHistory} from "react-router-dom";
import {retrieveOfferFromLocalStorage} from "../utils/search"
import {Button} from "react-bootstrap";


export default function FlightPassengersPage({match}) {
    let history = useHistory();
    let offerId = match.params.offerId;
    let offer = retrieveOfferFromLocalStorage(offerId);

    function onProceedButtonClick(){
        let url='/flights/seatmap/'+offerId;
        history.push(url);
    }

    return (
        <>
            <div>
                <Header violet={true}/>
                <div className='root-container-subpages'>

                    Passenger details: {offerId}

                    <Button className='primary' onClick={onProceedButtonClick}>Proceed to seatmap</Button>
                </div>
            </div>
        </>
    )
}
