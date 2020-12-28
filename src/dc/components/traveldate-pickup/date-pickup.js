import styled from 'styled-components';
import { v4 as uuid } from 'uuid';
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
    onDateChanged = () => {},
    placeholder = 'Departure',
    label,
    localstorageKey
}) {
    const [startDate, setDate] = useState(initialDate);
    const [focusedInput, setFocusedInput] = useState(null);

    const onChange = _date => {
        const date = _date ? _date.toDate() : null;
        setDate(date);
        onDateChanged(date);
    };

    return (
        <>
            {label && <div className={style.label}>{label}</div>}
            <StyledWrapper className={style.datePickerWrapper}>
                <SingleDatePicker
                    placeholder={placeholder}
                    titleText="Date"

                    date={(moment(startDate).isValid()) ? moment(startDate) : undefined}
                    onDateChange={onChange}
                    focused={focusedInput}
                    onFocusChange={({ focused }) => setFocusedInput(focused)}
                    id={uuid()}

                    customArrowIcon={<span>&#65372;</span>}
                    block
                />
            </StyledWrapper>
        </>
    );
};
