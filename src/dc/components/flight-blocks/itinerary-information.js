import React from 'react';
import style from "./itinerary-information.module.scss"
import {ArrivalDeparture,ADTYPES} from './arrival-departure'
import {FlightDuration,FDTYPES} from './flight-duration'


export const ItinerarySummary = ({itinerary}) => {
    let segments = (itinerary && itinerary.segments)?itinerary.segments:[];
    let firstSegment, lastSegment;
    if(!Array.isArray(segments) || segments.length === 0)
        return (<>Invalid flight data</>);

    firstSegment=segments[0];
    lastSegment=segments[segments.length-1];
    let {departureTime, origin: {iataCode:departureCityCode, city_name:departureCityName}} = firstSegment;
    let {arrivalTime, destination: {iataCode:arrivalCityCode, city_name:arrivalCityName}} = lastSegment;
    let carrierNames = segments.map(({operator})=>operator.airline_name);

    return (
        <>itinerary
            <ArrivalDeparture adType={ADTYPES.DEPARTURE} date={departureTime} cityCode={departureCityCode} cityName={departureCityName}/>
            <FlightDuration startOfTripDate={departureTime} endOfTripDate={arrivalTime} fdType={segments.length>1?FDTYPES.CONNECTING:FDTYPES.DIRECT} carrierNames={carrierNames}/>
            <ArrivalDeparture adType={ADTYPES.ARRIVAL} date={arrivalTime} cityCode={arrivalCityCode} cityName={arrivalCityName}/>
        </>
    )
}


