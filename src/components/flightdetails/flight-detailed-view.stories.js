import React from 'react';
import {
    action
} from '@storybook/addon-actions';
import FlightDetail from "./flight-detailed-view"
import sample_response from "../../data/sample_response_flights_transformed"

export default {
    component: FlightDetail,
    title: 'Flight details components',
};

let selectedCombination = sample_response.combinations[0];
let selectedOffer = selectedCombination.offers[0];
export const FlightDetailPage = () => (<FlightDetail searchResults={sample_response} selectedCombination={selectedCombination} selectedOffer={selectedOffer} onOfferChange={action("onOfferChange")}/>);

