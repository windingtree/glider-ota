import React from 'react';
import {
    action
} from '@storybook/addon-actions';
import FlightRates from "./flight-rates"
import sample_response from "../../data/sample_response_flights_transformed"

export default {
    component: FlightRates,
    title: 'FlightRates',
};


let selectedCombination = sample_response.combinations[0];
let selectedOffer = selectedCombination.offers[0];
export const PricePlans = () => (<FlightRates pricePlans={sample_response.pricePlans} selectedCombination={selectedCombination} selectedOffer={selectedOffer} onOfferChange={action("onOfferChange")}/>);

