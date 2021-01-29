import styled from 'styled-components';
import { v4 as uuid } from 'uuid';
import moment from 'moment';
import React, {useEffect, useState} from 'react';
import style from './date-range-pickup.module.scss';
// import {addDays} from "date-fns";

import 'react-dates/initialize';
import { DateRangePicker } from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';

import {UnicornVenueBadge} from "../search-form/unicorn-venue-badge";
import {venueConfig} from "../venue-context/theme-context";

const StyledWrapper = styled.div`
    .DateRangePickerInput {
        text-align: center;
    }
`;

export default function DateRangePickup({
    initialStart,
    initialEnd,
    onStartDateChanged,
    onEndDateChanged,
    startPlaceholder = 'Departure',
    endPlaceholder = 'Return',
    label,
    localstorageKey,
    displayVenueBadge =  false,
    minimumNights = 1,
    destination
}) {
    const [startDate, setStartDate] = useState(initialStart);
    const [endDate, setEndDate] = useState(initialEnd);
    const [focusedInput, setFocusedInput] = useState(null);
    const showVenueBadge = (venueConfig.active && displayVenueBadge) &&
        (destination && (
            destination.primary === venueConfig.destinationAirport.primary ||
            destination.primary === venueConfig.destinationCity.primary
        )) &&
        !startDate && !endDate;

    const onChange = dates => {
        let start = dates.startDate ? moment(dates.startDate) : moment();
        let end = dates.endDate ? moment(dates.endDate) : moment();
        setStartDate(start.toDate());
        onStartDateChanged(start.toDate());

        if (start && end && end.isBefore(start)) {
            end = start;
        }

        if (minimumNights === 0 && (!end || start.isSame(end, 'day'))) {
            end = null;
            setEndDate(null);
        } else if (minimumNights > 0 && (!end || start.isSame(end, 'day'))) {
            end = end.add(1, 'day');
            setEndDate(end.toDate());
        } else {
            setEndDate(end.toDate());
        }

        onEndDateChanged(!end ? end : end.toDate());
    };

    const onVenueBadgeClick = () =>{
        try {
            setStartDate(venueConfig.badgeStartDate);
            onStartDateChanged(moment(venueConfig.badgeStartDate).toDate());
            setEndDate(venueConfig.badgeEndDate);
            onEndDateChanged(moment(venueConfig.badgeEndDate).toDate());
        }catch(err){
            console.error('Failed to set venue start or end date',err)
        }
    }

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
            <StyledWrapper className={style.datePickerWrapper}>
                <DateRangePicker
                    startDatePlaceholderText={startPlaceholder}
                    endDatePlaceholderText={endPlaceholder}
                    startDateTitleText="Start"
                    endDateTitleText="End"
                    startDate={(moment(startDate).isValid()) ? moment(startDate) : undefined}
                    startDateId={uuid()}
                    endDate={(moment(endDate).isValid()) ? moment(endDate) : undefined}
                    endDateId={uuid()}
                    onDatesChange={onChange}
                    minimumNights={minimumNights}
                    displayFormat='MMM DD, ddd'
                    focusedInput={focusedInput}
                    onFocusChange={focusedInput => setFocusedInput(focusedInput)}
                    customArrowIcon={<span>&#65372;</span>}
                    block
                    // appendToBody={true}
                    orientation={window.matchMedia("(max-width: 700px)").matches ? 'vertical' : 'horizontal'}
                />
            </StyledWrapper>
            {showVenueBadge && <UnicornVenueBadge onBadgeClick={onVenueBadgeClick}/>}
        </>
    );
};
