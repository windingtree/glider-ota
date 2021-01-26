import React from 'react';
import {
    action
} from '@storybook/addon-actions';

import searchResults from "../../dc/data/sample_response_hotels_simulator.json"
import {HotelRatingFilter} from "./hotel-rating-filter";

export default {
    title: 'Filters/Hotel Rating filter',
    component:HotelRatingFilter
};

export const Default = () => (<div>
        <HotelRatingFilter title='Stars' searchResults={searchResults} onFilterSelectionChanged={action("onFilterSelectionChanged")}/>
    </div>
);
