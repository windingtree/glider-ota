import React from 'react';
import {
    action
} from '@storybook/addon-actions';
import PassengerSelector from "./passenger-selector";

export default {
    component: PassengerSelector,
    title: 'Search form/Passenger Selector',
};
export const Default = () => (<PassengerSelector adults={1} childrn={1} infants={1} onAdultsChange={action('onAdultsChange')} onChildrenChange={action('onChildrenChange')} onInfantsChange={action('onInfantsChange')} placeholder='guest'/>);
