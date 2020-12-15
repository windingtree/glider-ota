import React from 'react';
import {
    action
} from '@storybook/addon-actions';
import {HotelsSearchResults} from './hotels-search-results'
import sample from "../storybook-utils/mock-data/hotel_search_BOGOTA.json"

export default {
    title: 'DC/Search results/Multiple hotels',
    component: HotelsSearchResults
};

//FIXME - use sample with more results
export const Default = () => (<HotelsSearchResults searchResults={sample} onHotelSelected={action("onHotelSelected")}/> );
