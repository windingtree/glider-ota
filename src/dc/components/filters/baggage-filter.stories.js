import React from 'react';
import {
    action
} from '@storybook/addon-actions';

import {BaggageFilter} from "./baggage-filter";
import searchResults from "../../data/sample_response_unprocessed2.json"

export default {
    title: 'Filters/Baggage filter',
    component:BaggageFilter
};


export const Default = () => (<BaggageFilter   onPredicateChanged={action("onPredicateChanged")} title='Baggage' searchResults={searchResults}/>);
