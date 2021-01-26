import React from 'react';
import {
    action
} from '@storybook/addon-actions';

import searchResults from "../../dc/data/sample_response_hotels_simulator.json"
import {NightPriceFilter} from "./night-price-filter";

export default {
    title: 'Filters/Night Price filter',
    component:NightPriceFilter
};


export const OneNightsStay = () => (<NightPriceFilter  title='Price per night' onFilterSelectionChanged={action("onFilterSelectionChanged")} searchResults={searchResults} numberOfNights={1}/>);
export const TwoNightsStay = () => (<NightPriceFilter  title='Price per night' onFilterSelectionChanged={action("onFilterSelectionChanged")} searchResults={searchResults} numberOfNights={2}/>);
export const ZeroNightStay_INCORRECT = () => (<NightPriceFilter  title='Price per night' onFilterSelectionChanged={action("onFilterSelectionChanged")} searchResults={searchResults} numberOfNights={0}/>);
