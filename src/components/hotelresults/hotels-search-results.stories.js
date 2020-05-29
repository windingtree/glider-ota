import React from 'react';
import {
    action
} from '@storybook/addon-actions';
import sample from "../../data/sample_response_hotels1.json"
import HotelsSearchResults from './hotels-search-results'

export default {
    title: 'Hotels/Search results',
    component: HotelsSearchResults
};


export const MultipleHotels = () => (<HotelsSearchResults searchResults={sample} onHotelSelected={action("onHotelSelected")}/> );
