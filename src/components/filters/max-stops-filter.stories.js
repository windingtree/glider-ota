import React from 'react';
import {
    action
} from '@storybook/addon-actions';

import {MaxNumberOfStopsFilter} from "./max-stops-filter"
import searchResults from "../storybook-utils/mock-data/sample_response_unprocessed2.json"

export default {
    title: 'Filters/Max stops filter',
    component:MaxNumberOfStopsFilter
};



export const Default = () => (<MaxNumberOfStopsFilter  onPredicateChanged={action("onPredicateChanged")} searchResults={searchResults}/>);
