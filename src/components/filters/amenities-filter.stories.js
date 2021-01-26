import React from 'react';
import {
    action
} from '@storybook/addon-actions';

import searchResults from "../../dc/data/sample_response_hotels_simulator.json"
import {AmenitiesFilter} from "./amenities-filter";

export default {
    title: 'Filters/Hotel amenities',
    component:AmenitiesFilter
};

export const Default = () => (<div>
        <AmenitiesFilter title='amenities' searchResults={searchResults} onFilterSelectionChanged={action("onFilterSelectionChanged")}/>
    </div>
);
