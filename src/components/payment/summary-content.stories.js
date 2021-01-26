import React from 'react';
import SummaryContent from "./summary-content";
import dummySearchResults from "../storybook-utils/mock-data/sample_response_flights.json"

export default {
    component: SummaryContent,
    title: 'pages/price summary',
    excludeStories: /.*Data$/,
};

let selectedOfferId = Object.keys(dummySearchResults.offers)[0] //take first offer

export const defaultPage = () => {
    return (<SummaryContent searchResults={dummySearchResults} offerId={selectedOfferId}/>);
}
