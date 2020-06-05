import React from 'react';
import {
    action
} from '@storybook/addon-actions';

import PaxDetails from "./pax-details";

export default {
    component: PaxDetails,
    title: 'Passenger/Passenger Details',
};

const no_initial_details = [{
    id: "PAX1",
    type: "ADT"
},
    {
        id: "PAX2",
        type: "CHD"
    }
];
const initial_details_preset = [{
    id: "PAX1",
    type: "ADT",
    firstName: 'John',
    lastName: 'Doe',
    birthDate: '',
    email: 'john@doe.com',
    phone: '+1 234 567 8901'
},
    {
        id: "PAX2",
        type: "CHD",
        firstName: 'Andrew',
        lastName: 'Doe',
        birthDate: '',
        email: 'john@doe.com',
        phone: '+1 234 567 8901'
    }
];


export const fullFormWithoutInitialData = () => (<PaxDetails passengers={no_initial_details} onDataChange={action("onDataChange")}/>);
export const fullFormWithInitialData = () => (<PaxDetails passengers={initial_details_preset} onDataChange={action("onDataChange")}/>);

