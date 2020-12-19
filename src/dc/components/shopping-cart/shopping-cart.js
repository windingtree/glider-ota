import React, { useState } from 'react'
import style from './shopping-cart.module.scss'
import {HorizontalDottedLine} from "../common-blocks/horizontal-line"
import {Col, Image, Row, Spinner as RoundSpinner} from 'react-bootstrap'
import _ from 'lodash'
import classNames from 'classnames/bind';
import {
    bookAction,
    requestCartRestoreFromServer,
    errorSelector,
    flightOfferSelector,
    hotelOfferSelector, isShoppingCartUpdateInProgress, deleteFlightFromCart, totalPriceSelector
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
import Container from "react-bootstrap/Container";
import {fetchGet} from "../../../utils/api-utils";


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
        <Container fluid={true}>
            <Row noGutters={true}>
                <Col className={style.subtotalItem}>
                    {title}
                </Col>
                <Col className={cls}>
                    {priceAmount} {currency}
                </Col>
            </Row>
        </Container>)
}

const Total = ({title, price, priceAmount, currency}) =>{
    let cls=cx({
        totalItem:true,
        'float-right':true,
    })
    if(price) {
        priceAmount = price.public;
        currency = price.currency;
    }
    return (
        <Container fluid={true}>
            <Row noGutters={true}>
                <Col className={style.totalItem}>
                    {title}
                </Col>
                <Col className={cls}>
                   {priceAmount} {currency}
                </Col>
            </Row>
        </Container>)
}


const BookHotelBtn = ({ flightOffer }) => {
    let history = useHistory();
    const [loading, setLoading] = useState(false);
    console.log('BookHotelBtn - flightOffer = ',flightOffer)
    const {itineraries} = flightOffer;

    if(!Array.isArray(itineraries) || itineraries.length===0) {
        return (<></>);
    }

    let outboundItinerary = itineraries.length>0?itineraries[0]:null;
    let returnItinerary = itineraries.length>1?itineraries[1]:null;

    const getCityByIataCode = async code => {
        const {
            results: {
                city_name,
                country_code
            }
        } = await fetchGet('/api/lookup/airportByIata', {
            iata: code
        });
        const cities = await fetchGet('/api/lookup/citySearch', {
            searchquery: city_name,
            country_code
        });
        return cities.results[0];
    };

    const handleBookHotel = (outboundItinerary, returnItinerary) => {
        let storedDestCity;
        let storedPassengers;
        try {//destination-airport
            const storedDestCityRaw = sessionStorage.getItem(`inputfield-destination-airport`);
            const storedPassengersRaw = sessionStorage.getItem(`inputfield-passengers-count`);
            if (storedDestCityRaw) {
                storedDestCity=JSON.parse(storedDestCityRaw);
            }
            if (storedPassengersRaw) {
                storedPassengers=JSON.parse(storedPassengersRaw);
            }
        } catch (e) {}
        setLoading(true);
        getCityByIataCode(storedDestCity.code)
            .then(city => {
                setLoading(false);
                console.log('#######', city);
                history.push('/dc/hotels', {
                    city: {
                        primary: city.city_name,
                        secondary: city.country_name,
                        latitude: city.latitude,
                        longitude: city.longitude
                    },
                    dateIn: OfferUtils.getItineraryArrivalDate(outboundItinerary),
                    dateOut: returnItinerary ? OfferUtils.getItineraryDepartureDate(returnItinerary) : undefined,
                    passengersCounts: storedPassengers,
                    doSearch: true
                });
            })
            .catch(error => {
                setLoading(false);
                console.log(error);
            });
    };

    return (
        <div className={style.bookHotelLink} onClick={() => handleBookHotel(outboundItinerary, returnItinerary)}>
            <div>
                Book a hotel in {OfferUtils.getItineraryArrivalCityName(outboundItinerary)}
            </div>
            {loading &&
                <RoundSpinner
                    className={style.bookHotelLoading}
                    animation='border'
                    variant='primary'
                />
            }
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

export const ShoppingCart = (props) =>{
    const {totalPrice, flightOffer, hotelOffer, restoreCartFromServer, restoreSearchResultsFromCache, isShoppingCartUpdateInProgress, error, onClearCart} = props;
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


    let cartIsEmpty = (!flightOffer && !hotelOffer)

    const links = () =>{
        return (<div className={style.debugLinks}>
            <Link to={'/dc/pax'}>Pax details</Link><br/>
            <Link to={'/dc/ancillaries'}>Ancillaries</Link><br/>
            <Link to={'/dc/seatmap'}>Seatmap</Link><br/>
            <Link to={'/dc/summary'}>Pricing</Link><br/>
            <span onClick={onRestoreCartFromServer}>Restore cart from server</span><br/>
            <span onClick={onRestoreSearchResultsFromCache}>Restore search from server</span><br/>
            <span onClick={onClearCart}>Clear cart</span><br/>

        </div>)
    }

    const displayError = (error) =>{
        return (<div>Error occurred</div>)
    }

    if(cartIsEmpty)
        return (<>{config.DEV_MODE && links()}<Spinner enabled={isShoppingCartUpdateInProgress===true}/></>)


    return (
        <div className={style.cartContainer}>
            <div className={style.cartHeader}>Your trip so far</div>
            <Spinner enabled={isShoppingCartUpdateInProgress===true}/>
            <HorizontalDottedLine/>
            <div className={style.cartBody}>
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
            </div>
            <HorizontalDottedLine/>
            <div className={style.cartFooter}>
                {flightOffer && flightPrice && <SubTotal price={flightPrice} title={"Flights:"}/> }
                {hotelOffer && hotelPrice && <SubTotal price={hotelPrice} title={"Hotels:"}/> }
                {totalPrice && totalPrice.public>0 && <Total price={totalPrice} title={"Total:"}/>}
            </div>
            <div className={'pt-2'}/>
            <div className={style.flightOfferBottomWrapper}>
                <button className={bookButtonClassnames} onClick={onProceedToBook}>Book</button>
            </div>
            {config.DEV_MODE && links()}
        </div>

    )
}

const mapStateToProps = state => ({
    flightOffer: flightOfferSelector(state),
    hotelOffer: hotelOfferSelector(state),
    totalPrice: totalPriceSelector(state),  //total price of items in cart
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
        onClearCart: () => {
            dispatch(deleteFlightFromCart())
        },

    }
}
export default connect(mapStateToProps, mapDispatchToProps)(ShoppingCart);
