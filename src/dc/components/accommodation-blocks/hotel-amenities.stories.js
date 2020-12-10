import React from 'react';
import {HotelAmenities} from "./hotel-amenities"

export default {
    title: 'DC/accommodation blocks/hotel amenities',
    component: HotelAmenities
};
const amenities = ['hair dryer', 'free wifi', 'toilet'];
const plentyOfAmenities = ['hair dryer', 'free wifi', 'toilet','parking lot','bathroom','swimming pool','spa','sauna','flat TV','hair dryer', 'free wifi', 'toilet','parking lot','bathroom','swimming pool','spa','sauna','flat TV','hair dryer', 'free wifi', 'toilet','parking lot','bathroom','swimming pool','spa','sauna','flat TV'];

export const AmenitiesExpanded = () => (<HotelAmenities amenities={amenities} defaultExpanded={true}/> )
export const AmenitiesCollapsed = () => (<HotelAmenities amenities={amenities} defaultExpanded={false}/> )
export const AmenitiesEmpty = () => (<HotelAmenities amenities={amenities} defaultExpanded={false}/> )
export const LotsOfAmenities = () => (<HotelAmenities amenities={plentyOfAmenities} defaultExpanded={false}/> )
