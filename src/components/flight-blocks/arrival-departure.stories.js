import React from 'react';

import {ADTYPES, ArrivalDeparture} from "./arrival-departure"

export default {
    title: 'flight blocks/arrival and departure',
    component:ArrivalDeparture
};

let date = new Date();

export const Arrival = () => (<ArrivalDeparture cityCode={'LHR'} cityName={'London'} date={date} adType={ADTYPES.ARRIVAL}/>);
export const Departure = () => (<ArrivalDeparture cityCode={'LHR'} cityName={'London'} date={date} adType={ADTYPES.DEPARTURE}/>);
export const UnknownType = () => (<ArrivalDeparture cityCode={'LHR'} cityName={'London'} date={date} adType={ADTYPES.NONE}/>);
export const NonSpecifiedType = () => (<ArrivalDeparture cityCode={'LHR'} cityName={'London'} date={date}/>);
