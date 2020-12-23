import styled from 'styled-components';
import { uuid } from 'uuidv4';
import moment from 'moment';
import React, {useState} from 'react';
import style from './date-pickup.module.scss';

import 'react-dates/initialize';
import { SingleDatePicker } from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';

const StyledWrapper = styled.div`
    .DateRangePickerInput {
        text-align: center;
    }
`;

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
        const date = (_date) ? _date.toDate() : null

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
            <StyledWrapper>
                <SingleDatePicker
                    startDatePlaceholderText="Date"
                    startDateTitleText="Date"

                    date={(moment(startDate).isValid()) ? moment(startDate) : undefined}
                    onDateChange={onChange}
                    focused={focusedInput}
                    focusedInput={focusedInput}
                    onFocusChange={focusedInput => setFocusedInput(focusedInput)}
                    id={uuid()}

                    customArrowIcon={<span>&#65372;</span>}
                    block
                />
            </StyledWrapper>
        </>
    );
};
