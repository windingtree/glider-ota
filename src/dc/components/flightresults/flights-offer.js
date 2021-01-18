import React, {useState} from 'react'
import style from './flights-offer.module.scss'
import {Container, Row, Col, Spinner} from 'react-bootstrap'
import {format, parseISO} from "date-fns";
import OfferUtils from '../../../utils/offer-utils'
import _ from 'lodash'
import {
    addFlightToCartAction,
    deleteOfferFromCartAction,
    isShoppingCartUpdateInProgress,
    flightOfferSelector
} from "../../../redux/sagas/shopping-cart-store";
import {connect} from "react-redux";
import {IconPlaneDeparture } from '../icons/icons';
import {JourneySummary} from "../flight-blocks/journey-summary"
import {AddToTrip} from "../common-blocks/add-to-trip-button"
import {HorizontalDottedLine} from "../common-blocks/horizontal-line"

export function Offer(props) {
    const {
        offer,
        itineraries = [],
        price,
        offerId,
        onOfferDisplay,
        onAddOfferToCart = () => {},
        onDeleteOfferFromCart = () => {},
        isCartInProgress,
        cartFlightOffer
    } = props;
    const [updateStarted, setUpdateStarted] = useState(false);
    const isAlreadyAdded= cartFlightOffer &&
        cartFlightOffer.offerId === offer.offerId;

    const addOfferToCart = () =>{
        setUpdateStarted(true);
        onAddOfferToCart(offer.offerId, offer, price, itineraries)
    }

    const deleteOfferFromCart = () =>{
        setUpdateStarted(true);
        onDeleteOfferFromCart(offer.offerId)
    }

    return (
        <div className={style.flightsearchoffercontainer}>
            <JourneySummary itineraries={itineraries}/>
            <HorizontalDottedLine/>
            <AddToTrip
                isProgress={isCartInProgress && updateStarted}
                isAlreadyAdded={isAlreadyAdded}
                priceCurrency={price.currency}
                priceAmount={price.public}
                onAdd={isAlreadyAdded ? deleteOfferFromCart : addOfferToCart}
            />
        </div>
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
                    <div className={style.itinDptrdate}><IconPlaneDeparture/><span className={'ml-3'}>{format(startOfTrip, 'dd MMM, EE')}</span></div>
                    <div className={style.itinTimes}>{format(startOfTrip, 'HH:mm')} - {format(endOfTrip, 'HH:mm')}</div>
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

const mapStateToProps = state => ({
    isCartInProgress: isShoppingCartUpdateInProgress(state),
    cartFlightOffer: flightOfferSelector(state)
});

const mapDispatchToProps = (dispatch) => {
    return {
        onAddOfferToCart: (offerId, offer, price, itineraries) => dispatch(addFlightToCartAction(offerId, offer, price, itineraries)),
        onDeleteOfferFromCart: offerId => dispatch(deleteOfferFromCartAction(offerId))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Offer);
