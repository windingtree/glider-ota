import {IconHotelBed} from '../icons/icons';

import style from "./lodging-info.module.scss"
import React from 'react';
import {safeDateFormat} from '../../utils/offer-utils'
import {differenceInBusinessDays, parseISO} from "date-fns";
export const LodgingInfo = ({checkInDate, checkOutDate, cityName}) => {
    let numberOfNightsInHotel=0;
    if(checkInDate && checkOutDate){
        numberOfNightsInHotel=differenceInBusinessDays(parseISO(checkInDate), parseISO(checkOutDate))
    }

    return (
        <div className={style.adBox}>
            <div className={style.adIcon}><IconHotelBed/></div>
            <div className={style.adDetails}>
                <div className={style.adDate}>
                    {checkInDate && safeDateFormat(checkInDate, 'dd MMM')}
                    {checkInDate && checkOutDate && ('-')}
                    {checkOutDate && safeDateFormat(checkOutDate, 'dd MMM')} </div>
                <div className={style.adCityName}>{numberOfNightsInHotel>0?numberOfNightsInHotel:''} {cityName?' nights in '+cityName:''}</div>
            </div>
        </div>
    )
}

