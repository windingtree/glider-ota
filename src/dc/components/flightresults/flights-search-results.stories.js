import React from 'react';
import {
  action
} from '@storybook/addon-actions';

import { Router } from 'react-router'
import { Provider } from 'react-redux'

import {FlightsSearchResults} from "./flights-search-results"
import extendResponse from "../../../utils/flight-search-results-extender";
import searchResults from "../storybook-utils/mock-data/flight_search_BOGMIA.json"


import {ProviderWrapper} from "../../redux-stories-helper"
import {addDecorator} from "@storybook/react";
addDecorator(story =>  <ProviderWrapper>{story()}</ProviderWrapper>)


let results  = extendResponse(searchResults);

export default {
  title: 'DC/Search results/flights',
  component: FlightsSearchResults,
};


export const FullFlightSearchResults = () => (<FlightsSearchResults searchResults={results} onOfferDisplay={action("onOfferDisplay")} searchInProgress={false}/> );
