import React, {useState,useEffect} from 'react';
import Header from '../components/common/header/header';
import {useHistory} from "react-router-dom";
import {retrieveOfferFromLocalStorage} from "../utils/search"


export default function SeatmapPage({match}) {
    let offerId = match.params.offerId;
    let offer = retrieveOfferFromLocalStorage(offerId);
    return (
        <>
            <div>
                <Header violet={true}/>
                <div className='root-container-subpages'>

                    Seatmap for offer: {offerId}


                </div>
            </div>
        </>
    )
}
