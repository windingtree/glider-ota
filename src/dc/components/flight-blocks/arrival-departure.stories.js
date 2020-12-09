import React from 'react';
import {
    action
} from '@storybook/addon-actions';

import {ArrivalDeparture, ADTYPES} from "./arrival-departure"
export default {
    title: 'DC/flight blocks/arrival and departure',
    component:ArrivalDeparture
};

let date = new Date();

export const Arrival = () => (<ArrivalDeparture cityCode={'LHR'} cityName={'London'} date={date} adType={ADTYPES.ARRIVAL}/>);
export const Departure = () => (<ArrivalDeparture cityCode={'LHR'} cityName={'London'} date={date} adType={ADTYPES.DEPARTURE}/>);
export const UnknownType = () => (<ArrivalDeparture cityCode={'LHR'} cityName={'London'} date={date} adType={ADTYPES.NONE}/>);
export const NonSpecifiedType = () => (<ArrivalDeparture cityCode={'LHR'} cityName={'London'} date={date}/>);
