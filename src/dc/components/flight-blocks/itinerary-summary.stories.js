import React from 'react';
import {
    action
} from '@storybook/addon-actions';

import {ItinerarySummary} from "./itinerary-summary"
import {FlightSearchResultsWrapper} from "../../../utils/flight-search-results-wrapper"
import searchResults from '../storybook-utils/mock-data/flight_search_BOGMIA.json'

export default {
    title: 'DC/flight blocks/itinerary information',
    component:ItinerarySummary
};

let searchResultsWrapper = new FlightSearchResultsWrapper(searchResults);

export const ItineraryWith1Stop = () => {
    let offerId="473b8a2a-65db-48f5-87b0-9626f61ad65d";
    let itineraries = searchResultsWrapper.getOfferItineraries(offerId)
    let firstItinerary = itineraries[0];
    return (<ItinerarySummary  itinerary={firstItinerary}/>);
}
export const ItineraryWith2Stops = () => {
    let offerId="c136af56-faad-401c-87dd-f753b49face7";
    let itineraries = searchResultsWrapper.getOfferItineraries(offerId)
    let firstItinerary = itineraries[0];
    return (<ItinerarySummary  itinerary={firstItinerary}/>);
}
