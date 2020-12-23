import { uuid } from 'uuidv4';
import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {Form} from 'react-bootstrap';
import style from './date-range-pickup.module.scss';
import {format, addDays} from "date-fns";

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
        const [start, end] = dates;

        setStartDate(start);
        onStartDateChanged(start);

        if (start && !end) {
            setEndDate(addDays(start, 1))
        } else {
            setEndDate(end);
            onEndDateChanged(end);
        }
    };

    const inputElem = (<CustomInput endDate={endDate} startDate={startDate} placeholderText="Select dates"/>)

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


const CustomInput = ({value, onClick, startDate, endDate, placeholderText}) => {
    let dates = [];
    if(startDate)
        dates.push(formatDate(startDate));
    if(endDate)
        dates.push(formatDate(endDate));

    let textToDisplay='';
    if(dates.length === 2)
        textToDisplay=dates.join(' | ');
    else
        textToDisplay=dates[0];

    const onChangeHandler = () => {
        console.log('Change')
    }

    return (
        <>
            <Form.Control
                type="text"
                placeholder={placeholderText}
                onFocus={onClick}
                value={textToDisplay} onChange={onChangeHandler}
                className={style.inputField}
            />
        </>
    )
};

const formatDate = (date) => {
    if(!date)
        return '';
    try{
        return format(date, 'MMM dd, EEE');
    }catch(err){
        console.warn(`Cannot format date in travel date picker, date: ${date}, error:${err}`);
    }
    return '';
}
