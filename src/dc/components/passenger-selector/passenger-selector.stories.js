import React from 'react';
import {
    action
} from '@storybook/addon-actions';
import PassengerSelector from "./passenger-selector";

export default {
    component: PassengerSelector,
    title: 'DC/Search form/Passenger Selector',
};
export const Default = () => (<PassengerSelector adults={1} children={1} infants={1} onAdultsChange={action('onAdultsChange')} onChildrenChange={action('onChildrenChange')} onInfantsChange={action('onInfantsChange')} placeholder='guest'/>);

export const NoInfant = () => (<PassengerSelector adults={1} children={1} infants={0} onAdultsChange={action('onAdultsChange')} onChildrenChange={action('onChildrenChange')} onInfantsChange={action('onInfantsChange')} placeholder='guest'/>);

export const OneAdult = () => (<PassengerSelector adults={1} children={0} infants={0} onAdultsChange={action('onAdultsChange')} onChildrenChange={action('onChildrenChange')} onInfantsChange={action('onInfantsChange')} placeholder='guest'/>);

export const MaxPassengers = () => (<PassengerSelector adults={9} children={0} infants={0} onAdultsChange={action('onAdultsChange')} onChildrenChange={action('onChildrenChange')} onInfantsChange={action('onInfantsChange')} placeholder='guest' maxPassengers={9}/>);

export const MaxMaxPassengers = () => (<PassengerSelector adults={9} children={10} infants={20} onAdultsChange={action('onAdultsChange')} onChildrenChange={action('onChildrenChange')} onInfantsChange={action('onInfantsChange')} placeholder='guest' maxPassengers={10}/>);

export const Minors = () => (<PassengerSelector adults={0} children={2} infants={2} onAdultsChange={action('onAdultsChange')} onChildrenChange={action('onChildrenChange')} onInfantsChange={action('onInfantsChange')} placeholder='guest' maxPassengers={10}/>);
