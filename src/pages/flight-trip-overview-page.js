import React, {useState,useEffect} from 'react';
import Header from '../components/common/header/header';
import {useHistory} from "react-router-dom";
import {retrieveSearchResultsFromLocalStorage} from "../utils/search"
import {Button, Col, Container, Row} from "react-bootstrap";
import TripDetails from "../components/flightdetails/trip-details";
import {SearchResultsWrapper} from "../utils/flight-search-results-transformer";


export default function FlightTripOverviewPage({match}) {
    let history = useHistory();
    let offerId = match.params.offerId;

    let searchResults = retrieveSearchResultsFromLocalStorage();
    let searchResultsWrapper = new SearchResultsWrapper(searchResults);
    let selectedOffer = searchResultsWrapper.getOffer(offerId);
    let itineraries = searchResultsWrapper.getOfferItineraries(offerId);

    function proceedButtonClick(){
        let url='/flights/farefamilies/'+offerId;
        history.push(url);
    }

    console.log("Selected offerID",offerId)
    console.log("Selected offer",selectedOffer)
    console.log("Selected offer itins",itineraries)

    return (
        <>
            <div>
                <Header violet={true}/>
                <div className='root-container-subpages'>
                    <Container fluid={true}>
                        <Row>
                            <Col >
                                <TripDetails itineraries={itineraries}/>
                            </Col>
                        </Row>
                    </Container>
                </div>
                <Button className='primary' onClick={proceedButtonClick}>Proceed to fare family selection</Button>
            </div>
        </>
    )
}

