import React from 'react';
import {
    action
} from '@storybook/addon-actions';
import {ShoppingCart} from './shopping-cart'
import sampleHotels from "../storybook-utils/mock-data/hotel_search_BOGOTA.json"
import sampleFlights from "../storybook-utils/mock-data/flight_search_BOGMIA.json"

export default {
    title: 'DC/shopping cart',
    component: ShoppingCart
};

export const EmptyCart = () => (<ShoppingCart /> );
