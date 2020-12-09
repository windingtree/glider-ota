import React, {useState, useEffect} from 'react';
import {useHistory} from "react-router-dom";
import {Col, Row} from "react-bootstrap";
import TripRates from "../components/flightdetails/flight-rates";
import {withRouter} from 'react-router'
import {FlightSearchResultsWrapper} from "../../utils/flight-search-results-wrapper";
import TotalPriceButton from "../components/common/totalprice/total-price";
import {storeSelectedOffer} from "../../utils/api-utils";
import _ from 'lodash';
import Button from "react-bootstrap/Button";


export default function DCFlightOptionsPage({offerId, searchResults}) {
    let history = useHistory();
    let searchResultsWrapper = new FlightSearchResultsWrapper(searchResults);
    let tripRates = searchResultsWrapper.generateTripRatesData(offerId);
    const passengers = history.location.state && history.location.state.passengers;

    let selectedOffer = tripRates.offers[offerId]
    if(history.location.state && !history.location.state.baselineFare){
        //it's the first load of 'fare families' page - we need to store fare selected by the user on the search result page in order to display incremental amount to be paid for each fare family
        history.location.state.baselineFare=selectedOffer.price;
    }
    function onBackButtonClick() {
        let url='/dc/step1';
        history.push(url);
    }
    function onProceedButtonClick() {
        let url='/dc/step3';
        history.push(url);
    }

    function handleOfferChange(offerId){
        let offer=searchResultsWrapper.getOffer(offerId);
        let results = storeSelectedOffer(offer);
        results.then((response) => {
        }).catch(err => {
            console.error("Failed to add selecteed offer to a shopping cart", err);
            //TODO - add proper error handling (show user a message)
        })
    }


    //store initially selected offerID in cart
    useEffect(()=>{
        handleOfferChange(offerId)
    },[])
    return (
        <>
            <div>
                <div className='root-container-subpages'>
                    {/*for outbound and return display fare families (let user choose)*/}
                    <FareFamilies
                        tripRates={tripRates}
                        selectedOffer={selectedOffer}  onSelectedOfferChange={handleOfferChange}/>
                    {/*<TotalPriceButton price={selectedOffer.price} proceedButtonTitle="Proceed" onProceedClicked={onProceedButtonClick}/>*/}
                    <Button onClick={onBackButtonClick}>Back</Button>
                    <Button onClick={onProceedButtonClick}>Proceed to booking</Button>
                </div>
            </div>
        </>
    )
}

export function FareFamilies({tripRates, selectedOffer, onSelectedOfferChange}) {
    const [currentOffer] = useState(selectedOffer)
    let history = useHistory();
    const passengers = _.get(history,'location.state.passengers');
    let baselineFare = _.get(history,'location.state.baselineFare');
    function handleSelectedOfferChange(offerId) {
        displayOffer(offerId);
        onSelectedOfferChange(offerId)
    }

    function displayOffer(offerId){
        let url='/flights/farefamilies/'+offerId;
        history.push(url, { passengers: passengers,baselineFare:baselineFare});
    }
    let itineraries = tripRates.itineraries;
    return (
        <>
            <div>
                <Row>
                    <Col>
                        <TripRates itineraries={itineraries}
                                   tripRates={tripRates}
                                   selectedOffer={currentOffer}
                                   baselineFare={baselineFare}
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

            </div>
        </>
    )
}


FareFamilies = withRouter(FareFamilies)
