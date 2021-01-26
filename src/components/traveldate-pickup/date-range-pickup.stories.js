import React from 'react';
import {
    action
} from '@storybook/addon-actions';
import DateRangePickup from "./date-range-pickup";

export default {
    component: DateRangePickup,
    title: 'Search form/date range pickup',
};

let today=new Date();
let nextWeek=new Date();
nextWeek.setTime(today.getTime()+7*24*60*60*1000)


export const DefaultNoInitialDatesProvided = () => (<DateRangePickup onEndDateChanged={action("onEndDateChanged")} onStartDateChanged={action("onStartDateChanged")} />);
export const WithInitialStartDateProvided = () => (<DateRangePickup initialStart={today} onEndDateChanged={action("onEndDateChanged")} onStartDateChanged={action("onStartDateChanged")}/>);
export const WithInitialEndDateProvided = () => (<DateRangePickup initialEnd={nextWeek} onEndDateChanged={action("onEndDateChanged")} onStartDateChanged={action("onStartDateChanged")}/>);
export const WithBothInitialDatesProvided = () => (<DateRangePickup initialStart={today} initialEnd={nextWeek} onEndDateChanged={action("onEndDateChanged")} onStartDateChanged={action("onStartDateChanged")}/>);
export const WithLabel = () => (<DateRangePickup onEndDateChanged={action("onEndDateChanged")} onStartDateChanged={action("onStartDateChanged")} label={'Travel date label'}/>);
