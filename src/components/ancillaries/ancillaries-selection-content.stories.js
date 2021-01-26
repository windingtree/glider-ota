import React from 'react';
import AncillariesSelection from "./ancillaries-selection-content";
import dummySearchResults from "../../dc/data/sample_response_flights.json"

export default {
    component: AncillariesSelection,
    title: 'ancillaries',
    excludeStories: /.*Data$/,
};

let selectedOfferId = Object.keys(dummySearchResults.offers)[0] //take first offer

export const defaultPage = () => {
    return (<AncillariesSelection searchResults={dummySearchResults} offerId={selectedOfferId}/>);
}
