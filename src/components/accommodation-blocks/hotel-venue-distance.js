import React from 'react';
import style from "./hotel-venue-distance.module.scss"
import {venueConfig} from "../venue-context/theme-context";
import Geopoint from 'geopoint';

export const HotelVenueDistance = ({hotelLatitude, hotelLongitude}) => {

    // Check if coordinates are provided
    if(!hotelLatitude || !hotelLongitude) {
        return (<></>);
    }

    let venuePoint = new Geopoint(Number(venueConfig.destinationLocation.latitude), Number(venueConfig.destinationLocation.longitude));
    let hotelPoint = new Geopoint(Number(hotelLatitude), Number(hotelLongitude));
    let distance = hotelPoint.distanceTo(venuePoint, true);

    // If more than 100km, ignore
    if(distance > 100) {
        return (<></>);
    }

    return (
        <div className={style.hotelVenueDistance}>{distance.toFixed(1)}km from {venueConfig.venueName} venue</div>
    );
}


