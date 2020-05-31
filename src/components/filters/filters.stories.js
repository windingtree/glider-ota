import React from 'react';
import {
    action
} from '@storybook/addon-actions';

import searchResults from "../../data/sample_response_unprocessed2.json"

import Filters from "./filters"
import {ItineraryDurationFilter} from "./itinerary-duration-filter";

export default {
    title: 'Filters/Flights filters',
    component:Filters
};



export const Default = () => (<Filters searchResults={searchResults} onFilterApply={action("onFilterApply")}/>);
