import React from 'react';
import {
    action
} from '@storybook/addon-actions';

import {MaxNumberOfStopsFilter} from "./max-stops-filter"
import searchResults from "../../data/sample_response_unprocessed2.json"

export default {
    title: 'Filters/Max stops filter',
    component:MaxNumberOfStopsFilter
};



export const Default = () => (<MaxNumberOfStopsFilter key={123} onFilterStateChange={action("onFilterStateChange")} searchResults={searchResults}/>);
export const Max5Stops = () => (<MaxNumberOfStopsFilter key={124} maxStops={5} onFilterStateChange={action("onFilterStateChange")} searchResults={searchResults}/>);
