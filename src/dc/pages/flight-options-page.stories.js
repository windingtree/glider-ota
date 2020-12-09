import React from 'react';
import DCFlightOptionsPage from "./flight-options-page";
import dummySearchResults from "../data/sample_response_flights.json"
import {
    action
} from '@storybook/addon-actions';

export default {
    component: DCFlightOptionsPage,
    title: 'DC/pages/booking step2',
    excludeStories: /.*Data$/,
};

let selectedOfferId = Object.keys(dummySearchResults.offers)[0] //take first offer

export const defaultPage = () => {
    return (<DCFlightOptionsPage searchResults={dummySearchResults} offerId={selectedOfferId}/>);
}
