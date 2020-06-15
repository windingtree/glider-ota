import React from 'react';
import {
  action
} from '@storybook/addon-actions';

import FlightSearchResults from "./flights-search-results"
import extendResponse from "../../utils/flight-search-results-extender";
import searchResults from "../../data/sample_response_unprocessed2"


let results  = extendResponse(searchResults);

export default {
  title: 'Flights/search results/multiple results',
  component: FlightSearchResults,
};


export const FullFlightSearchResults = () => (<FlightSearchResults searchResults={results} onOfferDisplay={action("onOfferDisplay")}/> );
