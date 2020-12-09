import { FaPlaneDeparture, FaPlaneArrival,FaLongArrowAltDown } from "react-icons/fa";
import style from "./flight-info-components.module.scss";
import {differenceInHours, differenceInMinutes, format, parseISO} from "date-fns";
import {Row, Col, Container} from "react-bootstrap";
import React from "react";

export const ADTYPES={
    ARRIVAL:'arrival',
    DEPARTURE:'departure',
    NONE:'none'
}
export const ArrivalDeparture = ({cityName, cityCode, date, adType=ADTYPES.NONE}) => {

    const renderIcon = () => {
        if(adType === ADTYPES.ARRIVAL)
            return (<FaPlaneArrival/>)
        if(adType === ADTYPES.DEPARTURE)
            return (<FaPlaneDeparture/>)
        return (<></>)
    }

    return (
        <div className={style.adBox}>
            <div className={style.adIcon}>{renderIcon()}</div>
            <div className={style.adDetails}>
                <div className={style.adDate}>{format(date, 'dd MMM, EE')}</div>
                <div><span className={style.adTime}>{format(date, 'HH:mm')}</span> <span className={style.adCityName}>{cityName},</span> <span className={style.adCityCode}>{cityCode}</span></div>
            </div>
        </div>
    )
}


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

export const FlightDuration = ({startOfTripDate, endOfTripDate, fdType = FDTYPES.DIRECT, carrierNames=[]}) => {
    let durationStr = formatFlightDuration(startOfTripDate, endOfTripDate);

    return (
        <div className={style.fdBox}>
            <div className={style.fdIcon}><FaLongArrowAltDown/></div>
            <div className={style.fdDetails}>
                <span className={style.fdDuration}>{durationStr}</span> <span className={style.fdType}>Direct</span> <span className={style.fdCarriers}>British Airways</span>
            </div>
        </div>
    )
}


