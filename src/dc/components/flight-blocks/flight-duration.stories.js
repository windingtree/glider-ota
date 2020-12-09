import React from 'react';
import {
    action
} from '@storybook/addon-actions';

import {FlightDuration, FDTYPES} from "./flight-duration"
export default {
    title: 'DC/flight blocks/flight duration',
    component:FlightDuration
};


let startOfTripDate=new Date(2021, 2, 10, 10, 19, 50);
let endOfTripDate=new Date(2021, 2, 10, 18, 49, 50);

let startOfTripStr='2021-05-06T10:19:19.155Z';
let endOfTripStr='2021-05-06T18:49:49.155Z';



export const Duration = () => (<FlightDuration startOfTripDate={startOfTripDate} endOfTripDate={endOfTripDate} carrierNames={['British airways','Swiss']} duration={'13h 30 min'} fdType={FDTYPES.DIRECT}/>);
export const Duration2 = () => (<FlightDuration startOfTripDate={startOfTripStr} endOfTripDate={endOfTripStr} carrierNames={['British airways','Swiss']} duration={'13h 30 min'} fdType={FDTYPES.DIRECT}/>);
