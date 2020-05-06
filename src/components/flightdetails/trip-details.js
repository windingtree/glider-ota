import OfferUtils from "../../utils/offer-utils";
import {Col, Container, Image, Row} from "react-bootstrap";
import {differenceInHours, differenceInMinutes, format, parseISO} from "date-fns";
import logo from "../../assets/airline_logo.png";
import {iataToCityName} from "../../utils/offer-utils"
import React from "react";
import style from "./trip-details.module.scss";



export default function TripDetails({itineraries=[]}){
    let firstFlightHeader = 'Departure flight';
    let secondFlightHeader = 'Return flight';
    if(itineraries.length>2) {
        firstFlightHeader=secondFlightHeader = '';
    }
    return(
        <>
            {itineraries.length>0 && (<ItineraryDetails itinerary={itineraries[0]} header={firstFlightHeader}/>)}
            {itineraries.length>1 && (<ItineraryDetails itinerary={itineraries[1]} header={secondFlightHeader}/>)}
            {itineraries.length>2 && (<ItineraryDetails itinerary={itineraries[2]} header=''/>)}
            {itineraries.length>3 && (<ItineraryDetails itinerary={itineraries[3]} header=''/>)}
        </>
    )
}




export function ItineraryDetails({itinerary, header='Departure flight'}) {
    let firstSegment=getFirstSegmentOfItinerary(itinerary);
    let tripOrigin = firstSegment.origin;
    let lastSegment = getLastSegmentOfItinerary(itinerary);
    let tripDestination = lastSegment.destination;
    let segments=itinerary.segments;
    return (
        <>
            <Container fluid={true} className='no-padding-left'>
                <Row>
                    <Col className={style.itinHeader}>{header}</Col>
                </Row>
                <Row>
                    <Col>
                        <span className={style.itinRoute}>{tripOrigin.city_name?tripOrigin.city_name:tripOrigin.iataCode} —> {tripDestination.city_name?tripDestination.city_name:tripDestination.iataCode} </span>
                        <span className={style.itinDates}> {dateToStr(firstSegment.departureTime,'MMMM d (EE)')} | {dateToStr(lastSegment.arrivalTime,'MMMM d (EE)')}</span>
                    </Col>
                </Row>
            </Container>

            {segments.length>0 && (<SegmentDetails segment={segments[0]}/>)}
            {segments.length>1 && (<SegmentDetails segment={segments[1]}/>)}
            {segments.length>2 && (<SegmentDetails segment={segments[2]}/>)}
            {segments.length>3 && (<SegmentDetails segment={segments[3]}/>)}
        </>
    )
}

export function SegmentDetails({segment}){
    return (
    <>
        <Container fluid={true} className={style.segmentContainer}>
            <Row >
                <Col xs={12} md={5}>
                    <Row className={style.segmentRow}>
                        <Col xs={12} md={6} className={style.segmentDptrDate}>{dateToStr(segment.departureTime,'MMMM d')}</Col>
                    </Row>
                    <Row className={style.segmentRow}>
                        <Col xs={12} md={6} className={style.segmentDptrTime}>{dateToStr(segment.departureTime,'HH:mm')}</Col>
                        <Col xs={12} md={6} className={style.segmentAirportname}>{segment.origin.iataCode} {segment.origin.airport_name}</Col>
                    </Row>
                    <Row className={style.segmentRow}>
                        <Col xs={12} md={6} className={style.segmentDptrTime}>{dateToStr(segment.arrivalTime,'HH:mm')}</Col>
                        <Col xs={12} md={6} className={style.segmentAirportname}>{segment.destination.iataCode} {segment.destination.airport_name}</Col>
                    </Row>
                </Col>
                <Col xs={12} md={7}>
                    <Row className={style.segmentRow}><Col className={style.segmentDuration}>{toDurationString(segment.departureTime,segment.arrivalTime)}</Col></Row>
                    <Row className={style.segmentRow}>
                        <Col><FlightInfo operator={segment.operator}/></Col>
                    </Row>
                    <Row className={style.segmentRow}><Col className={style.segmentNormalText}>No luggage</Col></Row>
                </Col>
            </Row>
        </Container>
    </>
    )
}

function FlightInfo({operator}){
return (
        <Container className={style.segmentNormalText}>
            <Row>
                <div className={style.segmentCarrierLogoContainer}><img src={"/airlines/"+operator.iataCode+".png"} className={style.segmentCarrierLogoImg}/></div>
                <div className={style.segmentFlightInfoContainer}><div>{operator.carrier_name}</div> <div>{operator.flight_number} {operator.flight_info}</div></div>
            </Row>
        </Container>
    )
}

function dateToStr(dateTime, fmt){
    try{
        return format(parseISO(dateTime),fmt);
    }catch(error){
        console.error("Cannot convert date to time, input:",dateTime," error:", error)
    }
    return '[]'
}


function toDurationString (startDate,endDate) {
    const startOfTrip = parseISO(startDate);
    const endOfTrip = parseISO(endDate);

    const hrs = differenceInHours(endOfTrip, startOfTrip);
    const mins = differenceInMinutes(endOfTrip, startOfTrip) - hrs * 60;
    let durationString = '';
    if (hrs > 0) { durationString += hrs + 'h ' }
    if (mins > 0) { durationString += mins + 'm' }
    return durationString
}


function getFirstSegmentOfItinerary (itinerary) {
    return itinerary.segments[0];
}

function  getLastSegmentOfItinerary (itinerary) {
    return itinerary.segments[itinerary.segments.length - 1];
}