import React, {useState,useEffect} from 'react';
import Header from '../components/common/header/header';
import {useHistory} from "react-router-dom";
import {retrieveOfferFromLocalStorage, retrieveSearchResultsFromLocalStorage} from "../utils/search"
import {Button, Col, Container, Row} from "react-bootstrap";
import {config} from "../config/default";
import TripDetails from "../components/flightdetails/trip-details";
import TripRates from "../components/flightdetails/flight-rates";
import { withRouter } from 'react-router'

export default function FlightFareFamiliesPage({match}) {
    let history = useHistory();
    let offerId = match.params.offerId;
    let combinationId = match.params.combinationId;
    let itineraryId = match.params.itineraryId;
    let searchResults = retrieveSearchResultsFromLocalStorage();
    let selectedCombination = findCombination(searchResults,combinationId)
    let selectedOffer = findSelectedOffer(selectedCombination,offerId);

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
                        selectedCombination={selectedCombination}
                        selectedOffer={selectedOffer}
                        searchResults={searchResults}/>
                    <Button className='primary' onClick={onProceedButtonClick}>Proceed to passenger details</Button>
                </div>
            </div>
        </>
    )
}


class FareFamilies extends React.Component {
    constructor (props) {
        super(props);
        const {selectedCombination,selectedOffer}=props;
        this.state={
            selectedOfferId:selectedOffer.offerId,
            selectedCombination:selectedCombination,
            selectedOffer:selectedOffer,
            processingInProgress:false,
            processingError:undefined,
            order:undefined
        }
        this.handleSelectedOfferChange= this.handleSelectedOfferChange.bind(this);
    }

    handleSelectedOfferChange(newOffer){
        console.log("Offer changed",newOffer)
        this.setState({
            selectedOfferId:newOffer.offerId,
            selectedOffer:newOffer,
            // contact_details:[]
        })

        let cartItem = {
            offer:{
                offerId:newOffer.offerId,
                offerItems: newOffer.offer.offerItems
            }
        }
        console.log("Add to cart:",cartItem)
    }

    setOrderDetails(order){
        this.setState({order:order})
    }


    render () {

        const {selectedOffer} = this.state;
        console.log("Flight detailed view - selected ofer", selectedOffer)
        const {selectedCombination,searchResults} = this.props;
        let pricePlans = searchResults.pricePlans;


        return (
            <>
                {config.DEBUG_MODE && <span>{selectedOffer.offerId}</span>}
                <Container fluid={true}>
                    <Row>
                        <Col >
                            <TripDetails itineraries={selectedCombination.itinerary}/>
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            <TripRates selectedCombination={selectedCombination} pricePlans={pricePlans} selectedOffer={selectedOffer} onOfferChange={this.handleSelectedOfferChange}/>
                        </Col>
                    </Row>
                    <Row className='pb-5'>
                        <Col>
                            <PriceSummary price={selectedOffer.offer.price} onPayButtonClick={this.handlePayButtonClick}/>
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
