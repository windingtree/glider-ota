import React from 'react';
import {
    action
} from '@storybook/addon-actions';
import TravelDatepickup from "./travel-datepickup";

export default {
    component: TravelDatepickup,
    title: 'Search form/Travel date pickup',
};

let today=new Date();
let nextWeek=new Date();
nextWeek.setTime(today.getTime()+7*24*60*60*1000)


export const DefaultNoInitialDatesProvided = () => (<TravelDatepickup onEndDateChanged={action("onEndDateChanged")} onStartDateChanged={action("onStartDateChanged")}/>);
export const WithInitialStartDateProvided = () => (<TravelDatepickup initialStart={today} onEndDateChanged={action("onEndDateChanged")} onStartDateChanged={action("onStartDateChanged")}/>);
export const WithInitialEndDateProvided = () => (<TravelDatepickup initialEnd={nextWeek} onEndDateChanged={action("onEndDateChanged")} onStartDateChanged={action("onStartDateChanged")}/>);
export const WithBothInitialDatesProvided = () => (<TravelDatepickup initialStart={today} initialEnd={nextWeek} onEndDateChanged={action("onEndDateChanged")} onStartDateChanged={action("onStartDateChanged")}/>);
