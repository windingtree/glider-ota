import React from 'react';
import {
    action
} from '@storybook/addon-actions';
import sample from "../../data/sample_response_hotels.json"
import HotelDetails,{HotelPriceSummary,HotelLeadingImage} from './hotel-details'

let hotel = sample.accommodations["erevmax.07119"]


export default {
    title: 'Hotels/HotelDetailsPage details',
    component: HotelDetails
};


export const HotelPage = () => (<HotelDetails hotel={hotel} searchResults={sample}/> );

let price = {
    currency: "SEK",
    public: "776.0",
    taxes: 136
}

export const PriceSummary = () => (<HotelPriceSummary price={price}  onPayButtonClick={action("onPayButtonClick")}/>);
export const LeadingImage = () => (<HotelLeadingImage images={hotel.media}/>);