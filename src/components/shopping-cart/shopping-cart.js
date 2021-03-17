import React, {useState, useEffect, createRef} from 'react'
import style from './shopping-cart.module.scss'
import {HorizontalDottedLine} from '../common-blocks/horizontal-line'
import {Col, Image, Row, Spinner as RoundSpinner} from 'react-bootstrap'
import _ from 'lodash'
import classNames from 'classnames/bind';
import {
    requestCartUpdateAction,
    errorSelector,
    flightOfferSelector,
    hotelOfferSelector, isShoppingCartUpdateInProgress, totalPriceSelector, deleteOfferFromCartAction
} from '../../redux/sagas/shopping-cart-store';
import {
    flightSearchCriteriaSelector
} from '../../redux/sagas/shopping-flow-store';
import {connect} from 'react-redux';
import {ADTYPES, ArrivalDeparture} from '../flight-blocks/arrival-departure';
import OfferUtils from '../../utils/offer-utils';
import {LodgingInfo} from '../accommodation-blocks/lodging-info';
import {Link} from 'react-router-dom';
import {config} from '../../config/default'
import {useHistory} from 'react-router-dom';
import {
    requestSearchResultsRestoreFromCache
} from '../../redux/sagas/shopping-flow-store';
import Spinner from '../common/spinner';
import Container from 'react-bootstrap/Container';
import {fetchGet, invalidateCache} from '../../utils/api-utils';
import deleteIcon from '../../assets/delete-cartitem-checkmark.svg';
import { storageKeys } from '../../config/default';

let cx = classNames.bind(style);

const SubTotal = ({title,price, priceAmount, currency}) =>{
    if(price) {
        priceAmount = price.public;
        currency = price.currency;
    }

    return (
        <Container fluid={true}>
            <Row noGutters={true}>
                <Col className={style.subtotalItemLabel}>
                    {title}
                </Col>
                <Col className={style.subtotalItemAmount}>
                    {priceAmount} {currency}
                </Col>
            </Row>
        </Container>)
}

const Total = ({title, price, priceAmount, currency}) =>{
    if(price) {
        priceAmount = price.public;
        currency = price.currency;
    }
    return (
        <Container fluid={true}>
            <Row noGutters={true}>
                <Col className={style.totalItemLabel}>
                    {title}
                </Col>
                <Col className={style.totalItemAmount}>
                   {priceAmount} {currency}
                </Col>
            </Row>
        </Container>)
}


const BookHotelBtn = ({ flightOffer, flightSearchCriteria }) => {
    let history = useHistory();
    const [loading, setLoading] = useState(false);
    const {itineraries} = flightOffer;

    if (!Array.isArray(itineraries) || itineraries.length === 0) {
        return (<></>);
    }

    let outboundItinerary = itineraries.length > 0 ? itineraries[0] : null;
    let returnItinerary = itineraries.length > 1 ? itineraries[1] : null;

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
        console.log('Itinerary', outboundItinerary, returnItinerary);
        console.log('Search criteria', flightSearchCriteria);
        const destinationIataCode = OfferUtils
            .getLastSegmentOfItinerary(outboundItinerary)
            .destination.iataCode;

        setLoading(true);
        getCityByIataCode(destinationIataCode)
            .then(city => {
                setLoading(false);
                console.log('#######', city);
                history.push({
                    pathname: '/hotels',
                    search: `?${new URLSearchParams({
                        [storageKeys.hotels.destination]: JSON.stringify({
                            primary: city.city_name,
                            secondary: city.country_name,
                            latitude: city.latitude,
                            longitude: city.longitude
                        }),
                        [storageKeys.common.departureDate]: OfferUtils.getItineraryArrivalDate(outboundItinerary),
                        [storageKeys.common.adults]: flightSearchCriteria.adults,
                        [storageKeys.common.children]: flightSearchCriteria.children,
                        [storageKeys.common.infants]: flightSearchCriteria.infants,
                        ...(
                            returnItinerary
                                ? {
                                    [storageKeys.common.returnDate]: OfferUtils.getItineraryDepartureDate(returnItinerary)
                                }
                                : {}
                        ),
                        doSearch: true
                    })}`
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

//display 'cross' icon in shopping cart to remove item from cart
const RemoveItemFromCartBtn = ({onRemoveItemClick}) => {
    const onClickHandler = (e) => {
        e.preventDefault();
        if (onRemoveItemClick) {
            onRemoveItemClick()
        }
    }

    return (<a href={'#'} onClick={onClickHandler} className={style.removeFromCartBtn}><img src={deleteIcon} alt={'Remove item'}/></a>)
}

//display details of a FLIGHT ITEM in shopping cart (e.g. departure airport, date/time)
const FlightOfferCartItem = ({flightOffer, displayOutbound = true, displayInbound = true, onRemoveOfferFromCart}) => {
    if (!flightOffer)
        return (<></>)

    const {itineraries, offerId} = flightOffer;

    if (!Array.isArray(itineraries) || itineraries.length === 0)
        return (<></>)

    let outboundItinerary = itineraries.length > 0 ? itineraries[0] : null;
    let returnItinerary = itineraries.length > 1 ? itineraries[1] : null;

    const renderItineraryStart = (itinerary) => {
        let cityName = OfferUtils.getItineraryDepartureCityName(itinerary)
        let cityCode = OfferUtils.getItineraryDepartureAirportCode(itinerary);
        let departureTime = OfferUtils.getItineraryDepartureDate(itinerary)
        return (<div className={style.cartItem}>
            <ArrivalDeparture adType={ADTYPES.DEPARTURE} date={departureTime} cityCode={cityCode} cityName={cityName}/>
            <RemoveItemFromCartBtn onRemoveItemClick={() => onRemoveOfferFromCart(offerId)}/>
        </div>)
    }

    return (
        <>
            {outboundItinerary && displayOutbound && renderItineraryStart(outboundItinerary)}
            {returnItinerary && displayInbound && renderItineraryStart(returnItinerary)}
        </>
    )
}

//display details of a HOTEL ITEM in shopping cart (e.g. hotel name, city)
const HotelOfferCartItem = ({hotelOffer, onRemoveOfferFromCart}) => {
    if (!hotelOffer)
        return (<></>);

    const {offerId, hotel, room, offer} = hotelOffer;
    let {arrival: checkInDate, departure: checkOutDate} = offer.travelDates;

    const cityName = _.get(hotel, 'contactInformation.address.locality');

    const renderRoomInfo = (room) => {
        if (!room || !room.name)
            return (<></>)
        return (
            <div className={style.hotelItemRoomName}>{room.name}</div>
        )
    }
    const renderHotelInfo = (hotel) => {
        if (!hotel || !hotel.name)
            return (<></>)

        let hotelImages = hotel.media;
        let hotelImageUrl;
        if (Array.isArray(hotelImages) && hotelImages.length > 0) {
            hotelImageUrl = hotelImages[0].url;
        }

        return (<>
            {hotelImageUrl && (<Image className={style.hotelItemHotelImage} src={hotelImageUrl}/>)}
            <div className={style.hotelItemHotelName}>{hotel.name}</div>
        </>)
    }

    return (<div className={style.cartItem}>
        <LodgingInfo checkOutDate={checkOutDate} checkInDate={checkInDate} cityName={cityName}/>
        <RemoveItemFromCartBtn onRemoveItemClick={() => onRemoveOfferFromCart(offerId)}/>
        {hotel && renderHotelInfo(hotel)}
        {room && renderRoomInfo(room)}
    </div>)
}

//render entire shopping cart (list of items in the cart, subtotals and total amount to pay)
export const ShoppingCart = (props) => {
    const {
        totalPrice,
        flightOffer,
        hotelOffer,
        restoreCartFromServer,
        restoreSearchResultsFromCache,
        isShoppingCartUpdateInProgress,
        onClearCart,
        flightSearchCriteria,
        removeOfferFromCart
    } = props;
    let history = useHistory();
    const cartRef = createRef();
    const [mobileCartOpen, setMobileCartOpen] = useState(false);

    const toggleMobileCart = () => setMobileCartOpen(!mobileCartOpen);

    //make sure shopping cart is shown at the top of the page (regardless of scroll position)
    const onScroll = () => {
        if (cartRef.current) {
            cartRef.current.style.top = `${window.scrollY}px`;
        }
    };

    useEffect(() => {
        //install scroll event handler to display shopping cart sticky at the top of the page when user scrolls
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, [cartRef]);


    useEffect(() => {
        //once item is added to the cart - update cart position to be at the top of the page
        onScroll();
    }, [totalPrice]);

    //redirect to booking flow (pax details page)
    const onProceedToBook = (e) => {
        e.preventDefault();
        let url = '/pax';
        history.push(url);
    }

    //debug only action (for DEV mode only) -- restore cart from server
    const onRestoreCartFromServer = (e) => {
        e.preventDefault();
        restoreCartFromServer();
    }
    //debug only action (for DEV mode only) -- restore last search results from server
    const onRestoreSearchResultsFromCache = (e) => {
        e.preventDefault();
        restoreSearchResultsFromCache();
    }

    let bookButtonClassnames = cx({
        btn: true,
        'btn-primary': true,
        'btn-block': true
    })

    const hotelPrice = hotelOffer ? hotelOffer.price : null;
    const flightPrice = flightOffer ? flightOffer.price : null;

    let cartIsEmpty = (!flightOffer && !hotelOffer)

    const links = () => {
        return (<div className={style.debugLinks}>
            <Link to={'/pax'}>Pax details</Link><br/>
            <Link to={'/ancillaries'}>Ancillaries</Link><br/>
            <Link to={'/seatmap'}>Seatmap</Link><br/>
            <Link to={'/summary'}>Pricing</Link><br/>
            <span onClick={onRestoreCartFromServer}>Restore cart from server</span><br/>
            <span onClick={onRestoreSearchResultsFromCache}>Restore search from server</span><br/>
            <span onClick={onClearCart}>Clear cart</span><br/>

        </div>)
    }
/*

    const displayError = (error) => {
        return (<div>Error occurred</div>)
    }
*/

    if (cartIsEmpty) {
        return (<>
            {config.DEV_MODE && links()}
            <Spinner enabled={isShoppingCartUpdateInProgress === true}/>
        </>)
    }

    const cartContent = isMobile => {

        if (isMobile && !mobileCartOpen) {
            return null;
        }

        return (
            <>
                <div
                    className={mobileCartOpen ? style.cartOverlay : ''}
                    onClick={toggleMobileCart}
                />
                <div
                    className={isMobile ? style.cartContainerMobile : style.cartContainer}
                    ref={!isMobile ? cartRef : null}
                >
                    <div className={style.cartHeader}>
                        <div className={style.cartHeaderTitle}>
                            Your trip so far
                        </div>
                        {isMobile &&
                            <div
                                className={style.cartHeaderCloseBtn}
                                onClick={toggleMobileCart}
                            >
                                Close
                            </div>
                        }
                    </div>
                    <HorizontalDottedLine/>
                    <div className={style.cartBody}>

                        {flightOffer &&
                            <div className={style.flightOfferWrapper}>
                                <FlightOfferCartItem
                                    flightOffer={flightOffer}
                                    displayOutbound={true}
                                    displayInbound={false}
                                    onRemoveOfferFromCart={() => removeOfferFromCart(flightOffer.offerId)}
                                />
                            </div>
                        }

                        {hotelOffer &&
                            <div className={style.flightOfferWrapper}>
                                <HotelOfferCartItem hotelOffer={hotelOffer}
                                                    onRemoveOfferFromCart={() => removeOfferFromCart(hotelOffer.offerId)}/>
                            </div>
                        }


                        {!hotelOffer && flightOffer &&
                            <BookHotelBtn
                                flightOffer={flightOffer}
                                flightSearchCriteria={flightSearchCriteria}
                            />
                        }


                        {flightOffer &&
                            <div className={style.flightOfferWrapper}>
                                <FlightOfferCartItem
                                    flightOffer={flightOffer}
                                    displayOutbound={false}
                                    displayInbound={true}
                                    onRemoveOfferFromCart={() => removeOfferFromCart(flightOffer.offerId)}/>
                            </div>
                        }

                        <Spinner enabled={isShoppingCartUpdateInProgress === true}/>
                        <div className={style.cartBodyBottom}/>
                        <HorizontalDottedLine/>
                        <div className={style.cartFooter}>
                            {flightOffer && flightPrice && <SubTotal price={flightPrice} title={"Flights:"}/>}
                            {hotelOffer && hotelPrice && <SubTotal price={hotelPrice} title={"Hotels:"}/>}
                            {totalPrice && totalPrice.public > 0 && <Total price={totalPrice} title={"Total:"}/>}
                        </div>
                        <div className={'pt-2'}/>
                        <div className={style.flightOfferBottomWrapper}>
                            <button className={bookButtonClassnames} onClick={onProceedToBook}>Book</button>
                        </div>
                        {config.DEV_MODE && links()}
                    </div>
                </div>
            </>
        );
    };


    return (
        <>
            {cartContent(false)}
            {cartContent(true)}
            {totalPrice && totalPrice.public > 0 && !mobileCartOpen &&
                <div
                    className={style.cartFloatingButton}
                    onClick={toggleMobileCart}
                >
                    Trip total: {totalPrice.public} {totalPrice.currency}
                </div>
            }
        </>
    )
}

const mapStateToProps = state => ({
    flightOffer: flightOfferSelector(state),
    hotelOffer: hotelOfferSelector(state),
    totalPrice: totalPriceSelector(state),  //total price of items in cart
    error: errorSelector(state),
    isShoppingCartUpdateInProgress:isShoppingCartUpdateInProgress(state),
    flightSearchCriteria: flightSearchCriteriaSelector(state)
});


const mapDispatchToProps = (dispatch) => {
    return {
        restoreCartFromServer: () => {
            dispatch(requestCartUpdateAction())
        },
        restoreSearchResultsFromCache: () => {
            dispatch(requestSearchResultsRestoreFromCache())
        },
        onClearCart: () => {
            invalidateCache().then(()=>{
                console.log('Cache removed')
            })
        },
        removeOfferFromCart: (offerId) => {
            dispatch(deleteOfferFromCartAction(offerId))
        },
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(ShoppingCart);
