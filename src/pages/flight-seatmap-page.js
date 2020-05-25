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

    // Get the Details from API and storage
    // @fixme: To be implemented with Glider API
    let cabin, segment, passengers, initialPrice, currency;

    // Proceed to summary
    const proceedToSummary = () => {
        let url='/flights/summary/'+offerId
        history.push(url);
    }

    // Handle a click on continue in the seatmap
    const handleContinue = (selectedSeats) => {
        //@TODO: Add seats to basket and load next segment
        console.log('[SEATMAP PAGE] continue');
        proceedToSummary();
    };

    // Handle a click on skip on the seatmap
    const handleSkip = () => {
        //@TODO: Load next segment without adding items in basket
        console.log('[SEATMAP PAGE] Skip');
        proceedToSummary();
    };



    return (
        <>
            <div>
                <Header violet={true}/>
                <div className='root-container-subpages'>
                    <div>Seatmap for offer: {offerId}, segmentId:{segmentId}</div>
                    <SeatMap
                        cabin={cabin}
                        segment={segment}
                        passengers={passengers}
                        initialPrice={initialPrice}
                        currency={currency}
                        handleSeatMapContinue={handleContinue}
                        handleSeatMapSkip={handleSkip}
                    />
                </div>
            </div>
        </>
    )
}
