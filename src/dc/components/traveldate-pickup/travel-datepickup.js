import styled from 'styled-components';
import { uuid } from 'uuidv4';
import styled, { css } from 'styled-components';
import React, {useState} from 'react'
import style from './travel-datepickup.module.scss'

import 'react-dates/initialize';
import { DateRangePicker } from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';

const StyledWrapper = styled.div`
    .DateRangePickerInput {
        text-align: center;
    }
`;

export default function TravelDatepickup({
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
        setEndDate(end);
        onStartDateChanged(start);
        onEndDateChanged(end)
    };

    return (
        <>
            {label && <div className={style.label}>{label}</div>}
            <StyledWrapper>
                <DateRangePicker
                    startDatePlaceholderText="Start date"
                    endDatePlaceholderText="End date"
                    startDateTitleText="Start"
                    endDateTitleText="End"

                    startDate={(moment(startDate).isValid()) ? moment(startDate) : undefined}
                    startDateId={uuid()}
                    endDate={(moment(endDate).isValid()) ? moment(endDate) : undefined}
                    endDateId={uuid()}
                    onDatesChange={onChange}

                    focusedInput={focusedInput}
                    onFocusChange={focusedInput => setFocusedInput(focusedInput)}

                    customArrowIcon={<span>&#65372;</span>}
                    block
                />
            </StyledWrapper>
        </>
    );
};
