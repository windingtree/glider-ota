import React, {useState,useEffect} from 'react';
import Header from '../components/common/header/header';
import {useHistory} from "react-router-dom";
import {retrieveOfferFromLocalStorage} from "../utils/local-storage-cache"
import {Button} from "react-bootstrap";
import TotalPriceButton from "../components/common/totalprice/total-price";


export default function FlightSeatmapPage({match}) {
    let history = useHistory();
    let offerId = match.params.offerId;
    let segmentId = match.params.segmentId;
    let offer = retrieveOfferFromLocalStorage(offerId);

    function onProceedButtonClick(){
        let url='/flights/summary/'+offerId
        history.push(url);
    }

    return (
        <>
            <div>
                <Header violet={true}/>
                <div className='root-container-subpages'>

                    Seatmap for offer: {offerId}, segmentId:{segmentId}
                    <TotalPriceButton price={offer.price} proceedButtonTitle="Proceed" onProceedClicked={onProceedButtonClick}/>
                </div>
            </div>
        </>
    )
}
