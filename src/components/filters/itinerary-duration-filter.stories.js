import React from 'react';
import {
    action
} from '@storybook/addon-actions';

import {ItineraryDurationFilter} from "./itinerary-duration-filter"
import searchResults from "../../data/sample_response_unprocessed2.json"

export default {
    title: 'Filters/Layover duration filter',
    component:ItineraryDurationFilter
};



export const Default = () => (<ItineraryDurationFilter title="Layover duration" onFilterStateChanged={action("onFilterStateChanged")} searchResults={searchResults} orig='YUL' dest='YVR'/>);
