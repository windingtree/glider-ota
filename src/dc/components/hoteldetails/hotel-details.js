import React, {useState} from 'react'
import style from './hotel-details.module.scss'
import {Row, Col, Image, Container} from 'react-bootstrap'
import _ from 'lodash'
import {Room} from "./room-details"
import {HotelLeadingImage} from "../accommodation-blocks/hotel-leading-image";
import {ExpandCollapseToggle, ExpandCollapseToggleV2} from "../common-blocks/expand-collapse-toggle"

import {HotelAddress} from "../accommodation-blocks/hotel-address"
import {addHotelToCartAction} from "../../../redux/sagas/shopping-cart-store";
import {connect} from "react-redux";



export function HotelDetails({hotel, searchResults, onAddOfferToCart}) {
    console.log('Display hotel details',hotel)
    const [selectedOffer,setSelectedOffer] = useState()
    const [roomsExpanded,setRoomsExpanded] = useState(false)
    const offers = searchResults.offers;
    const pricePlans = searchResults.pricePlans;
    const hotelPricePlansWithOffers = getHotelPricePlansWithOffers(hotel, offers, pricePlans);
    const {name:hotelName, description:hotelDescription, media:hotelImages, roomTypes:rooms} = hotel;
    const hotelAddress = _.get(hotel, 'contactInformation.address');
    const hotelLeadingImageUrl =  getLeadingHotelImageUrl(hotel);

    const handleAddOfferToCart = ({offerId, price, room}) =>{


        if(onAddOfferToCart) {
             onAddOfferToCart(offerId, room, hotel, price)
        }
        else {
            console.warn('onAddOfferToCart is not defined!');
        }
    }

    const findLowestHotelPrice = () => {
        let minPrice = Number.MAX_SAFE_INTEGER;
        let minOffer = undefined;
        if (hotelPricePlansWithOffers) {
            hotelPricePlansWithOffers.forEach(offer => {
                if (parseInt(offer.price.public) < minPrice) {
                    minPrice = offer.price.public;
                    minOffer = offer;
                }
            })
        }
        if(minPrice === Number.MAX_SAFE_INTEGER) {
            return null
        }else{
            return minOffer.price;

    }

}
    let lowestPrice = findLowestHotelPrice();

    return (
                <Container><Row className={style.hotelContainer}>
                    <Col>
                        {hotelLeadingImageUrl && <HotelLeadingImage url={hotelLeadingImageUrl}/>}
                        <div className={style.hotelName}>{hotelName}</div>
                        {hotelAddress && <HotelAddress address={hotelAddress}/>}
                        {hotelDescription && <div className={style.hotelDescription}>{hotelDescription}</div>}
                        <Row>
                            <Col>{lowestPrice && <div className={style.hotelLowestPrice}>From {lowestPrice.public} {lowestPrice.currency}</div>}</Col>
                            <Col ><ExpandCollapseToggleV2 expanded={roomsExpanded} collapsedText={'Show rooms'} expandedText={'Hide rooms'} onToggle={setRoomsExpanded} customClassName={style.showHideRoomsToggle}/></Col>
                        </Row>

                        {roomsExpanded && displayRooms(rooms,hotelPricePlansWithOffers,selectedOffer, handleAddOfferToCart)}
                    </Col>
                </Row>
                </Container>
        )
}

const displayRooms = (rooms, hotelPricePlansWithOffers, selectedOffer, onAddOfferToCart) =>{
    return(<div>
        {
            _.map(rooms, (room, roomId) => {
                const roomPricePlansWithOffers=getRoomPricePlansWithOffers(roomId,hotelPricePlansWithOffers)
                return (<Room room={room} key={roomId} roomPricePlansWithOffers={roomPricePlansWithOffers}  selectedOffer={selectedOffer} onAddOfferToCart={onAddOfferToCart}/>)
            })
        }
    </div>)
}


function getHotelPricePlansWithOffers(hotel, offers, pricePlans){
    let hotelOffers = [];
    let roomTypes = hotel.roomTypes;
    let accommodationId = hotel.accommodationId;
    _.map(offers,(offer,offerId)=>{
        _.map(offer.pricePlansReferences,(ppRef,ppRefId)=>{
            if(ppRef.accommodation === accommodationId){
                hotelOffers.push({
                    accommodation:accommodationId,
                    roomType:ppRef.roomType,
                    pricePlanReference:ppRefId,
                    pricePlan:pricePlans[ppRefId],
                    price:offer.price,
                    offerId:offerId,
                    room:roomTypes[ppRef.roomType]
                })
            }
        })
    })
    hotelOffers.sort((a,b)=>{
        return a.price.public>b.price.public?1:-1;
    });

    return hotelOffers
}

function getRoomPricePlansWithOffers(roomType, hotelPlansWithOffers) {
    return hotelPlansWithOffers.filter(rec => {
        return rec.roomType === roomType;
    })
}



const getLeadingHotelImageUrl = (hotel) => {
    const {media: images} = hotel;
    if(images && Array.isArray(images) && images.length > 0){
        return images[0].url;
    }
    return null;
}




const mapDispatchToProps = (dispatch) => {
    return {
        onAddOfferToCart: (offerId, room, hotel, price) => {
            dispatch(addHotelToCartAction(offerId, room, hotel, price))
        }
    }
}



export default connect(null, mapDispatchToProps)(HotelDetails);


