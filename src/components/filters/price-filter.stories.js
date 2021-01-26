import React from 'react';
import {
    action
} from '@storybook/addon-actions';

import {PriceFilter} from "./price-filter";
import searchResults from "../../dc/data/sample_response_unprocessed2.json"

export default {
    title: 'Filters/Price filter',
    component:PriceFilter
};


export const Default = () => (<PriceFilter  title='Price' onPredicateChanged={action("onPredicateChanged")} searchResults={searchResults}/>);
