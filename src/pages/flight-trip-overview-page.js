import React, {useState,useEffect} from 'react';
import Header from '../components/common/header/header';
import {useHistory} from "react-router-dom";
import {retrieveSearchResultsFromLocalStorage} from "../utils/local-storage-cache"
import {Button, Col, Container, Row} from "react-bootstrap";
import TripDetails from "../components/flightdetails/trip-details";
import {FlightSearchResultsWrapper} from "../utils/flight-search-results-wrapper";
import TotalPriceButton from "../components/common/totalprice/total-price";


export default function FlightTripOverviewPage({match}) {
    console.debug("FlightTripOverviewPage, match:",match)
    let history = useHistory();
    let offerId = match.params.offerId;

    let searchResults = retrieveSearchResultsFromLocalStorage();
    let searchResultsWrapper = new FlightSearchResultsWrapper(searchResults);
    let selectedOffer = searchResultsWrapper.getOffer(offerId);
    let itineraries = searchResultsWrapper.getOfferItineraries(offerId);
    const passengers = history.location.state.passengers;

    function proceedButtonClick(){
        let url='/flights/farefamilies/'+offerId;
        history.push(url, { passengers: passengers });
    }

    return (
        <>
            <div>
                <Header violet={true}/>
                <div className='root-container-subpages'>
                    <div>
                        <Row>
                            <Col >
                                <TripDetails itineraries={itineraries}/>
                            </Col>
                        </Row>
                    </div>
                    <TotalPriceButton price={selectedOffer.price} proceedButtonTitle="Proceed" onProceedClicked={proceedButtonClick}/>
                </div>
            </div>
        </>
    )
}

