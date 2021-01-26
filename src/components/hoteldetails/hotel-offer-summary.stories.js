import React from 'react';
import shoppingCart from "../storybook-utils/mock-data/shopping_cart_accommodation_only.json"
import {HotelOfferSummary} from './hotel-offer-summary'

export default {
    title: 'Hotels/Selected Offer',
    component: HotelOfferSummary
};

const hotelCartItem = shoppingCart.items.ACCOMMODATION_OFFER.item;
const {offerId, offer, price, hotel, room} = hotelCartItem;
let hotelPrice = shoppingCart.items.ACCOMMODATION_OFFER.price;
if(hotelPrice === undefined) {
    hotelPrice = price;
}

export const SampleHotelOffer = () => (<HotelOfferSummary room={room} price={hotelPrice} hotel={hotel} />)


