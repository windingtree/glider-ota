import React from 'react'
import style from './shopping-cart.module.scss'
import {HorizontalDottedLine} from "../common-blocks/horizontal-line"
import {Col, Container, Image, Row} from 'react-bootstrap'
import _ from 'lodash'
import classNames from 'classnames/bind';
import {bookAction, errorSelector, flightOfferSelector, hotelOfferSelector} from "../../../redux/sagas/cart";
import {connect} from "react-redux";
import {ItinerarySummary} from "../flight-blocks/itinerary-summary";
import {ADTYPES, ArrivalDeparture} from "../flight-blocks/arrival-departure";
import {FlightDuration} from "../flight-blocks/flight-duration";
import OfferUtils, {safeDateFormat} from "../../../utils/offer-utils";
import {FaBed} from "react-icons/fa";
import {LodgingInfo} from "../accommodation-blocks/lodging-info";


let cx = classNames.bind(style);

const SubTotal = ({title,price, currency}) =>{
    let cls=cx({
        subtotalItem:true,
        'float-right':true,
    })
    return (
        <div className={'pt-2 pb-2'}>
            <Row >
                <Col >
                    <div className={style.subtotalItem}>{title}</div>
                </Col>
                <Col >
                    <div className={cls}>{price}{currency}</div>
                </Col>
            </Row>
        </div>)
}

const Total = ({title,price, currency}) =>{
    let cls=cx({
        totalItem:true,
        'float-right':true,
    })
    return (
        <div  className={'pt-2 pb-2'}>
            <Row >
                <Col >
                    <div className={style.totalItem}>{title}</div>
                </Col>
                <Col >
                    <div className={cls}>{price}{currency}</div>
                </Col>
            </Row>
        </div>)
}


const FlightOfferCartItem = ({flightOffer}) =>{
    if(!flightOffer)
        return (<></>)

    const {itineraries} = flightOffer;

    if(!Array.isArray(itineraries) || itineraries.length==0)
        return (<></>)

    let outboundItinerary = itineraries.length>0?itineraries[0]:null;
    let returnItinerary = itineraries.length>1?itineraries[1]:null;

    const renderItineraryStart = (itinerary) =>{
        let cityName = OfferUtils.getItineraryDepartureAirportName(itinerary)
        let cityCode = OfferUtils.getItineraryDepartureAirportCode(itinerary);
        let departureTime = OfferUtils.getItineraryDepartureDate(itinerary)
        return (<ArrivalDeparture adType={ADTYPES.DEPARTURE} date={departureTime} cityCode={cityCode} cityName={cityName}/>)
    }

    return (
        <>
            {outboundItinerary && renderItineraryStart(outboundItinerary)}
            {returnItinerary && renderItineraryStart(returnItinerary)}
        </>
    )
}

const getHotelCityNameFromAddress = (hotel) => {
    const city = _.get(hotel,'contactInformation.address.locality');
    return city;
}
const HotelOfferCartItem = ({hotelOffer}) => {
    if(!hotelOffer)
        return (<></>);

    const {offerId, hotel, room, price, checkInDate, checkOutDate} = hotelOffer;

    const cityName = getHotelCityNameFromAddress(hotel);

    const renderRoomInfo = (room) => {
        if(!room || !room.name)
            return (<></>)
        return (
            <div className={style.hotelItemRoomName}>{room.name}</div>
        )
    }
    const renderHotelInfo = (hotel) => {
        if(!hotel || !hotel.name)
            return (<></>)

        let hotelImages = hotel.media;
        let hotelImageUrl;
        if(Array.isArray(hotelImages) && hotelImages.length>0){
            hotelImageUrl = hotelImages[0].url;
        }

        return (<>
            {hotelImageUrl && (<Image className={style.hotelItemHotelImage} src={hotelImageUrl}/>)}
            <div className={style.hotelItemHotelName}>{hotel.name}</div></>)
    }

    return (<>
        <LodgingInfo checkOutDate={checkOutDate} checkInDate={checkInDate} cityName={cityName}/>
        {hotel && renderHotelInfo(hotel)}
        {room && renderRoomInfo(room)}
    </>)
}

export const ShoppingCart = ({flightOffer, hotelOffer, onBook}) =>{

    const onBookHandler = (e) => {
        e.preventDefault();
        if(onBook) {
            onBook()
        }
        else{
            console.warn('onBook is not defined!')
        }
    }
    let bookButtonClassnames=cx({
        btn:true,
        'btn-primary':true,
        'btn-block':true
    })

    return (
        <div className={style.cartContainer}>
            <div className={style.cartHeader}>Your trip so far</div>
            <HorizontalDottedLine/>
            {flightOffer && <FlightOfferCartItem flightOffer={flightOffer}/>}
            {hotelOffer && <HotelOfferCartItem hotelOffer={hotelOffer}/> }
            <HorizontalDottedLine/>
            <SubTotal price={123} currency={"$"} title={"Flights:"}/>
            <SubTotal price={123} currency={"$"} title={"Hotels:"}/>
            <Total price={123} currency={"$"} title={"Total:"}/>
            <div className={'pt-2'}/>
            <a href={"#"} className={bookButtonClassnames} onClick={onBookHandler}>Book</a>
        </div>

    )
}




const mapStateToProps = state => ({
    flightOffer: flightOfferSelector(state),
    hotelOffer: hotelOfferSelector(state),
    error: errorSelector(state)
});


const mapDispatchToProps = (dispatch) => {
    return {
        onBook: (offer) => {
            dispatch(bookAction())
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(ShoppingCart);
