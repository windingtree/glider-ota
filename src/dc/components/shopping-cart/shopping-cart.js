import React from 'react'
import style from './shopping-cart.module.scss'
import {HorizontalDottedLine} from "../common-blocks/horizontal-line"
import {Col, Image, Row} from 'react-bootstrap'
import _ from 'lodash'
import classNames from 'classnames/bind';
import {
    bookAction,
    requestCartRestoreFromServer,
    errorSelector,
    flightOfferSelector,
    hotelOfferSelector, isShoppingCartUpdateInProgress
} from "../../../redux/sagas/shopping-cart-store";
import {connect} from "react-redux";
import {ADTYPES, ArrivalDeparture} from "../flight-blocks/arrival-departure";
import OfferUtils, {safeDateFormat} from "../../../utils/offer-utils";
import {LodgingInfo} from "../accommodation-blocks/lodging-info";
import {Link} from "react-router-dom";
import {config} from "../../../config/default"
import {useHistory} from "react-router-dom";
import {
    requestSearchResultsRestoreFromCache
} from "../../../redux/sagas/shopping-flow-store";
import Spinner from "../common/spinner";


let cx = classNames.bind(style);

const SubTotal = ({title,price, priceAmount, currency}) =>{
    let cls=cx({
        subtotalItem:true,
        'float-right':true,
    })

    if(price) {
        priceAmount = price.public;
        currency = price.currency;
    }

    return (
        <div className={'pt-2 pb-2'}>
            <Row >
                <Col >
                    <div className={style.subtotalItem}>{title}</div>
                </Col>
                <Col >
                    <div className={cls}>{priceAmount}{currency}</div>
                </Col>
            </Row>
        </div>)
}

const Total = ({title,price, priceAmount, currency}) =>{
    let cls=cx({
        totalItem:true,
        'float-right':true,
    })
    if(price) {
        priceAmount = price.public;
        currency = price.currency;
    }
    return (
        <div  className={'pt-2 pb-2'}>
            <Row >
                <Col >
                    <div className={style.totalItem}>{title}</div>
                </Col>
                <Col >
                    <div className={cls}>{priceAmount}{currency}</div>
                </Col>
            </Row>
        </div>)
}


const BookHotelBtn = ({ flightOffer }) => {
    let history = useHistory();
    console.log('BookHotelBtn - flightOffer = ',flightOffer)
    const {itineraries} = flightOffer;
    let outboundItinerary = itineraries.length>0?itineraries[0]:null;
    let returnItinerary = itineraries.length>1?itineraries[1]:null;

    const handleBookHotel = (outboundItinerary, returnItinerary) => {
        history.push('/dc', {
            searchType: 'HOTELS',
            city: OfferUtils.getItineraryArrivalCityName(outboundItinerary),
            dateIn: OfferUtils.getItineraryArrivalDate(outboundItinerary),
            dateOut: returnItinerary ? OfferUtils.getItineraryDepartureDate(returnItinerary) : undefined
        });
    };

    return (
        <div className={style.bookHotelLink} onClick={() => handleBookHotel(outboundItinerary, returnItinerary)}>
            Book a hotel in {OfferUtils.getItineraryArrivalCityName(outboundItinerary)}
        </div>
    );
};


const FlightOfferCartItem = ({flightOffer, displayOutbound=true, displayInbound=true}) =>{
    if(!flightOffer)
        return (<></>)

    const {itineraries} = flightOffer;

    if(!Array.isArray(itineraries) || itineraries.length===0)
        return (<></>)

    let outboundItinerary = itineraries.length>0?itineraries[0]:null;
    let returnItinerary = itineraries.length>1?itineraries[1]:null;

    const renderItineraryStart = (itinerary) =>{
        let cityName = OfferUtils.getItineraryDepartureCityName(itinerary)
        let cityCode = OfferUtils.getItineraryDepartureAirportCode(itinerary);
        let departureTime = OfferUtils.getItineraryDepartureDate(itinerary)
        return (<ArrivalDeparture adType={ADTYPES.DEPARTURE} date={departureTime} cityCode={cityCode} cityName={cityName}/>)
    }

    return (
        <>
            {outboundItinerary && displayOutbound && renderItineraryStart(outboundItinerary)}
            {returnItinerary && displayInbound &&  renderItineraryStart(returnItinerary)}
        </>
    )
}

const HotelOfferCartItem = ({hotelOffer}) => {
    if(!hotelOffer)
        return (<></>);

    const {offerId, hotel, room, price, checkInDate, checkOutDate} = hotelOffer;

    const cityName = _.get(hotel,'contactInformation.address.locality');

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

export const ShoppingCart = ({flightOffer, hotelOffer, restoreCartFromServer, restoreSearchResultsFromCache, isShoppingCartUpdateInProgress, error}) =>{
    let history = useHistory();
    //redirect to booking flow (pax details page)
    const onProceedToBook = (e) => {
        e.preventDefault();
        let url='/dc/pax';
        history.push(url);
    }

    const onRestoreCartFromServer = (e) => {
        e.preventDefault();
        restoreCartFromServer();
    }
    const onRestoreSearchResultsFromCache = (e) => {
        e.preventDefault();
        restoreSearchResultsFromCache();
    }

    let bookButtonClassnames=cx({
        btn:true,
        'btn-primary':true,
        'btn-block':true
    })

    const hotelPrice = hotelOffer?hotelOffer.price:null;
    const flightPrice = flightOffer?flightOffer.price:null;
    const totalPrice = calculateTotalPrice(hotelPrice,flightPrice)

    let cartIsEmpty = (!flightOffer && !hotelOffer)

    const links = () =>{
        return (<div className={style.debugLinks}>
            <Link to={'/dc/pax'}>Pax details</Link><br/>
            <Link to={'/dc/ancillaries'}>Ancillaries</Link><br/>
            <Link to={'/dc/seatmap'}>Seatmap</Link><br/>
            <Link to={'/dc/summary'}>Pricing</Link><br/>
            <a href={"#"}  onClick={onRestoreCartFromServer}>Restore cart from server</a><br/>
            <a href={"#"}  onClick={onRestoreSearchResultsFromCache}>Restore search from server</a><br/>

        </div>)
    }

    const displayError = (error) =>{
        return (<div >Error</div>)
    }

    if(cartIsEmpty)
        return (<>{config.DEV_MODE && links()}<Spinner enabled={isShoppingCartUpdateInProgress===true}/></>)


    return (
        <div className={style.cartContainer}>
            <div className={style.cartHeader}>Your trip so far</div>
            <Spinner enabled={isShoppingCartUpdateInProgress===true}/>
            <HorizontalDottedLine/>
            {flightOffer &&
                <div className={style.flightOfferWrapper}>
                    <FlightOfferCartItem
                        flightOffer={flightOffer}
                        displayOutbound={true}
                        displayInbound={false}
                    />
                </div>
            }
            {hotelOffer &&
                <div className={style.flightOfferWrapper}>
                    <HotelOfferCartItem hotelOffer={hotelOffer}/>
                </div>
            }
            {!hotelOffer && flightOffer &&
                <BookHotelBtn
                    flightOffer={flightOffer}
                />
            }
            {flightOffer &&
                <div className={style.flightOfferWrapper}>
                    <FlightOfferCartItem
                        flightOffer={flightOffer}
                        displayOutbound={false}
                        displayInbound={true}/>
                </div>
            }
            <HorizontalDottedLine/>
            <div className={style.flightOfferBottomWrapper}>
                {flightOffer && flightPrice && <SubTotal price={flightPrice} title={"Flights:"}/> }
                {hotelOffer && hotelPrice && <SubTotal price={hotelPrice} title={"Hotels:"}/> }
                {totalPrice && totalPrice.public>0 && <Total price={totalPrice} currency={"$"} title={"Total:"}/>}
                <div className={'pt-2'}/>
                {error & displayError()}
                <a href={"#"} className={bookButtonClassnames} onClick={onProceedToBook}>Book</a>
            </div>
            {config.DEV_MODE && links()}
        </div>

    )
}

//TODO - handle different currencies
const calculateTotalPrice = (hotelPrice, flightPrice) => {
    let currency;

    let hotelAmount = 0;
    if(hotelPrice){
        hotelAmount = hotelPrice.public
        currency = hotelPrice.currency;
    }
    let flightAmount = 0;
    if(flightPrice){
        flightPrice = flightPrice.public;
        currency = flightPrice.currency;
    }

    let total = Number(hotelAmount) + Number(flightAmount);
    return {
        public:total,
        currency:currency
    };
}

const mapStateToProps = state => ({
    flightOffer: flightOfferSelector(state),
    hotelOffer: hotelOfferSelector(state),
    error: errorSelector(state),
    isShoppingCartUpdateInProgress:isShoppingCartUpdateInProgress(state),

});



const mapDispatchToProps = (dispatch) => {
    return {
        restoreCartFromServer: () => {
            dispatch(requestCartRestoreFromServer())
        },
        restoreSearchResultsFromCache: ()=>{
            dispatch(requestSearchResultsRestoreFromCache())
        },
        onStore: () => {
            dispatch(bookAction())
        },

    }
}
export default connect(mapStateToProps, mapDispatchToProps)(ShoppingCart);
