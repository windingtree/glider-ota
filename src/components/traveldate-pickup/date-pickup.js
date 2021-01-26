import styled from 'styled-components';
import { v4 as uuid } from 'uuid';
import moment from 'moment';
import React, {useState} from 'react';
import style from './date-pickup.module.scss';

import 'react-dates/initialize';
import { SingleDatePicker } from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';
import {venueConfig} from "../venue-context/theme-context";
import {UnicornVenueBadge} from "../search-form/unicorn-venue-badge";

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
    displayVenueBadge =  false,
    localstorageKey
}) {
    const [startDate, setDate] = useState(initialDate);
    const [focusedInput, setFocusedInput] = useState(null);
    const [showVenueBadge, setShowVenueBadge] = useState(venueConfig.active && displayVenueBadge);

    const onChange = _date => {
        const date = _date ? _date.toDate() : null;
        setDate(date);
        onDateChanged(date);
    };

    const onVenueBadgeClick = () =>{
        try {
            setDate(venueConfig.badgeStartDate);
            onDateChanged(moment(venueConfig.badgeStartDate).toDate());
            setShowVenueBadge(false);
        }catch(err){
            console.error('Failed to set venue start or end date',err)
        }
    }

    return (
        <>
            {label && <div className={style.label}>{label}</div>}
            <StyledWrapper className={style.datePickerWrapper}>
                <SingleDatePicker
                    displayFormat='MMM DD, ddd'
                    placeholder={placeholder}
                    titleText="Date"
                    date={(moment(startDate).isValid()) ? moment(startDate) : undefined}
                    onDateChange={onChange}
                    focused={focusedInput}
                    onFocusChange={({ focused }) => setFocusedInput(focused)}
                    id={uuid()}
                    customArrowIcon={<span>&#65372;</span>}
                    block
                    appendToBody={true}
                />
            </StyledWrapper>
            {showVenueBadge && <UnicornVenueBadge onBadgeClick={onVenueBadgeClick}/>}
        </>
    );
};
