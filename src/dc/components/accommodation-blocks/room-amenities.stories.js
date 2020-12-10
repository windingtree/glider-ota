import React from 'react';
import {RoomAmenities} from "./room-amenities"

export default {
    title: 'DC/accommodation blocks/hotel amenities',
    component: RoomAmenities
};
const amenities = ['hair dryer', 'free wifi', 'toilet'];
const plentyOfAmenities = ['hair dryer', 'free wifi', 'toilet','parking lot','bathroom','swimming pool','spa','sauna','flat TV','hair dryer', 'free wifi', 'toilet','parking lot','bathroom','swimming pool','spa','sauna','flat TV','hair dryer', 'free wifi', 'toilet','parking lot','bathroom','swimming pool','spa','sauna','flat TV'];

export const AmenitiesExpanded = () => (<RoomAmenities amenities={amenities} defaultExpanded={true}/> )
export const AmenitiesCollapsed = () => (<RoomAmenities amenities={amenities} defaultExpanded={false}/> )
export const AmenitiesEmpty = () => (<RoomAmenities amenities={amenities} defaultExpanded={false}/> )
export const LotsOfAmenities = () => (<RoomAmenities amenities={plentyOfAmenities} defaultExpanded={false}/> )
