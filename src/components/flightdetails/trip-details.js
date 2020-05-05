import OfferUtils from "../../utils/offer-utils";
import {Col, Container, Image, Row} from "react-bootstrap";
import {differenceInHours, differenceInMinutes, format, parseISO} from "date-fns";
import logo from "../../assets/airline_logo.png";
import {iataToCityName} from "../../utils/offer-utils"
import React from "react";
import style from "./trip-details.module.scss";



export default function TripDetails({itineraries=[]}){
    return(
        <>
            {itineraries.length>0 && (<ItineraryDetails itinerary={itineraries[0]}/>)}
            {itineraries.length>1 && (<ItineraryDetails itinerary={itineraries[1]}/>)}
            {itineraries.length>2 && (<ItineraryDetails itinerary={itineraries[2]}/>)}
            {itineraries.length>3 && (<ItineraryDetails itinerary={itineraries[3]}/>)}
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
            <div className={style.itinHeader}>{header}</div>
            <div>
                <span className={style.itinRoute}>{tripOrigin.city_name?tripOrigin.city_name:tripOrigin.iataCode} —> {tripDestination.city_name?tripDestination.city_name:tripDestination.iataCode} </span>
                <span className={style.itinDates}> {dateToStr(firstSegment.departureTime,'MMMM d (EE)')} | {dateToStr(lastSegment.arrivalTime,'MMMM d (EE)')}</span>
            </div>
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
        <Container fluid={true}>
            <Row >
                <Col xs={12} md={6}>
                    <Row >
                        <Col xs={12} md={6} className={style.segmentDptrDate}>{dateToStr(segment.departureTime,'MMMM d')}</Col>
                    </Row>
                    <Row>
                        <Col xs={12} md={6} className={style.segmentDptrTime}>{dateToStr(segment.departureTime,'HH:mm')}</Col>
                        <Col xs={12} md={6} className={style.segmentAirportname}>{segment.origin.airport_name?segment.origin.airport_name:segment.origin.iataCode}</Col>
                    </Row>
                    <Row>
                        <Col xs={12} md={6} className={style.segmentDptrTime}>{dateToStr(segment.arrivalTime,'HH:mm')}</Col>
                        <Col xs={12} md={6} className={style.segmentAirportname}>{segment.destination.iataCode}</Col>
                    </Row>
                </Col>
                <Col xs={12} md={6}>
                    <Row><Col className={style.segmentNormalText}>{toDurationString(segment.departureTime,segment.arrivalTime)}</Col></Row>
                    <Row>
                        <Col className={style.segmentNormalText}><div><img src={"/airlines/"+segment.operator.iataCode+".png"} className={style.segmentCarrierLogo}/></div></Col>
                    </Row>
                    <Row><Col className={style.segmentNormalText}>No luggage</Col></Row>
                </Col>
            </Row>
        </Container>
    </>
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