import React from 'react';
import {action} from '@storybook/addon-actions';

import {FlightsSearchResults} from "./flights-search-results"
import extendResponse from "../../utils/flight-search-results-extender";
import searchResults from "../storybook-utils/mock-data/flight_search_BOGMIA.json"


import {ProviderWrapper} from "../../redux/redux-stories-helper"
import {addDecorator} from "@storybook/react";

addDecorator(story =>  <ProviderWrapper>{story()}</ProviderWrapper>)


let results  = extendResponse(searchResults);

export default {
  title: 'Search results/flights',
  component: FlightsSearchResults,
};


export const FullFlightSearchResults = () => (<FlightsSearchResults searchResults={results} onOfferDisplay={action("onOfferDisplay")} searchInProgress={false}/> );
