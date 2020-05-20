import React, {useState,useEffect} from 'react';
import Header from '../components/common/header/header';
import {useHistory} from "react-router-dom";
import { retrieveSearchResultsFromLocalStorage} from "../utils/local-storage-cache"
import {Button, Col, Container, Row} from "react-bootstrap";
import {config} from "../config/default";
import TripRates from "../components/flightdetails/flight-rates";
import { withRouter } from 'react-router'
import {SearchResultsWrapper} from "../utils/flight-search-results-transformer";

export default function FlightFareFamiliesPage({match}) {
    let history = useHistory();
    let offerId = match.params.offerId;
    // let combinationId = match.params.combinationId;
    // let itineraryId = match.params.itineraryId;
    let searchResults = retrieveSearchResultsFromLocalStorage();
    let searchResultsWrapper = new SearchResultsWrapper(searchResults);
    let itineraries = searchResultsWrapper.getOfferItineraries(offerId);
    let tripRates=searchResultsWrapper.generateTripRatesData(offerId)


    // let selectedCombination = findCombination(searchResults,combinationId)
    let selectedOffer = tripRates.offers[offerId]

    function onProceedButtonClick(){
        let url='/flights/passengers/'+offerId;
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


class FareFamilies extends React.Component {
    constructor (props) {
        super(props);
        const {tripRates,selectedOffer}=props;
        this.state={
            // selectedOfferId:selectedOffer.offerId,
            // selectedCombination:selectedCombination,
            selectedOffer:selectedOffer,
            processingInProgress:false,
            processingError:undefined,
            order:undefined
        }
        this.handleSelectedOfferChange= this.handleSelectedOfferChange.bind(this);
    }

    handleSelectedOfferChange(newOffer){
        console.log("Offer changed",newOffer)
/*
        this.setState({
            selectedOfferId:newOffer.offerId,
            selectedOffer:newOffer,
            // contact_details:[]
        })
*/

        // console.log("Add to cart:",cartItem)
        /*let cartItem = {
            offer:{
                offerId:newOffer.offerId,
                offerItems: newOffer.offer.offerItems
            }
        }*/
    }

    setOrderDetails(order){
        // this.setState({order:order})
    }


    render () {
        const {tripRates,selectedOffer}=this.props;
        console.log("Flight detailed view - selected ofer", selectedOffer)
        let itineraries = tripRates.itineraries;

        return (
            <>
                {config.DEBUG_MODE && <span>{selectedOffer.offerId}</span>}
                <Container fluid={true}>
                    <Row>
                        <Col >
                            {/*<TripDetails itineraries={selectedCombination.itinerary}/>*/}
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            <TripRates itineraries={itineraries} tripRates={tripRates} selectedOffer={selectedOffer} onOfferChange={this.handleSelectedOfferChange}/>
                        </Col>
                    </Row>
                    <Row className='pb-5'>
                        <Col>
                            <PriceSummary price={selectedOffer.price} onPayButtonClick={this.handlePayButtonClick}/>
                        </Col>
                    </Row>

                    <Row className='pb-5'>

                    </Row>

                </Container>
            </>
        )
    }


}



const PriceSummary = ({price, onPayButtonClick}) =>{
    return (
        <>
            <Row className='pt-5'>
                <Col >
                    <div className='glider-font-h2-fg'>Total price {price.public} {price.currency} </div>
                </Col>

            </Row>
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

FareFamilies = withRouter(FareFamilies)
// export default FlightDetail;
