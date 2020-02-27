import {Button, Col, Container, Row} from "react-bootstrap";
import React from "react";
import OfferUtils from "../../utils/offer-utils";


export default class FlightRates extends React.Component{
    constructor(props) {
        super(props);
        const {selectedCombination,selectedOffer,pricePlans}=this.props
        console.log("Offers in constructor",selectedCombination.offers)
        this.plansManager = new PricePlansManager(selectedCombination.offers,pricePlans);
        this.plansManager.setSelectedOfferId(selectedOffer.offerId)
        this.handlePricePlanSelection=this.handlePricePlanSelection.bind(this);
    }

    handlePricePlanSelection(itinId,pricePlanId){
        console.log("Price plan selected, itinID:",itinId,", price plan:",pricePlanId)
        this.plansManager.pricePlanSelected(itinId,pricePlanId)

    }



    render() {
        const {selectedCombination,selectedOffer,pricePlans} = this.props;
        let offers = selectedCombination.offers;
        const itineraries = selectedCombination.itinerary;
        // let availablePricePlans=getAllPossiblePricePlans(selectedCombination.offers)
        const returnItinExists = OfferUtils.doesReturnItineraryExist(selectedCombination);

        console.log(this.plansManager);
        return (
            <Container>
                <Row>
                    <Col>
                        <h2>Airline rates</h2>
                        {/*
                    {
                        availablePricePlans.map(plan => {
                            return (<div>{plan.offerId}</div>)
                        })
                    }
*/}
                    </Col>
                </Row>
                {<DisplayItineraryRates itinerary={itineraries[0]} plansManager={this.plansManager} onPricePlanSelected={this.handlePricePlanSelection}/>}
                {returnItinExists && (
                    <DisplayItineraryRates itinerary={OfferUtils.getReturnItinerary(selectedCombination)} plansManager={this.plansManager} onPricePlanSelected={this.handlePricePlanSelection}/>)}
            </Container>
        )
    }
}


function DisplayItineraryRates({itinerary, plansManager, onPricePlanSelected}){
    let itineraryId=itinerary.itinId;
    let availablePricePlans = plansManager.getItineraryUniquePricePlans(itinerary.itinId)
    // let possiblePlans = getAllPossiblePricePlansForItinerary(itineraryId,selectedCombination.offers)
    let departureCity=OfferUtils.getItineraryDepartureCityName(itinerary);
    let arrivalCity=OfferUtils.getItineraryArrivalCityName(itinerary)
    console.log("availablePricePlans",availablePricePlans)
    return (<>
  {/*      <Row>
            <Col>
                <h4>Flight#1</h4>
            </Col>
        </Row>*/}
        <Row>
            <Col>
                <h5>{departureCity} - {arrivalCity}</h5>
            </Col>
        </Row>
        <Row>
            <Col>
     {
                    availablePricePlans.map((pricePlanId)=>{
                        let allPricePlans=plansManager.getAllPricePlans();
                        return (<PricePlan  itineraryId={itineraryId} pricePlanId={pricePlanId} plansManager={plansManager} onPricePlanSelected={onPricePlanSelected}/>)
                    })
                }
            </Col>
        </Row>
    </>)
}


function PricePlan({itineraryId, plansManager, pricePlanId, onPricePlanSelected}) {
    let pricePlan = plansManager.getAllPricePlans()[pricePlanId];
    return(
        <span className='offer-detail--priceplan'>
            {itineraryId}:{pricePlanId}:{pricePlan.name}
            <Button onClick={() => {onPricePlanSelected(itineraryId,pricePlanId)}}>Select</Button>
        </span>
    )
}


class PricePlansManager{
    constructor(offers, allPricePlans) {
        this.pricePlanCombinations = undefined;
        this.cheapestOffer=undefined;
        this.selectedOfferId=undefined;
        this.allPricePlans=allPricePlans;
        this.selectedItinPlan=[];
        this.offers=offers;
        this.initialize(offers);
    }



    /**
     * find all possible price plans combinations for selected flights
     */
    initialize() {
        let itinPricePlans = []
        //iterate over all available offers of a selected flight combination
        this.offers.map(offer => {
            //for each offer, store: offerID, price and flights with associated price plans
            itinPricePlans.push({
                    offerId: offer.offerId,
                    flightCombination: offer.flightCombination,
                    price: offer.offer.price
                }
            )
        })
        itinPricePlans.sort((a,b)=>{return a.price.public>b.price.public?1:-1})
        console.log("After sort",itinPricePlans)
        this.cheapestOffer = itinPricePlans[0];
        const cheapestPrice = this.cheapestOffer.price.public;
        itinPricePlans.map(r=>{
            r.upsellPrice = r.price.public-cheapestPrice
        })

        this.pricePlanCombinations=itinPricePlans;
    }


    getItineraryUniquePricePlans(itineraryId){
        let results = []
        this.pricePlanCombinations.map(rec=>{
            rec.flightCombination.map(f=>{
                if(f.flight === itineraryId){
                    if(results.indexOf(f.pricePlan)<0)
                        results.push(f.pricePlan)
                }
            })
        })
        return results;
    }

    containsFlight(flight,flightCombinations){

    }

    getAllPricePlans(){
        return this.allPricePlans;
    }

    pricePlanSelected(itinId,pricePlanId){
        this.selectedItinPlan[itinId]=pricePlanId;
        console.log( "this.selectedItinPlan:",this.selectedItinPlan)
    }
    setSelectedOfferId(offerId){
        let offer = this.findOffer(offerId);

        offer.flightCombination.map(r=>{
            this.selectedItinPlan[r.flight]=r.pricePlan;
        })
        console.log("setSelectedOfferId:",offerId, "this.selectedItinPlan:",this.selectedItinPlan)
    }

    findOffer(offerId){
        let offer=this.offers.find(r=>r.offerId === offerId);
        return offer;
    }
}
