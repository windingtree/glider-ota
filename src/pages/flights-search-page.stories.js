import React from 'react';
import {
    action
} from '@storybook/addon-actions';

import FlightsSearchPage from "./flights-search-page";
import searchResults from "../data/sample_response_flights.json";

export default {
    title: 'Pages/Flight search page',
    component:FlightsSearchPage
};
let location={
    search:''
}

export const Default = () => (<FlightsSearchPage location={location} results={searchResults}/>);

