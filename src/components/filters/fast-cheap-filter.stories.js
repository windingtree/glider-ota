import React from 'react';
import {
    action
} from '@storybook/addon-actions';

import {FastCheapFilter} from "./fast-cheap-filter";

export default {
    title: 'Filters/Fastest cheapest',
    component:FastCheapFilter
};


export const DefaultDurationSelected = () => (<FastCheapFilter defaultValue='DURATION' onToggle={action("onToggle")}/>);
export const DefaultPriceSelected = () => (<FastCheapFilter defaultValue='PRICE' onToggle={action("onToggle")}/>);
