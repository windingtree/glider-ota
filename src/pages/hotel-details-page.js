import React, {useState,useEffect} from 'react';
import Header from '../components/common/header/header';
import {retrieveSearchResultsFromLocalStorage} from "../utils/local-storage-cache"
import HotelDetails from "../components/hoteldetails/hotel-details"
import {HotelSearchResultsWrapper} from "../utils/hotel-search-results-wrapper";

export default function HotelDetailsPage({match}) {
    let accommodationId = match.params.accommodationId;
    console.log("accommodationId",accommodationId)
    let searchResults = retrieveSearchResultsFromLocalStorage();
    let searchResultsWrapper=new HotelSearchResultsWrapper(searchResults)
    let hotel  = searchResultsWrapper.getAccommodation(accommodationId)

    return (
        <>
            <div>
                <Header type='violet'/>
                <HotelDetails hotel={hotel} searchResults={searchResults}/>
            </div>
        </>
    )
}
