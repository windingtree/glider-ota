import React from 'react';
import sample from "../../dc/data/sample_response_hotels.json"
import YourChoice,{CheckinPolicy} from './your-choice'

let hotel = sample.accommodations["erevmax.07119"]

let price1 = sample.offers["7ed6503f-70b6-408d-a60e-a5c04a1f0161"].price
let room1 = sample.accommodations["erevmax.07119"].roomTypes.ND

export default {
    title: 'Hotels/HotelDetailsPage details'
};


export const YourChoiceND = () => (<YourChoice room={room1} hotel={hotel} price={price1}/> );

let checkinoutPolicy = {
    "checkinTime": "15:00",
    "checkoutTime": "24:00"
};
export const CheckIn = () => (<CheckinPolicy checkinoutPolicy={checkinoutPolicy} /> );



