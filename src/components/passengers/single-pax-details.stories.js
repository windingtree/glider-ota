import React from 'react';
import {
    action
} from '@storybook/addon-actions';

import SinglePaxDetails from "./single-pax-details"

export default {
    component: SinglePaxDetails,
    title: 'Passenger/SinglePaxDetails',
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
    birthdate:'1978-02-20',
    email:'john@doe.com',
    phone:'+1 234 567 8901',
    civility:'MR'
}

const initialDataFemale={
    firstName:'Anna',
    lastName:'Doe',
    birthdate:'1978-02-20',
    email:'john@doe.com',
    phone:'+1 234 567 8901',
    civility:'MRS'
}

export const SinglePaxDefault = () => (<SinglePaxDetails onDataChange={action("onDataChange")}/>);
export const SingleAdult = () => (<SinglePaxDetails passengerId="PAX1" passengerType="ADT" onDataChange={action("onDataChange")}/>);
export const SingleChild = () => (<SinglePaxDetails passengerId="PAX1" passengerType="CHD" onDataChange={action("onDataChange")} />);
export const SingleInfant = () => (<SinglePaxDetails passengerId="PAX1" passengerType="INF" onDataChange={action("onDataChange")} />);
export const SingleAdultMaleWithInitialData = () => (<SinglePaxDetails passengerId="PAX1" passengerType="ADT" onDataChange={action("onDataChange")} initial={initialData}/>);
export const SingleAdultFemaleWithInitialData = () => (<SinglePaxDetails passengerId="PAX1" passengerType="ADT" onDataChange={action("onDataChange")} initial={initialDataFemale}/>);
export const FilledWithSubmitButton = () => (<SinglePaxDetails passengerId="PAX1" passengerType="ADT" onDataChange={action("onDataChange")} initial={initialData} showSubmitButton={true}/>);
export const EmptyWithSubmitButton = () => (<SinglePaxDetails onDataChange={action("onDataChange")} showSubmitButton={true} onSubmit={(data)=>console.log('Form submit>>', data)}/>);
