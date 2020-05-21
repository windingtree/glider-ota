import React, {useState, useEffect} from 'react';
import Header from '../components/common/header/header';
import {useHistory} from "react-router-dom";
import {retrieveSearchResultsFromLocalStorage} from "../utils/local-storage-cache"
import {Button, Col, Container, Row} from "react-bootstrap";
import TripRates from "../components/flightdetails/flight-rates";
import {withRouter} from 'react-router'
import {SearchResultsWrapper} from "../utils/flight-search-results-transformer";
import TotalPriceButton from "../components/common/totalprice/total-price";
import {storePassengerDetails, storeSelectedOffer} from "../utils/api-utils";

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

    function handleOfferChange(offerId){
        let offer=searchResultsWrapper.getOffer(offerId);
        let results = storeSelectedOffer(offer);
        results.then((response) => {
            console.debug("Selected offer successfully added to a shopping cart", response);
        }).catch(err => {
            console.error("Failed to add selecteed offer to a shopping cart", err);
            //TODO - add proper error handling (show user a message)
        })
    }


    return (
        <>
            <div>
                <Header violet={true}/>
                <div className='root-container-subpages'>
                    <FareFamilies
                        tripRates={tripRates}
                        selectedOffer={selectedOffer}  onSelectedOfferChange={handleOfferChange}/>
                    <TotalPriceButton price={selectedOffer.price} proceedButtonTitle="Proceed" onProceedClicked={onProceedButtonClick}/>
                </div>
            </div>
        </>
    )
}

export function FareFamilies({tripRates, selectedOffer, onSelectedOfferChange}) {
    const [currentOffer, setCurrentOffer] = useState(selectedOffer)
    let history = useHistory();


    function handleSelectedOfferChange(offerId) {
        console.debug("Selected offer changed, new offerID", offerId)
        displayOffer(offerId);
        onSelectedOfferChange(offerId)
    }

    function displayOffer(offerId){
        let url='/flights/farefamilies/'+offerId;
        history.push(url);
    }
    let itineraries = tripRates.itineraries;
    return (
        <>
            <Container fluid={true}>
                <Row>
                    <Col>
                        <TripRates itineraries={itineraries} tripRates={tripRates} selectedOffer={currentOffer}
                                   onOfferChange={handleSelectedOfferChange}/>
                    </Col>
                </Row>
                <Row className='pb-5'>
                    <Col>
                        {/*<PriceSummary price={currentOffer.price} onPayButtonClick={handlePayButtonClick}/>*/}
                    </Col>
                </Row>

                <Row className='pb-5'>

                </Row>

            </Container>
        </>
    )
}


FareFamilies = withRouter(FareFamilies)
