import React, {useState,useEffect} from 'react';
import Header from '../components/common/header/header';
import {useHistory} from "react-router-dom";
import {retrieveSearchResultsFromLocalStorage} from "../utils/search"
import {Button, Col, Container, Row} from "react-bootstrap";
import TripDetails from "../components/flightdetails/trip-details";


export default function FlightTripOverviewPage({match}) {
    let history = useHistory();
    let offerId = match.params.offerId;
    let combinationId = match.params.combinationId;

    let searchResults = retrieveSearchResultsFromLocalStorage();
    let selectedCombination = findCombination(searchResults,combinationId)
    let selectedOffer = findSelectedOffer(selectedCombination,offerId);


    function proceedButtonClick(){
        let url='/flights/farefamilies/'+combinationId+'/'+offerId;
        history.push(url);
    }

    return (
        <>
            <div>
                <Header violet={true}/>
                <div className='root-container-subpages'>
                    <Container fluid={true}>
                        <Row>
                            <Col >
                                <TripDetails itineraries={selectedCombination.itinerary}/>
                            </Col>
                        </Row>
                    </Container>
                </div>
                <Button className='primary' onClick={proceedButtonClick}>Proceed to fare family selection</Button>
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
