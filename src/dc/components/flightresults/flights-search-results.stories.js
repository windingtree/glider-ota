import React from 'react';
import {
  action
} from '@storybook/addon-actions';

import { Router } from 'react-router'
import { Provider } from 'react-redux'

import FlightSearchResults from "./flights-search-results"
import extendResponse from "../../../utils/flight-search-results-extender";
import searchResults from "../../../data/sample_response_unprocessed2"


import {ProviderWrapper} from "../../redux-stories-helper"
import {addDecorator} from "@storybook/react";
addDecorator(story =>  <ProviderWrapper>{story()}</ProviderWrapper>)


let results  = extendResponse(searchResults);

export default {
  title: 'DC/Search results/flights',
  component: FlightSearchResults,
};


export const FullFlightSearchResults = () => (<FlightSearchResults searchResults={results} onOfferDisplay={action("onOfferDisplay")}/> );
