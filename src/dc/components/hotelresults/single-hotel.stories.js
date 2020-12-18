import React from 'react';
import {
  action
} from '@storybook/addon-actions';
import sample from "../../data/sample_response_hotels.json"
import SingleHotel from "./single-hotel"

let hotel = sample.accommodations["erevmax.07119"]
let offer = sample.offers["7ed6503f-70b6-408d-a60e-a5c04a1f0161"]

export default {
  title: 'Search results/SingleHotel',
  component: SingleHotel
};


export const Default = () => (<SingleHotel hotel={hotel} bestoffer={offer} handleClick={action("handleClick")} searchResults={sample}/> );
