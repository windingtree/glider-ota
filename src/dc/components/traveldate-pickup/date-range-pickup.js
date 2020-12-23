import { uuid } from 'uuidv4';
import moment from 'moment';
import React, {useEffect, useState} from 'react';
import style from './date-range-pickup.module.scss';
import {addDays} from "date-fns";

import 'react-dates/initialize';
import { DateRangePicker } from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';

export default function DateRangePickup({
    initialStart,
    initialEnd,
    onStartDateChanged,
    onEndDateChanged,
    startPlaceholder = 'Departure',
    endPlaceholder = 'Return',
    label,
    localstorageKey
}) {
    const [startDate, setStartDate] = useState(initialStart);
    const [endDate, setEndDate] = useState(initialEnd);
    const [focusedInput, setFocusedInput] = useState(null);

    const onChange = dates => {
        const start = (dates.startDate) ? dates.startDate.format() : null
        const end = (dates.endDate) ? dates.endDate.format() : null

        setStartDate(start);
        onStartDateChanged(start);

        if (start && !end) {
            setEndDate(addDays(start, 1))
        } else {
            setEndDate(end);
            onEndDateChanged(end);
        }
    };

    useEffect(()=>{
        //if dates are pre-populated, we need to notify that it got changed so that validation can be checked to block/unblock search button
        if(initialStart && onStartDateChanged) {
            onStartDateChanged(initialStart)
        }
        if(initialEnd && onEndDateChanged){
            onEndDateChanged(initialEnd);
        }
    },[])

    return (
        <>
            {label && <div className={style.label}>{label}</div>}
            <DateRangePicker
                startDatePlaceholderText="Start date"
                endDatePlaceholderText="End date"
                startDateTitleText="Start"
                endDateTitleText="End"

                startDate={moment(startDate)}
                startDateId={uuid()}
                endDate={moment(endDate)}
                endDateId={uuid()}
                onDatesChange={onChange}

                focusedInput={focusedInput}
                onFocusChange={focusedInput => setFocusedInput(focusedInput)}
            />
        </>
    );
};
