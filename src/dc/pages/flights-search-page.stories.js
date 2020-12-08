import React from 'react';

import FlightsSearchPage from "./flights-search-page";
import searchResults from "../../data/sample_response_flights.json";

import {ProviderWrapper} from "../redux-stories-helper"
import {addDecorator} from "@storybook/react";
addDecorator(story =>  <ProviderWrapper>{story()}</ProviderWrapper>)


export default {
    title: 'DC/Pages/Flight search page',
    component:FlightsSearchPage
};
let location={
    search:''
}

export const Default = () => (<FlightsSearchPage location={location} results={searchResults}/>);

