import React from 'react';
import {
    action
} from '@storybook/addon-actions';
import DatePickup from "./date-pickup";

export default {
    component: DatePickup,
    title: 'Search form/Date pickup',
};

let today=new Date();
let nextWeek=new Date();
nextWeek.setTime(today.getTime()+7*24*60*60*1000)


export const DefaultNoInitialDateProvided = () => (<DatePickup onDateChanged={action("onDateChanged")} />);
export const WithInitialDateProvided = () => (<DatePickup initialDate={today} onDateChanged={action("onDateChanged")}/>);
export const WithLabel = () => (<DatePickup onDateChanged={action("onDateChanged")} label={'Travel date'}/>);
