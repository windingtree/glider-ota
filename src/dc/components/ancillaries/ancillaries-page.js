import React, {useState, useEffect} from 'react';
import {Col, Row} from "react-bootstrap";
import TripRates from "./fare-families/flight-rates";

import {useHistory} from "react-router-dom";
import {FlightSearchResultsWrapper} from "../../../utils/flight-search-results-wrapper";
import {storeSelectedOffer} from "../../../utils/api-utils";
import _ from 'lodash';
import Button from "react-bootstrap/Button";
import {addFlightToCartAction, flightOfferSelector, flightResultsSelector} from "../../../redux/sagas/cart";
import {connect} from "react-redux";


export  function AncillariesSelection({offerId, searchResults, setSelectedOffer}) {
    let history = useHistory();
    console.log(`AncillariesSelection, offerId:${offerId}, searchResults:`,searchResults)
    let searchResultsWrapper;
    let tripRates;
    let selectedOffer;

    if(searchResults){
        searchResultsWrapper = new FlightSearchResultsWrapper(searchResults);
        tripRates = searchResultsWrapper.generateTripRatesData(offerId);
        selectedOffer = tripRates.offers[offerId]
    }


    function onBackButtonClick() {
        let url='/dc/pax';
        history.push(url);
    }
    function onProceedButtonClick() {
        let url='/dc/seatmap';
        history.push(url);
    }

    function handleOfferChange(offerId){
        if(!searchResultsWrapper)
            return;

        let offer=searchResultsWrapper.getOffer(offerId);
        // offerId,offer,price,itineraries
        let itineraries = searchResultsWrapper.getOfferItineraries(offerId);
        let price = offer.price;
        setSelectedOffer(offerId,offer,price,itineraries);
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

    if(!searchResults){
        return (<></>)
    }

    return (
        <>
            <div>
                <div className='root-container-subpages'>

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
    let baselineFare = _.get(history,'location.state.baselineFare');
    function handleSelectedOfferChange(offerId) {
        // displayOffer(offerId);
        onSelectedOfferChange(offerId)
    }

    function displayOffer(offerId){
        let url='/flights/farefamilies/'+offerId;
        history.push(url, { baselineFare:baselineFare});
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


const mapStateToProps = state => ({
    searchResults:flightResultsSelector(state),
    offerId: flightOfferSelector(state)?flightOfferSelector(state).offerId:undefined,
});


const mapDispatchToProps = (dispatch) => {
    return {
        setSelectedOffer: (offerId,offer,price,itineraries) =>{
            dispatch(addFlightToCartAction(offerId,offer,price,itineraries));
        }
    }
}

// FareFamilies = withRouter(FareFamilies)

export default connect(mapStateToProps, mapDispatchToProps)(AncillariesSelection);
