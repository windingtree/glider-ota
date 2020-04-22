import React, {useState,useEffect} from 'react';
import Header from '../components/common/header/header';
import {Button, Container,  Row, Col} from "react-bootstrap";
import FlightDetail from "../components/flights-offer-details/flight-detailed-view"
import {useHistory} from "react-router-dom";
import {retrieveSearchResultsFromLocalStorage} from "../utils/search"


export default function FlightOffer({match}) {
    let offerId = match.params.offerId;
    let combinationId = match.params.combinationId;

    let searchResults = retrieveSearchResultsFromLocalStorage();
    console.log("Search results from local storage:",searchResults)
    let selectedCombination = findCombination(searchResults,combinationId)
    console.log(" selectedCombination:",selectedCombination)
    let selectedOffer = findSelectedOffer(selectedCombination,offerId);
    console.log(" selectedOffer:",selectedOffer)


    return (
        <>
            <div>
                <Header type='violet'/>
                combinaitonID:{combinationId}
                combinaitonID:{combinationId}
               <FlightDetail
                    selectedCombination={selectedCombination}
                    selectedOffer={selectedOffer}
                    searchResults={searchResults}/>
            </div>
        </>
    )
}


function findCombination(searchResults,combinationId){
    console.log("findCombination",combinationId)
    let selectedCombination = searchResults.combinations.find(c => {
        console.log("findCombination - check",c.combinationId)
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
