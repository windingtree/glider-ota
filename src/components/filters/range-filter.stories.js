import React from 'react';
import {
    action
} from '@storybook/addon-actions';

import {RangeFilter} from "./range-filter";

export default {
    title: 'Filters/Base range filter',
};
const filterState={min: 15, lowest: 10, highest: 120, max: 110};

export const Default = () => (<RangeFilter id='rangeFilter'  unit='EUR' filterState={filterState} title='Title' onFilterStateChange={action("onFilterStateChange")}/>);
