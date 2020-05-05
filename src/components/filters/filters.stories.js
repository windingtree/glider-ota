import React from 'react';
import {
    action
} from '@storybook/addon-actions';

import {FastCheapFilter, RangeFilter, SelectionFilter} from "./filters"

export default {
    title: 'Filters',
};

const sample_price_range={
    highest: 1000,
    lowest: 0,
    max: 800,
    min: 40,
}

const sample_airline_selection=[
    {key: "KL", display: "KLM", selected: true},
    {key: "AF", display: "Air France", selected: true},
    {key: "DL", display: "Delta", selected: true},
    {key: "VS", display: "Virgin", selected: true},
]
export const RangeFilterPrice = () => (<RangeFilter id='price' filterState={sample_price_range} title='Price' unit='EUR' onFilterStateChange={action("onFilterStateChange")}/>);
export const SelectionFilterAirline = () => (<SelectionFilter id='airline' filterState={sample_airline_selection} title='Airlines' onFilterStateChange={action("onFilterStateChange")}/>);
export const FastCheapDefault = () => (<FastCheapFilter onToggle={action("onToggle")}/>);
export const FastCheapFastest = () => (<FastCheapFilter defaultValue='duration' onToggle={action("onToggle")}/>);
