import React from 'react';
import {
    action
} from '@storybook/addon-actions';

import SinglePaxDetails from "./single-pax-details"

export default {
    component: SinglePaxDetails,
    title: 'Single pax form',
};

const bareMinimum={
    id:'PAX1',
    type:'ADT'
}

const child={
    id:'PAX1',
    type:'CHD'
}

const infant={
    id:'PAX1',
    type:'INF'
}

const initialData={
    firstName:'John',
    lastName:'Doe',
    birthDate:'',
    email:'john@doe.com',
    phone:'+1 234 567 890'
}

export const Default = () => (<SinglePaxDetails onDataChange={action("onDataChange")}/>);
export const adultExample = () => (<SinglePaxDetails passengerId="PAX1" passengerType="ADT" onDataChange={action("onDataChange")}/>);
export const childExample = () => (<SinglePaxDetails passengerId="PAX1" passengerType="CHD" onDataChange={action("onDataChange")} />);
export const infantExample = () => (<SinglePaxDetails passengerId="PAX1" passengerType="INF" onDataChange={action("onDataChange")} />);
export const withInitialData = () => (<SinglePaxDetails passengerId="PAX1" passengerType="ADT" onDataChange={action("onDataChange")} initial={initialData}/>);
