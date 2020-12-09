import React from 'react';
import {
    action
} from '@storybook/addon-actions';

import {ItinerarySummary} from "./itinerary-information"
import {FlightSearchResultsWrapper} from "../../../utils/flight-search-results-wrapper"
import searchResults from '../storybook-utils/mock-data/flight_search_BOGMIA.json'

export default {
    title: 'DC/flight blocks/itinerary information',
    component:ItinerarySummary
};

let searchResultsWrapper = new FlightSearchResultsWrapper(searchResults);
let offerId="c136af56-faad-401c-87dd-f753b49face7";
let itineraries = searchResultsWrapper.getOfferItineraries(offerId)
let firstItinerary = itineraries[0];
export const Arrival = () => (<ItinerarySummary  itinerary={firstItinerary}/>);
