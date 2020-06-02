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

export const NoInfant = () => (<PassengerSelector adults={1} childrn={1} infants={0} onAdultsChange={action('onAdultsChange')} onChildrenChange={action('onChildrenChange')} onInfantsChange={action('onInfantsChange')} placeholder='guest'/>);

export const OneAdult = () => (<PassengerSelector adults={1} childrn={0} infants={0} onAdultsChange={action('onAdultsChange')} onChildrenChange={action('onChildrenChange')} onInfantsChange={action('onInfantsChange')} placeholder='guest'/>);
