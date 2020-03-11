import default_hotel_image from "../../assets/default_hotel_image.png";
import {Image} from "react-bootstrap";
import './hotel-image.scss'
import React from "react";

const HotelLeadingImage = ({images}) => {
    const image = (images !== undefined && images.length > 0) ? images[0].url : default_hotel_image;
    return (
        <Image width={180} className='hotel-image-main' src={image}/>
        )
}

const RoomImage = ({images}) => {
    const image = (images !== undefined && images.length > 0) ? images[0].url : default_hotel_image;
    return (<Image width={180} className='room-image-main' src={image}/>)
}


export {HotelLeadingImage, RoomImage}