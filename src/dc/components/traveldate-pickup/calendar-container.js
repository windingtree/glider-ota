import {CalendarContainer} from "react-datepicker";
import React from "react";
import style from "./calendar-container.module.scss"
import {Form} from "react-bootstrap";

export const CustomCalendarContainer = ({ className, children }) => {
    return (
        <div className={style.calendarContainer}>

            <CalendarContainer className={className}>
                <div className={style.roundTrip}> <Form.Check type={'checkbox'} label={'Round trip'}/></div>
                <div style={{ position: "relative",border:"1px solid red" }}>{children}</div>
            </CalendarContainer>
        </div>
    );
};
