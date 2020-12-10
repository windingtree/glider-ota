import React from 'react';
import {
    action
} from '@storybook/addon-actions';

import {JourneySummary} from "./journey-summary"
import {FlightSearchResultsWrapper} from "../../../utils/flight-search-results-wrapper"
import searchResults from '../storybook-utils/mock-data/flight_search_BOGMIA.json'

export default {
    title: 'DC/flight blocks/journey summary',
    component:JourneySummary
};

let searchResultsWrapper = new FlightSearchResultsWrapper(searchResults);

export const OneWayJourney = () => {
    let offerId="473b8a2a-65db-48f5-87b0-9626f61ad65d";
    let itineraries = searchResultsWrapper.getOfferItineraries(offerId)
    return (<JourneySummary itineraries={itineraries}/>);
}

export const ReturnJourney = () => {
    let offerId="42ad23de-fdf5-4bf2-8d85-9c6ad7f3539e";
    let itineraries = searchResultsWrapper.getOfferItineraries(offerId)
    return (<JourneySummary itineraries={itineraries}/>);
}
