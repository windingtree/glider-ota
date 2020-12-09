import React from 'react';
import DCTravellerInfoPage from "./traveller-info-page";

import {
    action
} from '@storybook/addon-actions';

export default {
    component: DCTravellerInfoPage,
    title: 'DC/pages/booking step1',
    excludeStories: /.*Data$/,
};


let searchCriteriaPassengers = {
    "PAX1": {
        "type": "ADT"
    },
    "PAX2": {
        "type": "ADT"
    }
}

export const defaultPage = () => {
    return (<DCTravellerInfoPage searchCriteriaPassengers={searchCriteriaPassengers}/>);
}
