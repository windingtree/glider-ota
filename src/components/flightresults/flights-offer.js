import React, {useState} from 'react'
import style from './flights-offer.module.scss'
import {Container, Row, Col, Image, Button} from 'react-bootstrap'
import {format, parseISO} from "date-fns";
import OfferUtils from '../../utils/offer-utils'
import {config} from "../../config/default";
import _ from 'lodash'


export function Offer({itineraries = [], price, offerId, onOfferDisplay}) {
    return (
        <Container fluid={true} className={style.flightsearchoffercontainer}>
            <Row>
                {itineraries.length > 0 && (<Itinerary itinerary={itineraries[0]}/>)}
                {itineraries.length > 1 && (<Itinerary itinerary={itineraries[1]}/>)}
                {itineraries.length > 3 && (<Itinerary itinerary={itineraries[2]}/>)}
            </Row>
            <Row className='flex-row-reverse'>
                <Col xs={12} md={4}>
                    <Button variant="outline-primary pricebtn" size="lg" onClick={() => {
                        onOfferDisplay(offerId)
                    }}>{price.public} {price.currency}</Button>
                    {config.DEBUG_MODE && <>OfferID:{offerId}</>}
                </Col>
            </Row>
        </Container>
    )
}


export function Itinerary({itinerary}) {
    const firstSegment = OfferUtils.getFirstSegmentOfItinerary(itinerary);
    const lastSegment = OfferUtils.getLastSegmentOfItinerary(itinerary);
    const startOfTrip = parseISO(firstSegment.departureTime);
    const endOfTrip = parseISO(lastSegment.arrivalTime);
    const segments = OfferUtils.getItinerarySegments(itinerary);
    const pricePlan = OfferUtils.getItineraryPricePlan(itinerary);

    const stops = [];
    for (let i = 0; i < segments.length - 1; i++) {
        const segment = segments[i];
        if (i > 0)
            stops.push(',');
        stops.push(segment.destination.iataCode)
    }
    const operators = OfferUtils.getItineraryOperatingCarriers(itinerary);
    return (
        <Container fluid={true}>
            <Row>
                <Col xs={12} md={4} className={style.itinRow}>
                    <div className={style.itinTimes}>{format(startOfTrip, 'HH:mm')} - {format(endOfTrip, 'HH:mm')}</div>
                    <div className={style.itinDptrdate}>{format(startOfTrip, 'dd MMM, EE')}</div>
                </Col>
                <Col xs={12} md={4} className={style.itinRow}>
                    <Row noGutters={true}>
                        <Col>
                            <div className={style.itinDuration}>{OfferUtils.calculateDuration(itinerary)}</div>
                            <div
                                className={style.itinAirports}>{firstSegment.origin.iataCode}-{lastSegment.destination.iataCode}</div>
                        </Col>
                        <Col>
                            <div className={style.itinStopCount}>{stops.length} STOP</div>
                            <div className={style.itinStopDetails}>{stops}</div>
                        </Col>
                    </Row>
                </Col>
                <Col xs={12} md={4} className={style.itinRow}>
                    <Row noGutters={true}>
                        <Col>
                            <ItineraryOperatingAirlines operators={operators}/>
                        </Col>
                        <Col>
                            <ItineraryAncillaries pricePlan={pricePlan}/>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Container>
    )
}

function ItineraryOperatingAirlines({operators}) {
    return (
        <span className={style.offerhighlightlogosandancillaries}>
        {
            _.map(operators, (operator, id) => {
                let imgPath = "/airlines/" + id + ".png";
                return (<img key={id} src={imgPath} alt={id} className={style.itinCarrierLogo}/>)
            })
        }
        </span>
    )
}

function ItineraryAncillaries({pricePlan}) {
    return (
        <span>
                    {pricePlan.checkedBaggages.quantity === 0 && <img src="/ancillaries/luggage_notallowed.png"/>}
            {pricePlan.checkedBaggages.quantity > 0 && <img src="/ancillaries/luggage_allowed.png"/>}
        </span>
    )
}


const Price = ({combination, offerWrapper, onOfferDisplay}) => {
    let offer = offerWrapper.offer
    return (
        <>
            <Button className={style.offerhighlightprice} variant={"outline-primary"} size="lg" onClick={() => {
                onOfferDisplay(combination.combinationId, offerWrapper.offerId)
            }}>{offer.price.public} {offer.price.currency}</Button>
        </>
    )
}
