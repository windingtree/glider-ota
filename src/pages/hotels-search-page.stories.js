import React from 'react';
import {
    action
} from '@storybook/addon-actions';

import searchResults from "../data/sample_response_hotels_simulator.json";
import HotelsSearchPage from "./hotels-search-page";

export default {
    title: 'Pages/Hotels search page',
    component:HotelsSearchPage
};
let location={
    search:''
}

export const Default = () => (<HotelsSearchPage location={location} results={searchResults}/>);

