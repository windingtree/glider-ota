import React, {useState} from 'react'
import style from './travel-datepickup.module.scss'

import 'react-dates/initialize';
import { DateRangePicker } from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';

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
