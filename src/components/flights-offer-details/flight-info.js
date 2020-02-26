import OfferUtils from "../../utils/offer-utils";
import {Col, Container, Image, Row} from "react-bootstrap";
import {format} from "date-fns";
import logo from "../../assets/airline_logo.png";
import React from "react";


export default function YourFlightInfo(props){

    let combination=props.combination;

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
                    <ItineraryHeader outboundItinerary={outboundItinerary} returnItinerary={returnItinerary}/>
                    <ItineraryDetails itinerary={outboundItinerary}/>
                    {returnItinerary!==undefined &&
                    <ItineraryDetails itinerary={returnItinerary}/>
                    }
                    {/*

              <h3 className="combination-detail-subtitle">{this.renderSubtitle(outboundItinerary,returnItinerary)}</h3>
*/}
                </Col>
            </Row>

        </Container>
    )
}


function ItineraryDetails(props){
    console.log("Itinerary",props.itinerary)
    return (
        <Container className="offer-detail-container">
            <Row>
                <Col md={3} className='border'><AirlineAndFlight itinerary={props.itinerary}/></Col>
                <Col className='border'><DepartureAndArrivalInfo itinerary={props.itinerary}/></Col>
                <Col md={3} className='border'><h5>{OfferUtils.calculateDuration(props.itinerary)}</h5><PricePlan/></Col>
            </Row>
        </Container>
    )
}
function DepartureAndArrivalInfo(props){
    let itin=props.itinerary;
    let dptrDate=OfferUtils.getItineraryDepartureDate(props.itinerary);
    let arrivalDate=OfferUtils.getItineraryArrivalDate(props.itinerary);
    return (
        <Container className='border'>
            <Row>
                <h4>{OfferUtils.getItineraryDepartureCityName(props.itinerary)} - {OfferUtils.getItineraryArrivalCityName(props.itinerary)}</h4>
            </Row>
            <Row>
                <Col md={4}>
                    <h5>{format(dptrDate,'HH:mm')}<small>{format(dptrDate,'LLL dd (EEE)')}</small></h5>
                    <div><span>{OfferUtils.getItineraryDepartureAirportCode(props.itinerary)}</span><span>{OfferUtils.getItineraryDepartureAirportCode(props.itinerary)}</span></div>
                </Col>
                <Col><span>-</span></Col>
                <Col md={4}>
                    <h5>{format(arrivalDate,'HH:mm')}<small>{format(arrivalDate,'LLL dd (EEE)')}</small></h5>
                    <div><span>{OfferUtils.getItineraryArrivalCityName(props.itinerary)}</span><span>{OfferUtils.getItineraryArrivalAirportCode(props.itinerary)}</span></div>
                </Col>
            </Row>
        </Container>
    )
}

function ItineraryHeader(props){
    const outboundItinerary=props.outboundItinerary;
    const returnItinerary=props.returnItinerary;
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

function AirlineAndFlight(props){
    let operatingCarrier=OfferUtils.getItineraryOperatingCarrier(props.itinerary);
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


function PricePlan(props) {
    let pricePlan = props.pricePlan
    return(
        <Container className='offer-detail--priceplan'>
            <Row>
                {/*{pricePlan.name}*/}
            </Row>
        </Container>
    )
}
