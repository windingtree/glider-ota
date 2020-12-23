import { uuid } from 'uuidv4';
import moment from 'moment';
import React, {useState} from 'react';
import style from './date-pickup.module.scss';

import 'react-dates/initialize';
import { SingleDatePicker } from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';

export default function DatePickup({
    initialDate,
    onDateChanged,
    placeholder = 'Departure',
    label,
    localstorageKey
}) {
    const [startDate, setStartDate] = useState(initialDate);
    const [focusedInput, setFocusedInput] = useState(null);
    const onChange = _date => {
        const date = (_date) ? _date.format() : null

        setStartDate(date);
        if(onDateChanged) {
            onDateChanged(date);
        }else{
            console.warn('onDateChanged is not defined!')
        }
    };

    return (
        <>
            {label && <div className={style.label}>{label}</div>}
            <SingleDatePicker
                startDatePlaceholderText="Date"
                startDateTitleText="Date"

                date={moment(startDate)}
                onDateChange={onChange}
                focused={focusedInput}
                focusedInput={focusedInput}
                onFocusChange={focusedInput => setFocusedInput(focusedInput)}
                id={uuid()}
            />
        </>
    );
};
