import React from 'react';
import DCSummaryPage from "./summary-page";
import dummySearchResults from "../data/sample_response_flights.json"
import {
    action
} from '@storybook/addon-actions';

export default {
    component: DCSummaryPage,
    title: 'DC/pages/booking step3',
    excludeStories: /.*Data$/,
};

let selectedOfferId = Object.keys(dummySearchResults.offers)[0] //take first offer

export const defaultPage = () => {
    return (<DCSummaryPage searchResults={dummySearchResults} offerId={selectedOfferId}/>);
}
