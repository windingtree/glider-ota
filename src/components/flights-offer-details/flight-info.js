import OfferUtils from "../../utils/offer-utils";
import {Col, Container, Image, Row} from "react-bootstrap";
import {format} from "date-fns";
import logo from "../../assets/airline_logo.png";
import React from "react";
import "./flight-info.scss";
import airportToCityMap from "../../data/airport-city-map";


export default function YourFlightInfo({combination}){
    if(combination===undefined){
        return (<>nothing to display</>)
    }

    const outboundItinerary = OfferUtils.getOutboundItinerary(combination);
    const returnItinerary = OfferUtils.doesReturnItineraryExist(combination)?OfferUtils.getReturnItinerary(combination) : undefined;


    return(
        <>
            <div className='offer-detail--header'>Your flight</div>
             <ItineraryHeader combination={combination}/>
             <ItineraryDetailsNew itinerary={outboundItinerary}/>
                    {returnItinerary!==undefined &&
                    <ItineraryDetailsNew itinerary={returnItinerary}/>
                    }
        </>
    )
}


/**
 * Upper part of a detailed flight offer. Contains information about the routing (e.g. Paris-London) and departure/return dates
 * @param combination
 * @returns {*}
 * @constructor
 */
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
        <div className='d-flex flex-row flex-wrap mb-2'>
            <span className='font-medium-foreground'>{airportToCity(depCityName)}-{airportToCity(arrivCityName)} </span>
            <span className='font-regular-background'> {departureDateStr} {returnDateStr}</span>
        </div>
    )

}



function ItineraryDetailsNew({itinerary}){
    let dptrDate=OfferUtils.getItineraryDepartureDate(itinerary);
    let arrivalDate=OfferUtils.getItineraryArrivalDate(itinerary);
    let operatingCarrier=OfferUtils.getItineraryOperatingCarrier(itinerary);

    return (
        <div className="offer-detail-container d-flex flex-row flex-wrap border border-danger my-3 p-3">
            <div>
                <div className='border border-dark d-flex flex-row flex-wrap mb-5'>
                    <div className='box-200 border font-medium-foreground'>{format(dptrDate,'MMMM d')}</div>
                    <div className='box-200 border font-regular-foreground'>{OfferUtils.getItineraryDepartureCityName(itinerary)} - {OfferUtils.getItineraryArrivalCityName(itinerary)}</div>
                </div>
                <div className='border border-dark d-flex flex-row flex-wrap-reverse box-500'>
                    <div className='box-200'>
                        <div className='d-flex flex-row'>
                            <div><img src={"/airlines/"+operatingCarrier.iataCode+".png"} className='offer-detail--trip-logo'/></div>
                            <div className='d-flex flex-column'>
                                <div className='offer-detail--trip-carrier-name'>{operatingCarrier.airlineName}</div>
                                <div className='font-small-background'>{operatingCarrier.flight}</div>
                            </div>
                        </div>
                    </div>
                    <div className='border border-dark d-flex flex-row'>
                        <div className='box-200 border d-flex flex-row'>
                            <span className='font-h2-foreground'>{format(dptrDate, 'HH:mm')}</span>
                            <span className='font-regular-foreground'>{format(dptrDate, 'MMM dd')}</span>
                            <span className='font-small-foreground'>{OfferUtils.getItineraryDepartureAirportName(itinerary)}</span>,
                            <span className='font-small-background'>{OfferUtils.getItineraryDepartureAirportCode(itinerary)}</span>
                        </div>
                        <div className='box-200 border'>
                            <span className='font-h2-foreground'>{format(arrivalDate, 'HH:mm')}</span>
                            <span className='font-regular-foreground'>{format(arrivalDate, 'MMM dd')}</span>
                            <span className='font-small-foreground'>{OfferUtils.getItineraryArrivalAirportName(itinerary)}</span>
                            <span className='font-small-background'>{OfferUtils.getItineraryArrivalAirportCode(itinerary)}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className='border border-dark d-flex flex-row flex-wrap flight-detail--col3'>
                <div className='box-200 border font-regular-foreground'>{OfferUtils.calculateDuration(itinerary)}</div>
                <div className='box-200 border font-small-foreground'>No luggage</div>
            </div>
        </div>
    )
}

function ItineraryDetails({itinerary}){
    return (
        <div className="offer-detail-container">
            <div>
                <DepartureAndArrivalInfo itinerary={itinerary}/>
            </div>
            <div className='border box-200'>
                <AirlineAndFlightNumber itinerary={itinerary}/>
            </div>
            <div md={2} ><h5>{OfferUtils.calculateDuration(itinerary)}</h5>{/*<PricePlan/>*/}</div>
        </div>
    )
}
function DepartureAndArrivalInfo({itinerary}){
    let dptrDate=OfferUtils.getItineraryDepartureDate(itinerary);
    let arrivalDate=OfferUtils.getItineraryArrivalDate(itinerary);
    return (
        <div>
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
        </div>
    )
}

/**
 * Operating carrier logo + name (e.g. "Air France"), flight number(e.g. "AF-123")  and aircraft details (e.g. "Boeing 737")
 * @param itinerary
 * @returns {*}
 * @constructor
 */
function AirlineAndFlightNumber({itinerary}){
    let operatingCarrier=OfferUtils.getItineraryOperatingCarrier(itinerary);
    return(
        <div className='d-flex flex-row'>
            <div><img src={"/airlines/MN.png"} className='offer-detail--trip-logo'/></div>
            <div className='d-flex flex-column'>
                <div className='offer-detail--trip-carrier-name'>{operatingCarrier.airlineName}</div>
                <div className='offer-detail--trip-flight-number'>{operatingCarrier.flight}</div>
            </div>
        </div>
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


function airportToCity(iata){
    return airportToCityMap[iata];
}