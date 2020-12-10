import React, {useState} from 'react'
import style from './hotel-details.module.scss'
import {Row, Col, Image} from 'react-bootstrap'
import _ from 'lodash'
import Room from "./room-details"
import {HotelLeadingImage} from "../accommodation-blocks/hotel-leading-image";


import {HotelAddress} from "../accommodation-blocks/hotel-address"

export default function HotelDetails({hotel, searchResults}) {
    const [selectedOffer,setSelectedOffer] = useState()
    const offers = searchResults.offers;
    const pricePlans = searchResults.pricePlans;
    const hotelPricePlansWithOffers = getHotelPricePlansWithOffers(hotel, offers, pricePlans);
    const {name:hotelName, description:hotelDescription, media:hotelImages, roomTypes:rooms} = hotel;
    const hotelAddress = _.get(hotel, 'contactInformation.address');
    const hotelLeadingImageUrl =  getLeadingHotelImageUrl(hotel);
    return (
                <Row className={style.hotelContainer}>
                    <Col>
                        {hotelLeadingImageUrl && <HotelLeadingImage url={hotelLeadingImageUrl}/>}
                        <div className={style.hotelName}>{hotelName}</div>
                        {hotelAddress && <HotelAddress address={hotelAddress}/>}
                        {hotelDescription && <div className={style.hotelDescription}>{hotelDescription}</div>}
                        <div>
                            {
                                _.map(rooms, (room, roomId) => {
                                    const roomPricePlansWithOffers=getRoomPricePlansWithOffers(roomId,hotelPricePlansWithOffers)
                                    return (<Room room={room} key={roomId} roomPricePlansWithOffers={roomPricePlansWithOffers}  selectedOffer={selectedOffer}/>)
                                })
                            }
                        </div>
                    </Col>
                </Row>
        )
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



