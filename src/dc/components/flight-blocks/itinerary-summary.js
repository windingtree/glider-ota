import React from 'react';
import style from "./itinerary-summary.module.scss"
import {ArrivalDeparture,ADTYPES} from './arrival-departure'
import {FlightDuration} from './flight-duration'
import {ensureDateObj} from '../../../utils/offer-utils'


const isSameDayArrival = (depDate,arrDate) => {
    let sameDay=true;
    try{
        let dep = ensureDateObj(depDate);   //in case date is string - parse it first
        let arr = ensureDateObj(arrDate);   //in case date is string - parse it first
        sameDay = (dep.getDay() === arr.getDay());
        console.log(`isSameDayArrival ${dep.getDay()} ${arr.getDay()} sameday:${sameDay}`)
    }catch(err){
        console.log(`Cannot determine if departure&arrival on the same date, dep:${depDate}, arr:${arrDate}, error:${err}`);
    }
    return sameDay;
}

const DifferentDayArrival = () => {
    return (
        <div className={style.arrivalNextDayWarning}>Arrive on a different day</div>
    )
}

export const ItinerarySummary = ({itinerary}) => {
    let segments = (itinerary && itinerary.segments)?itinerary.segments:[];
    let firstSegment, lastSegment;
    if(!Array.isArray(segments) || segments.length === 0)
        return (<>Invalid flight data</>);

    firstSegment=segments[0];
    lastSegment=segments[segments.length-1];
    let {departureTime, origin: {iataCode:departureCityCode, city_name:departureCityName}} = firstSegment;
    let {arrivalTime, destination: {iataCode:arrivalCityCode, city_name:arrivalCityName}} = lastSegment;
    let sameDayArrival=isSameDayArrival(departureTime,arrivalTime);

    return (
        <>
            <ArrivalDeparture adType={ADTYPES.DEPARTURE} date={departureTime} cityCode={departureCityCode} cityName={departureCityName}/>
            <FlightDuration startOfTripDate={departureTime} endOfTripDate={arrivalTime} segments={segments}/>
            {!sameDayArrival && <DifferentDayArrival/>}
            <ArrivalDeparture adType={ADTYPES.ARRIVAL} date={arrivalTime} cityCode={arrivalCityCode} cityName={arrivalCityName}/>
        </>
    )
}


