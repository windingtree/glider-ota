import React from 'react';
import {
    action
} from '@storybook/addon-actions';

import {JourneySummary} from "./journey-summary"
import {FlightSearchResultsWrapper} from "../../../utils/flight-search-results-wrapper"
import searchResults from '../storybook-utils/mock-data/flight_search_BOGMIA.json'

export default {
    title: 'flight blocks/journey summary',
    component:JourneySummary
};
let offerId="42ad23de-fdf5-4bf2-8d85-9c6ad7f3539e";
let searchResultsWrapper = new FlightSearchResultsWrapper(searchResults);
let itineraries = searchResultsWrapper.getOfferItineraries(offerId)

export const OneWayJourney = () => {
    let itins = [itineraries[0]]    //take only first itinerary - simulate it's one way
    return (<JourneySummary itineraries={itins}/>);
}

export const ReturnJourney = () => {
    return (<JourneySummary itineraries={itineraries}/>);
}
