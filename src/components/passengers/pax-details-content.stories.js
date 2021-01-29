import React from 'react';
import dummyFlightSearch from "../storybook-utils/mock-data/flight_search_BOGMIA.json"
import dummyHotelSearch from "../storybook-utils/mock-data/hotel_search_BOGOTA.json"

import {PaxDetailsContent} from "./pax-details-content";

export default {
    component: PaxDetailsContent,
    title: 'Passenger/Passenger Details',
};


export const Default = () => (<PaxDetailsContent flightSearchResults={dummyFlightSearch} hotelSearchResults={dummyHotelSearch} refreshInProgress={false}/>);

