import React, {useState,useEffect} from 'react';
import Header from '../components/common/header/header';
import {Button, Container,  Row, Col} from "react-bootstrap";
import FlightDetail from "../components/flightdetails/flight-detailed-view"
import {useHistory} from "react-router-dom";
import {retrieveSearchResultsFromLocalStorage} from "../utils/search"


export default function FlightOffer({match}) {
    let offerId = match.params.offerId;
    let combinationId = match.params.combinationId;

    let searchResults = retrieveSearchResultsFromLocalStorage();
    let selectedCombination = findCombination(searchResults,combinationId)
    let selectedOffer = findSelectedOffer(selectedCombination,offerId);


    return (
        <>
            <div>
                <Header type='violet'/>
               <FlightDetail
                    selectedCombination={selectedCombination}
                    selectedOffer={selectedOffer}
                    searchResults={searchResults}/>
            </div>
        </>
    )
}


function findCombination(searchResults,combinationId){
    let selectedCombination = searchResults.combinations.find(c => {
        return c.combinationId === combinationId
    })
    return selectedCombination;
}

function findSelectedOffer(combination,offerId){
    let selectedOffer = combination.offers.find(o => {
        return o.offerId === offerId
    })
    return selectedOffer;
}
