import React from 'react';
import {
    action
} from '@storybook/addon-actions';

import PaxSummary,{SinglePaxSummary} from "./pax-summary";

export default {
    component: SinglePaxSummary,
    title: 'Passenger/Passenger summary',
};

const adult_male = {
    id: "PAX1",
    type: "ADT",
    firstName: 'John',
    lastName: 'Doe',
    birthDate: '1978-02-13',
    email: 'john@doe.com',
    phone: '+1 234 567 8901',
    civility: 'MR'
};
const adult_female = {
    id: "PAX2",
    type: "ADT",
    firstName: 'Emma',
    lastName: 'Doe',
    birthDate: '1978-02-13',
    email: 'john@doe.com',
    phone: '+1 234 567 8901',
    civility: 'MRS'
};
const child=
    {
        id: "PAX3",
        type: "CHD",
        firstName: 'Anna',
        lastName: 'Smith',
        birthDate: '2016-01-02',
        email: 'anna@smith.com',
        phone: '+1 234 567 8901',
        civility: 'MRS'
    }
const inf=
    {
        id: "PAX4",
        type: "INF",
        firstName: 'Mick',
        lastName: 'Smith',
        birthDate: '2016-01-02',
        email: 'anna@smith.com',
        phone: '+1 234 567 8901',
        civility: 'MR'
    }

export const AdultMale = () => (<SinglePaxSummary passenger={adult_male} onEditClicked={action("onEditClicked")}/>);
export const AdultFemale = () => (<SinglePaxSummary passenger={adult_female} onEditClicked={action("onEditClicked")}/>);
export const Child = () => (<SinglePaxSummary passenger={child} onEditClicked={action("onEditClicked")}/>);
export const Infant = () => (<SinglePaxSummary passenger={inf} onEditClicked={action("onEditClicked")}/>);
export const AllPassengers = () => (<PaxSummary passengers={[adult_female,adult_male,child,inf]} onEditClicked={action("onEditClicked")}/>);

