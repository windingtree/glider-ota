import React from 'react';

import {LodgingInfo} from "./lodging-info"
export default {
    title: 'DC/accommodation blocks/lodging info',
    component:LodgingInfo
};

let checkIn = new Date(2021,10,11);
let checkOut = new Date(2021,10,14);

export const NoDates = () => (<LodgingInfo cityName={'Bogota'}/>);
export const WithDates = () => (<LodgingInfo cityName={'Bogota'} checkInDate={checkIn} checkOutDate={checkOut}/>);
