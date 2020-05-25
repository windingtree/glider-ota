import React, { useState, useEffect } from 'react';
import Header from '../components/common/header/header';
import {useHistory} from "react-router-dom";
import SeatMap from '../components/seatmap'
import {retrieveOfferFromLocalStorage} from "../utils/local-storage-cache"
import { retrieveSeatmap } from '../utils/api-utils';
import Spinner from "../components/common/spinner"


export default function FlightSeatmapPage({match}) {
    let history = useHistory();
    let offerId = match.params.offerId;
    let segmentId = match.params.segmentId;
    //let offer = retrieveOfferFromLocalStorage(offerId);

    // Get the Details from API and storage
    // @fixme: To be implemented with Glider API
    const [isLoading, setIsLoading] = useState(false);
    const [indexedSeatmap, setIndexedSeatmap] = useState();
    const [currentSegmentKey, setCurrentSegmentKey] = useState();

    useEffect(() => {
        // Prepare spinner
        setIsLoading(true);

        // Load the seat map
        retrieveSeatmap()
            // Load results in state
            .then(res => {
                setIndexedSeatmap(res);
            })

            // Handle error
            .catch(console.log)

            // Stop spinner
            .finally(() => {
                setIsLoading(false);
            })
    }, []);

    let cabin, segment, passengers, initialPrice, currency;

    // Proceed to summary
    const proceedToSummary = () => {
        let url='/flights/summary/'+ offerId
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

    // Display the current seatmap
    const currentSeatmap = () => {
        if(indexedSeatmap) {
            return (
                <SeatMap
                    cabin={cabin}
                    segment={segment}
                    passengers={passengers}
                    initialPrice={initialPrice}
                    currency={currency}
                    handleSeatMapContinue={handleContinue}
                    handleSeatMapSkip={handleSkip}
                />
            );
        }
    };



    return (
        <>
            <div>
                <Header violet={true}/>
                <div className='root-container-subpages'>
                    <div>Seatmap for offer: {offerId}, segmentId:{segmentId}</div>
                    <Spinner enabled={isLoading}/>
                    {currentSeatmap()}
                </div>
            </div>
        </>
    );
}