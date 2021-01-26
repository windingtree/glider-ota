import React from 'react';
import {
    action
} from '@storybook/addon-actions';
import sample from "../storybook-utils/mock-data/hotel_search_STOCKHOLM.json"
import Room,{RoomPricePlan} from './room-details'

let roomND = sample.accommodations["EREVMAX.07119"].roomTypes.ND
let roomND1 = sample.accommodations["EREVMAX.07119"].roomTypes.ND1
let roomNMD = sample.accommodations["EREVMAX.07119"].roomTypes.NMD

export default {
    title: 'Hotels/Room details'
};




let roomPricePlansWithOffers=[];
export const ExampleRoomND = () => (<Room room={roomND} roomPricePlansWithOffers={roomPricePlansWithOffers} onOfferSelected={action("onOfferSelected")}/> );
export const ExampleRoomND1 = () => (<Room room={roomND1} roomPricePlansWithOffers={roomPricePlansWithOffers} onOfferSelected={action("onOfferSelected")}/> );
export const ExampleRoomNMD = () => (<Room room={roomNMD} roomPricePlansWithOffers={roomPricePlansWithOffers} onOfferSelected={action("onOfferSelected")}/> );

let offer1 = sample.offers["23206d5b-dc76-4643-8d41-608d3e6e2b71"];
let pricePlanBAR = sample.pricePlans.BAR;

export const PricePlanBAR = () => (<RoomPricePlan offer={offer1} pricePlan={pricePlanBAR} room={roomND} onOfferSelected={action("onOfferSelected")}/> );
