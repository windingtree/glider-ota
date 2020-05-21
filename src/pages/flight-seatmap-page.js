import React, {useState,useEffect} from 'react';
import Header from '../components/common/header/header';
import {useHistory} from "react-router-dom";
import {retrieveOfferFromLocalStorage} from "../utils/search"
import SeatMap from '../components/seatmap'
import Button from "react-bootstrap/Button";


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
                    <div>Seatmap for offer: {offerId}, segmentId:{segmentId}</div>
                    <SeatMap/>
                    <Button
                        className='primary'
                        onClick={onProceedButtonClick}
                    >
                        Continue
                    </Button>
                </div>
            </div>
        </>
    )
}
