import {Button, Col, Container, Image, Row} from "react-bootstrap";
import {differenceInHours, differenceInMinutes, format, parseISO} from "date-fns";
import logo from "../../assets/airline_logo.png";
import {iataToCityName} from "../../utils/offer-utils"
import React from "react";
import style from "./trip-details.module.scss";
import {config} from "../../config/default";
import {AirlineLogo, Itinerary} from "../flightresults/flights-offer";



export  function RouteOverview({itineraries=[]}){
    return (
        <div  >
            <Row>
                <Col className={style.tripheader}>Route</Col>
            </Row>
            <Row className={style.tripcontainer}>
                {itineraries.length > 0 && (<Itinerary itinerary={itineraries[0]}/>)}
                {itineraries.length > 1 && (<Itinerary itinerary={itineraries[1]}/>)}
                {itineraries.length > 3 && (<Itinerary itinerary={itineraries[2]}/>)}
            </Row>
        </div>
    )
}



export default function TripDetails({itineraries=[]}){
    let itinIdx=0;
    //iterate over trip itineraries and render each itinerary
    return (<>
        {itineraries.map(itinerary=>
        {
            let itineraryHeader='';
            //only if there is 1 or 2 trips, display trip headers as 'departure' and 'return', otherwise don't display anything
            if(itineraries.length<=2){
                if(itinIdx==0) itineraryHeader='Departure flight';
                if(itinIdx==1) itineraryHeader='Return flight';
            }
            itinIdx++;
            return (<ItineraryDetails key={itinerary.itinId} itinerary={itinerary} header={itineraryHeader}/>)
        })}
        </>)
}




export function ItineraryDetails({itinerary, header='Departure flight'}) {
    let firstSegment=getFirstSegmentOfItinerary(itinerary);
    let tripOrigin = firstSegment.origin;
    let lastSegment = getLastSegmentOfItinerary(itinerary);
    let tripDestination = lastSegment.destination;
    let segments=itinerary.segments;
    let departure=firstSegment.departureTime;
    let arrival=lastSegment.arrivalTime;
    const sameDay = (a, b) => {
        a = parseISO(a);
        b = parseISO(b);
        return a.getFullYear() === b.getFullYear() &&
            a.getMonth() === b.getMonth() &&
            a.getDate() === b.getDate();
    }
    let items=[];
    let prevSegment;
    for(let s=0;s<segments.length;s++)
    {
        let segment=segments[s];
        if(prevSegment)
            items.push(<LayoverInfo prevSegment={prevSegment} nextSegment={segment}/>);
        items.push(<SegmentDetails segment={segment}/>);
        prevSegment=segment;
    }

    return (
        <>
            <Container fluid={true} className='no-padding-left'>
                <Row>
                    <Col className={style.itinHeader}>{header}</Col>
                </Row>
                <Row>
                    <Col>
                        <span className={style.itinRoute}>{tripOrigin.city_name?tripOrigin.city_name:tripOrigin.iataCode} —> {tripDestination.city_name?tripDestination.city_name:tripDestination.iataCode} </span>
                        <span className={style.itinDates}> {dateToStr(departure,'MMMM d (EE)')} {!sameDay(departure,arrival) && <>| {dateToStr(arrival,'MMMM d (EE)')}</>}</span>
                    </Col>
                </Row>
            </Container>
            {items}
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
                    <Row className={style.segmentRow}><Col className={style.segmentDuration}>{toDurationString(segment.departureTimeUtc,segment.arrivalTimeUtc)}</Col></Row>
                    <Row className={style.segmentRow}>
                        <Col><FlightInfo operator={segment.operator}/></Col>
                    </Row>
                    <Row className={style.segmentRow}><Col className={style.segmentNormalText}>{/*No luggage*/}</Col></Row>
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
                <div className={style.segmentCarrierLogoContainer}><AirlineLogo iatacode={operator.iataCode} airlineName={operator.airline_name} tooltip={operator.airline_name}/></div>
                <div className={style.segmentFlightInfoContainer}><div>{operator.airline_name}</div> <div>{operator.flightNumber} {operator.flight_info}</div></div>
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


export function LayoverInfo({prevSegment, nextSegment}){
    //
    let changeOfAirport=false;
    if(prevSegment.destination.iataCode!==nextSegment.origin.iataCode)
        changeOfAirport=true;


    const renderChangeOfAirports=()=>{
        return (
            <Row className={style.layoverTitle}>
                Transfer in {prevSegment.destination.city_name}, from {prevSegment.destination.airport_name}({prevSegment.destination.iataCode}) to {nextSegment.origin.airport_name}({nextSegment.origin.iataCode}): {toDurationString(prevSegment.arrivalTime,nextSegment.departureTime)}
            </Row>
        )
    }

    const renderTransfer=()=>{
        return (
            <Row className={style.layoverTitle}>
                Transfer in {prevSegment.destination.city_name}, {prevSegment.destination.airport_name}({prevSegment.destination.iataCode}): {toDurationString(prevSegment.arrivalTime,nextSegment.departureTime)}
            </Row>
        )
    }


    return (
        <>
            <Container fluid={true} className='pt-4'>
                <Row className={style.layoverBorder}></Row>

                {changeOfAirport?renderChangeOfAirports():renderTransfer()}

                <Row className={style.layoverText}>Please make sure you have all travel documents for this transfer.</Row>
                <Row className={style.layoverBorder}></Row>
            </Container>
        </>
    )

}
