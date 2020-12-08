import React from 'react';
import {
  action
} from '@storybook/addon-actions';
import dummyFlightResults from '../../data/sample_response_unprocessed.json'
import dummyHotelResults from '../../data/sample_response_hotels.json'

import {ShoppingCart} from "./shopping-cart"


export default {
  title: 'DC/Flights/shopping cart',
  component: ShoppingCart,
};

const sampleFlightOffer = dummyFlightResults.offers["0a8f5b47-5388-41f9-a382-2d08f7999e42"];
const sampleHotelOffer = dummyHotelResults.offers["7ed6503f-70b6-408d-a60e-a5c04a1f0161"];

export const EmptyCart = () => (<ShoppingCart onProceedToBook={action('onProceedToBook')}/>);
export const FlightOnly = () => (<ShoppingCart flightOffer={sampleFlightOffer} onProceedToBook={action('onProceedToBook')}/>);
export const HotelOnly = () => (<ShoppingCart hotelOffer={sampleHotelOffer} onProceedToBook={action('onProceedToBook')}/>);
export const HotelAndFlight = () => (<ShoppingCart hotelOffer={sampleHotelOffer} flightOffer={sampleFlightOffer} onProceedToBook={action('onProceedToBook')}/>);
