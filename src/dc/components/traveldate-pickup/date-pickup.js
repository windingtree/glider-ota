import { uuid } from 'uuidv4';
import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {Form} from 'react-bootstrap';
import style from './date-pickup.module.scss';
import {format} from "date-fns";

import 'react-dates/initialize';
import { DatePicker } from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';

export default function DatePickup({initialDate,onDateChanged,placeholder = 'Departure',label,localstorageKey}) {
    const [startDate, setStartDate] = useState(initialDate);
    const [focusedInput, setFocusedInput] = useState(null);
    const onChange = date => {
        setStartDate(date);
        if(onDateChanged) {
            onDateChanged(date);
        }else{
            console.warn('onDateChanged is not defined!')
        }
    };

    const inputElem = (<CustomInput date={startDate} placeholderText="Select dates" />)

    return (
        <>
            {label && <div className={style.label}>{label}</div>}
            <DatePicker
                startDatePlaceholderText="Date"
                startDateTitleText="Date"

                startDate={moment(startDate)}
                startDateId={uuid()}
                onDatesChange={onChange}

                focusedInput={focusedInput}
                onFocusChange={focusedInput => setFocusedInput(focusedInput)}
            />
        </>
    );
};


const CustomInput = ({value, date, onClick, placeholderText}) => {
    let textToDisplay='1';
    if(date)
        textToDisplay = formatDate(date);

    return (
        <>
            <Form.Control
                type="text"
                placeholder={placeholderText}
                onFocus={onClick}
                value={textToDisplay}
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
