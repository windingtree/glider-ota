import React from 'react';
import {
    action
} from '@storybook/addon-actions';

import SinglePaxDetails from "./single-pax-details"

export default {
    component: SinglePaxDetails,
    title: 'SinglePaxDetails',
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

export const SinglePaxDefault = () => (<SinglePaxDetails onDataChange={action("onDataChange")}/>);
export const SingleAdult = () => (<SinglePaxDetails passengerId="PAX1" passengerType="ADT" onDataChange={action("onDataChange")}/>);
export const SingleChild = () => (<SinglePaxDetails passengerId="PAX1" passengerType="CHD" onDataChange={action("onDataChange")} />);
export const SingleInfant = () => (<SinglePaxDetails passengerId="PAX1" passengerType="INF" onDataChange={action("onDataChange")} />);
export const SingleAdultWithInitialData = () => (<SinglePaxDetails passengerId="PAX1" passengerType="ADT" onDataChange={action("onDataChange")} initial={initialData}/>);
