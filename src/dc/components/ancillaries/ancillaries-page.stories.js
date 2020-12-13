import React from 'react';
import AncillariesSelection from "./ancillaries-page";
import dummySearchResults from "../../data/sample_response_flights.json"
import {
    action
} from '@storybook/addon-actions';

export default {
    component: AncillariesSelection,
    title: 'DC/ancillaries',
    excludeStories: /.*Data$/,
};

let selectedOfferId = Object.keys(dummySearchResults.offers)[0] //take first offer

export const defaultPage = () => {
    return (<AncillariesSelection searchResults={dummySearchResults} offerId={selectedOfferId}/>);
}
