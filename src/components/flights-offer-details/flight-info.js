import OfferUtils from "../../utils/offer-utils";
import {Col, Container, Image, Row} from "react-bootstrap";
import {format} from "date-fns";
import logo from "../../assets/airline_logo.png";
import React from "react";


export default function YourFlightInfo({combination}){
    if(combination===undefined){
        return (<>nothing to display</>)
    }

    const outboundItinerary = OfferUtils.getOutboundItinerary(combination);
    const returnItinerary = OfferUtils.doesReturnItineraryExist(combination)?OfferUtils.getReturnItinerary(combination) : undefined;


    return(
        <Container >
            <Row>
                <Col>
                    <h1>Your flights</h1>
                    <ItineraryHeader combination={combination}/>
                    <ItineraryDetails itinerary={outboundItinerary}/>
                    {returnItinerary!==undefined &&
                    <ItineraryDetails itinerary={returnItinerary}/>
                    }
                </Col>
            </Row>

        </Container>
    )
}


function ItineraryDetails({itinerary}){
    return (
        <Container className="offer-detail-container">
            <Row>
                <Col md={3} ><AirlineAndFlight itinerary={itinerary}/></Col>
                <Col ><DepartureAndArrivalInfo itinerary={itinerary}/></Col>
                <Col md={2} ><h5>{OfferUtils.calculateDuration(itinerary)}</h5>{/*<PricePlan/>*/}</Col>
            </Row>
        </Container>
    )
}
function DepartureAndArrivalInfo({itinerary}){
    let dptrDate=OfferUtils.getItineraryDepartureDate(itinerary);
    let arrivalDate=OfferUtils.getItineraryArrivalDate(itinerary);
    return (
        <Container >
            <Row>
                <h4>{OfferUtils.getItineraryDepartureCityName(itinerary)} - {OfferUtils.getItineraryArrivalCityName(itinerary)}</h4>
            </Row>
            <Row>
                <Col md={5}>
                    <h5>{format(dptrDate,'HH:mm')}<small>{format(dptrDate,'LLL dd (EEE)')}</small></h5>
                    <div><span>{OfferUtils.getItineraryDepartureAirportCode(itinerary)}</span>,<span>{OfferUtils.getItineraryDepartureAirportCode(itinerary)}</span></div>
                </Col>
                <Col><span>-</span></Col>
                <Col md={5}>
                    <h5>{format(arrivalDate,'HH:mm')}<small>{format(arrivalDate,'LLL dd (EEE)')}</small></h5>
                    <div><span>{OfferUtils.getItineraryArrivalCityName(itinerary)}</span>,<span>{OfferUtils.getItineraryArrivalAirportCode(itinerary)}</span></div>
                </Col>
            </Row>
        </Container>
    )
}
function ItineraryHeader({combination}){
    const outboundItinerary = OfferUtils.getOutboundItinerary(combination);
    const returnItinerary = OfferUtils.doesReturnItineraryExist(combination)?OfferUtils.getReturnItinerary(combination) : undefined;
    const depCityName = OfferUtils.getItineraryDepartureCityName(outboundItinerary);
    const arrivCityName = OfferUtils.getItineraryArrivalCityName(outboundItinerary);
    let departureDateStr = format(OfferUtils.getItineraryDepartureDate(outboundItinerary), 'LLL dd (EEE)')
    let returnDateStr = '';
    if(returnItinerary!==undefined){
        returnDateStr  = ' | '+format(OfferUtils.getItineraryDepartureDate(returnItinerary), 'LLL dd (EEE)');
    }


    return (
        <span >{depCityName}-{arrivCityName} | {departureDateStr} {returnDateStr}</span>
    )

}
function AirlineAndFlight({itinerary}){
    let operatingCarrier=OfferUtils.getItineraryOperatingCarrier(itinerary);
    return(
        <Container className='offer-detail--flightinfo'>
            <Row>
                <Col><Image src={logo} roundedCircle fluid/></Col>
                <Col>
                    <p>{operatingCarrier.airlineName} <small className="text-muted">{operatingCarrier.flight}</small></p>
                </Col>
            </Row>
        </Container>
    )
}
function PricePlan({pricePlan}) {
    return(
        <Container className='offer-detail--priceplan'>
            <Row>
                {/*{pricePlan.name}*/}
            </Row>
        </Container>
    )
}
