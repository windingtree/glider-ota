import React from 'react';
import shoppingCart from "../storybook-utils/mock-data/shopping_cart_accommodation_only.json"
import {HotelOfferSummary} from './hotel-offer-summary'

export default {
    title: 'DC/Hotels/Selected Offer',
    component: HotelOfferSummary
};

const hotelCartItem = shoppingCart.items.ACCOMMODATION_OFFER.item;
const {offerId, offer, price, hotel, room} = hotelCartItem

export const SampleHotelOffer = () => (<HotelOfferSummary room={room} price={price} hotel={hotel} />)


