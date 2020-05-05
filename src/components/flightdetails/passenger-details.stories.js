import React from 'react';
import {
    action
} from '@storybook/addon-actions';
import PassengersDetailsForm from "./passenger-details";

export default {
    component: PassengersDetailsForm,
    title: 'Passenger details form',
};

const sample_one_adult = {
    "passengers": {
        "PAX1": {
            "type": "ADT"
        }
    }}

const sample_adult_chld = {
    "passengers": {
        "PAX1": {
            "type": "ADT"
        },
        "PAX2": {
            "type": "CHD"
        }
    }}

export const Default = () => (<PassengersDetailsForm passengers={sample_one_adult}/>);
export const AdultAndChild = () => (<PassengersDetailsForm passengers={sample_adult_chld}/>);
