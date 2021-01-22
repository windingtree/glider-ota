import arrowIcon from '../../../assets/arrow-down.svg';
import style from "./flight-duration.module.scss";
import {differenceInHours, differenceInMinutes, parseISO} from "date-fns";
import React from 'react';

export const FDTYPES={
    DIRECT:'direct',
    CONNECTING:'connecting'
}


const formatFlightDuration = (startOfTripDate, endOfTripDate) => {
    let durationString = '';
    try {
        let startOfTrip = startOfTripDate;
        if(typeof startOfTripDate ==='string')
            startOfTrip=parseISO(startOfTripDate);

        let endOfTrip = endOfTripDate;
        if(typeof endOfTripDate ==='string')
            endOfTrip=parseISO(endOfTripDate);

        const hrs = differenceInHours(endOfTrip, startOfTrip);
        const mins = differenceInMinutes(endOfTrip, startOfTrip) - hrs * 60;

        if (hrs > 0) {
            durationString += hrs + 'h '
        }
        if (mins > 0) {
            durationString += mins + 'm'
        }

    }catch(err){
        console.log(`Duration cannot be calculated, got error, start:${startOfTripDate} end:${endOfTripDate}, err:${err}`)
    }
    return durationString
}

const getUniqueCarrierNames = (segments) => {
    let uniqCarrierNames = [];
    try {
        let nonUniqueCarrierNames = segments.map(({operator}) => operator.airline_name);
        uniqCarrierNames = new Set(nonUniqueCarrierNames);
        uniqCarrierNames = [...uniqCarrierNames]
    }catch(err){
        console.warn(`Cannot extract list of carriers from segments, err:${err}`);
    }
    return uniqCarrierNames;
}

const getStopoverAirports = (segments) => {
    let stopovers = [];
    try {
        let destinationAirports = segments.map(({destination}) => destination.iataCode);
        if(destinationAirports.length>1)
            stopovers=destinationAirports.splice(0,destinationAirports.length-1)
    }catch(err){
        console.warn(`Cannot extract list of stopovers, err:${err}`);
    }
    return stopovers;
}


/**
 * Render information about flight duration, type of flight (direct or connecting) and carriers
 * @param startOfTripDate
 * @param endOfTripDate
 * @param stopoverAirports
 * @returns {JSX.Element}
 * @constructor
 */
export const FlightDuration = ({startOfTripDate, endOfTripDate, segments = []}) => {
    let durationStr = formatFlightDuration(startOfTripDate, endOfTripDate);
    segments = segments || [];
    let stopoverAirports = getStopoverAirports(segments);
    let carriers = getUniqueCarrierNames(segments);

    let type = 'Direct';
    if(stopoverAirports.length>0)
        type = `${stopoverAirports.length} stop (${stopoverAirports.join(',')})`

    return (
        <div className={style.fdBox}>
            <div className={style.fdIcon}><img src={arrowIcon} alt='Connection'/></div>
            <div className={style.fdDetails}>
                <span className={style.fdDuration}>{durationStr}</span> <span className={style.fdConnectionInfo}>{type}</span> <span className={style.fdCarriers}>{carriers.join(', ')}</span>
            </div>
        </div>
    )
}


