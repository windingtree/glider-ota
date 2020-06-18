import React, {useState, useEffect} from 'react';
import Header from '../components/common/header/header';
import {useHistory} from "react-router-dom";
import {retrieveSearchResultsFromLocalStorage} from "../utils/local-storage-cache"
import {Col, Container, Row} from "react-bootstrap";
import TripRates from "../components/flightdetails/flight-rates";
import {withRouter} from 'react-router'
import {FlightSearchResultsWrapper} from "../utils/flight-search-results-wrapper";
import TotalPriceButton from "../components/common/totalprice/total-price";
import {storeSelectedOffer} from "../utils/api-utils";
import Footer from "../components/common/footer/footer";

export default function FlightFareFamiliesPage({match}) {
    let history = useHistory();
    let offerId = match.params.offerId;
    let searchResults = retrieveSearchResultsFromLocalStorage();
    let searchResultsWrapper = new FlightSearchResultsWrapper(searchResults);
    let tripRates = searchResultsWrapper.generateTripRatesData(offerId);
    const passengers = history.location.state && history.location.state.passengers;

    let selectedOffer = tripRates.offers[offerId]
    if(!history.location.state.baselineFare){
        //it's the first load of 'fare families' page - we need to store fare selected by the user on the search result page in order to display incremental amount to be paid for each fare family
        history.location.state.baselineFare=selectedOffer.price;
        console.debug("baselineFare was not set - setting it to ",selectedOffer.price)
    }else{
        console.debug("baselineFare was already set ",history.location.state.baselineFare)
    }

    function onProceedButtonClick() {
        let url = '/flights/passengers/' + offerId;
        history.push(url, { passengers: passengers });
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


    //store initially selected offerID in cart
    useEffect(()=>{
        handleOfferChange(offerId)
    },[])
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
                <Footer/>

            </div>
        </>
    )
}

export function FareFamilies({tripRates, selectedOffer, onSelectedOfferChange}) {
    const [currentOffer, setCurrentOffer] = useState(selectedOffer)
    let history = useHistory();
    const passengers = history.location.state && history.location.state.passengers;
    let baselineFare = history.location.state.baselineFare;
    function handleSelectedOfferChange(offerId) {
        console.debug("Selected offer changed, new offerID", offerId)
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
