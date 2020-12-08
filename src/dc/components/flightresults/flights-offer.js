import React, {useState} from 'react'
import style from './flights-offer.module.scss'
import {Container, Row, Col, Button} from 'react-bootstrap'
import {format, parseISO} from "date-fns";
import OfferUtils from '../../../utils/offer-utils'
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
    let conxType="DIRECT";
    if(segments.length===2)
        conxType="1 STOP"
    else if(segments.length>2)
        conxType=(segments.length-1)+" STOPS";


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
                            <div className={style.itinStopCount}>{conxType}</div>
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
                return (<AirlineLogo key={id} airlineName={operator.airline_name} iatacode={operator.iataCode} tooltip={operator.airline_name}/>)
            })
        }
        </span>
    )
}

export function AirlineLogo({iatacode,tooltip, airlineName}){
    const [img,setImg] = useState(iatacode);
    const MISSING_LOGO='missing';
    let imgPath = "/airlines/" + img + ".png";
    return (
        (<img key={iatacode} src={imgPath} title={tooltip} className={style.itinCarrierLogo} onError={() => setImg(MISSING_LOGO)}/>)
    )
}

function ItineraryAncillaries({pricePlan}) {
    let fba=0;
    if(pricePlan && pricePlan.checkedBaggages && pricePlan.checkedBaggages.quantity)
        fba=parseInt(pricePlan.checkedBaggages.quantity)
    return (
        <span>
            {fba === 0 && <img src="/ancillaries/luggage_notallowed.png"/>}
            {fba > 0 && <img src="/ancillaries/luggage_allowed.png"/>}
        </span>
    )
}


