import React, {useState,useEffect} from 'react';
import Header from '../components/common/header/header';
import {useHistory} from "react-router-dom";
import {retrieveOfferFromLocalStorage} from "../utils/search"
import {Button} from "react-bootstrap";
import SeatMap from '../components/seatmap/seatmap'

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
                    <SeatMap/>

                    <Button className='primary' onClick={onProceedButtonClick}>Proceed to summary</Button>
                </div>
            </div>
        </>
    )
}
