import React, {useState, useEffect} from 'react';
import Header from '../components/common/header/header';
import {useHistory} from "react-router-dom";
import {retrieveSearchResultsFromLocalStorage} from "../utils/local-storage-cache"
import {Button, Col, Container, Row} from "react-bootstrap";
import {config} from "../config/default";
import TripRates from "../components/flightdetails/flight-rates";
import {withRouter} from 'react-router'
import {SearchResultsWrapper} from "../utils/flight-search-results-transformer";

export default function FlightFareFamiliesPage({match}) {
    let history = useHistory();
    let offerId = match.params.offerId;
    let searchResults = retrieveSearchResultsFromLocalStorage();
    let searchResultsWrapper = new SearchResultsWrapper(searchResults);
    let itineraries = searchResultsWrapper.getOfferItineraries(offerId);
    let tripRates = searchResultsWrapper.generateTripRatesData(offerId)

    let selectedOffer = tripRates.offers[offerId]

    function onProceedButtonClick() {
        let url = '/flights/passengers/' + offerId;
        history.push(url);
    }


    return (
        <>
            <div>
                <Header violet={true}/>
                <div className='root-container-subpages'>
                    <FareFamilies
                        tripRates={tripRates}
                        selectedOffer={selectedOffer}/>
                    <Button className='primary' onClick={onProceedButtonClick}>Proceed to passenger details</Button>
                </div>
            </div>
        </>
    )
}

export function FareFamilies({tripRates, selectedOffer}) {
    const [currentOffer, setCurrentOffer] = useState(selectedOffer)
    let history = useHistory();

    function handlePayButtonClick() {
        console.log("handlePayButtonClick")
    }
    function handleSelectedOfferChange(offerId) {
        console.log("Offer changed", offerId)
        displayOffer(offerId)
    }

    function displayOffer(offerId){
        let url='/flights/farefamilies/'+offerId;
        history.push(url);
    }
    console.log("FareFamilies render, selected offer", selectedOffer)
    let itineraries = tripRates.itineraries;

    return (
        <>
            {config.DEBUG_MODE && <span>{selectedOffer.offerId}</span>}
            <Container fluid={true}>
                <Row>
                    <Col>
                        {/*<TripDetails itineraries={selectedCombination.itinerary}/>*/}
                    </Col>
                </Row>

                <Row>
                    <Col>
                        <TripRates itineraries={itineraries} tripRates={tripRates} selectedOffer={currentOffer}
                                   onOfferChange={handleSelectedOfferChange}/>
                    </Col>
                </Row>
                <Row className='pb-5'>
                    <Col>
                        <PriceSummary price={currentOffer.price} onPayButtonClick={handlePayButtonClick}/>
                    </Col>
                </Row>

                <Row className='pb-5'>

                </Row>

            </Container>
        </>
    )
}


const PriceSummary = ({price, onPayButtonClick}) => {
    return (
        <>
            <Row className='pt-5'>
                <Col>
                    <div className='glider-font-h2-fg'>Total price {price.public} {price.currency} </div>
                </Col>

            </Row>
        </>
    )
}


FareFamilies = withRouter(FareFamilies)
