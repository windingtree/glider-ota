import React from 'react';
import {
    action
} from '@storybook/addon-actions';
// import sample from "../../data/sample_response_hotels_simulator.json"
import sample from "../storybook-utils/mock-data/hotel_search_STOCKHOLM.json"
import {HotelDetails,HotelLeadingImage} from './hotel-details'
import {HotelSearchResultsFilterHelper} from "../../../utils/hotel-search-results-filter-helper";
const searchHelper = new HotelSearchResultsFilterHelper(sample);

export default {
    title: 'Hotels/HotelDetailsPage details',
    component: HotelDetails
};


const showHotel = (searchResultsIndex) => {
    let hotel = searchHelper.generateSearchResults()[searchResultsIndex].hotel;
    return (<HotelDetails hotel={hotel} searchResults={sample}/>)
}

export const ExampleHotelFromAmadeus1 = () => showHotel(1);
export const ExampleHotelFromAmadeus2 = () => showHotel(1);
export const ExampleHotelFromRevmax = () => showHotel(6);
