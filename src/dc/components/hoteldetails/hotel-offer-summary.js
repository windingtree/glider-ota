import React, {useState} from 'react'
import style from './hotel-offer-summary.module.scss'
import {Row, Col, Image, Container} from 'react-bootstrap'
import _ from 'lodash'
import {HotelAddress} from "../accommodation-blocks/hotel-address"
import {RoomAmenities} from "../accommodation-blocks/room-amenities";


export function HotelOfferSummary({hotel, room, offer, price}) {

    const hotelInformation = (hotel) =>{
        const {name:hotelName, description:hotelDescription, media:hotelImages, roomTypes:rooms} = hotel;
        const hotelAddress = _.get(hotel, 'contactInformation.address');
        let hotelCity;
        if(hotelAddress  && hotelAddress.locality)
            hotelCity=hotelAddress.locality;

        return (
            <>
                {hotelCity && <div className={style.hotelStayHeader}>Hotel stay in {hotelCity}</div>}
            <Container>
            <Row className={style.hotelName}>{hotelName}</Row>
                <Row>{hotelAddress && <HotelAddress address={hotelAddress}/>}</Row>
                <Row>{hotelDescription && <div className={style.hotelDescription}>{hotelDescription}</div>}</Row>
            </Container></>)
    }

    const roomInformation = (room) => {
        const {name, maximumOccupancy, amenities, media, description} = room;
        let imageUrl;
        if(media && Array.isArray(media) && media.length>0){
            imageUrl=media[0].url;
        }
        return (
            <Container>
                <Row noGutters={true}>
                    {imageUrl && <Col sm={5}><Image className={style.roomImage} src={imageUrl}/></Col>}
                    <Col sm={7}>
                        <div className={style.roomName}>{name}</div>
                        <RoomAmenities amenities={amenities} defaultExpanded={false}/>
                    </Col>
                </Row>
                <Row  className={style.roomDescription}>
                    {description}
                </Row>
                {price &&
                    <div className={'pt-4 pb-4'}>
                        <div className={style.roomPrice}>{price.public} {price.currency}</div>
                    </div>}
            </Container>
        )
    }

    return (
                <Container>
                    <Row className={style.hotelContainer}>
                        {hotel && hotelInformation(hotel)}
                        {room && roomInformation(room)}
                    </Row>
                </Container>
        )
}

