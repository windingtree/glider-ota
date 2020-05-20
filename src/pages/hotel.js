import React, {useState,useEffect} from 'react';
import Header from '../components/common/header/header';
import {retrieveSearchResultsFromLocalStorage} from "../utils/local-storage-cache"
import HotelDetails from "../components/hotels/hotel-details"

export default function Hotel({match}) {
    let accommodationId = match.params.accommodationId;
    let searchResults = retrieveSearchResultsFromLocalStorage();
    let hotel  = searchResults.accommodations[accommodationId];
    return (
        <>
            <div>
                <Header type='violet'/>
                <HotelDetails hotel={hotel} searchResults={searchResults}/>
            </div>
        </>
    )
}
