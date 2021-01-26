import {CalendarContainer} from "react-datepicker";
import React from "react";
import style from "./calendar-container.module.scss"

export const CustomCalendarContainer = ({ className, children }) => {
    return (
        <div className={style.calendarContainer}>

            <CalendarContainer className={className}>
                {/*<div className={style.roundTrip}> <Form.Check type={'checkbox'} label={'Round trip'}/></div>*/}
                <div style={{ position: "relative"}}>{children}</div>
            </CalendarContainer>
        </div>
    );
};
