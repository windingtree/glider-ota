import React, {useState} from 'react'
import style from './hotel-details.module.scss'
import {Row, Col, Image} from 'react-bootstrap'
import _ from 'lodash'
import {Room} from "./room-details"
import {HotelLeadingImage} from "../accommodation-blocks/hotel-leading-image";
import {ExpandCollapseToggle} from "../common-blocks/expand-collapse-toggle"

import {HotelAddress} from "../accommodation-blocks/hotel-address"
import {addHotelToCartAction} from "../../../redux/sagas/cart";
import {connect} from "react-redux";



export function HotelDetails({hotel, searchResults, onAddOfferToCart}) {
    console.log('Display hotel details',hotel)
    const [selectedOffer,setSelectedOffer] = useState()
    const [roomsExpanded,setRoomsExpanded] = useState(true)
    const offers = searchResults.offers;
    const pricePlans = searchResults.pricePlans;
    const hotelPricePlansWithOffers = getHotelPricePlansWithOffers(hotel, offers, pricePlans);
    const {name:hotelName, description:hotelDescription, media:hotelImages, roomTypes:rooms} = hotel;
    const hotelAddress = _.get(hotel, 'contactInformation.address');
    const hotelLeadingImageUrl =  getLeadingHotelImageUrl(hotel);

    const handleAddOfferToCart = ({offerId, price, room}) =>{


        if(onAddOfferToCart) {
            const hotelCartItem = {
                offerId:offerId,
                price:price,
                room: room,
                hotel: hotel
            }
            console.log('handleAddOfferToCart:',hotelCartItem)
            onAddOfferToCart(hotelCartItem)
        }
        else {
            console.warn('onAddOfferToCart is not defined!');
        }
    }


    return (
                <Row className={style.hotelContainer}>
                    <Col>
                        {hotelLeadingImageUrl && <HotelLeadingImage url={hotelLeadingImageUrl}/>}
                        <div className={style.hotelName}>{hotelName}</div>
                        {hotelAddress && <HotelAddress address={hotelAddress}/>}
                        {hotelDescription && <div className={style.hotelDescription}>{hotelDescription}</div>}
                        {roomsExpanded === true?'Hide rooms':'Show rooms'}
                        <ExpandCollapseToggle expanded={roomsExpanded} onToggle={setRoomsExpanded}/>
                        {roomsExpanded && displayRooms(rooms,hotelPricePlansWithOffers,selectedOffer, handleAddOfferToCart)}
                    </Col>
                </Row>
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
        console.log("OfferID",offerId," = ",offer)
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
        onAddOfferToCart: (offer) => {
            dispatch(addHotelToCartAction(offer))
        }
    }
}



export default connect(null, mapDispatchToProps)(HotelDetails);


