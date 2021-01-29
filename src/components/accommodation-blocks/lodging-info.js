import {IconHotelBed} from '../icons/icons';

import style from "./lodging-info.module.scss"
import React from 'react';
import {safeDateFormat} from '../../utils/offer-utils'

export const LodgingInfo = ({checkInDate, checkOutDate, cityName}) => {
    return (
        <div className={style.adBox}>
            <div className={style.adIcon}><IconHotelBed/></div>
            <div className={style.adDetails}>
                <div className={style.adDate}>
                    {checkInDate && safeDateFormat(checkInDate, 'dd MMM')}
                    {checkInDate && checkOutDate && ('-')}
                    {checkOutDate && safeDateFormat(checkOutDate, 'dd MMM')} </div>
                <div className={style.adCityName}>{cityName}</div>
            </div>
        </div>
    )
}

