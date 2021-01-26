import React from 'react';

import {ItinerarySummary} from "./itinerary-summary"
import {FlightSearchResultsWrapper} from "../../utils/flight-search-results-wrapper"
import searchResults from '../storybook-utils/mock-data/flight_search_BOGMIA.json'

export default {
    title: 'flight blocks/itinerary information',
    component:ItinerarySummary
};



export const ItineraryWith1Stop = () => {
    let offerId="42ad23de-fdf5-4bf2-8d85-9c6ad7f3539e";
    let searchResultsWrapper = new FlightSearchResultsWrapper(searchResults);
    let itineraries = searchResultsWrapper.getOfferItineraries(offerId)
    let firstItinerary = itineraries[0];
    return (<ItinerarySummary  itinerary={firstItinerary}/>);
}
export const ItineraryWith2Stops = () => {
    let offerId="99f15eff-bc26-458a-a5bc-c37411cb7238";
    let searchResultsWrapper = new FlightSearchResultsWrapper(searchResults);
    let itineraries = searchResultsWrapper.getOfferItineraries(offerId)
    let firstItinerary = itineraries[0];
    return (<ItinerarySummary  itinerary={firstItinerary}/>);
}
