import React from 'react';
import {
    action
} from '@storybook/addon-actions';

import {FlightDuration} from "./flight-duration"
import {FlightSearchResultsWrapper} from "../../../utils/flight-search-results-wrapper";
import searchResults from "../storybook-utils/mock-data/flight_search_BOGMIA.json";
export default {
    title: 'DC/flight blocks/flight duration',
    component:FlightDuration
};



let searchResultsWrapper = new FlightSearchResultsWrapper(searchResults);
let offerId="c136af56-faad-401c-87dd-f753b49face7";
let itineraries = searchResultsWrapper.getOfferItineraries(offerId)
let firstItinerary = itineraries[0];
let firstSegment = firstItinerary.segments[0]
let lastSegment = firstItinerary.segments[firstItinerary.segments.length-1];

export const Duration = () => (<FlightDuration startOfTripDate={firstSegment.departureTime} endOfTripDate={lastSegment.arrivalTime}  segments={firstItinerary.segments}/>);
