import React from 'react';
import {AirportLookup} from "./airport-lookup";
import fetchMock from 'fetch-mock';
import {airportLookupResultsNYC, apiCallError} from './components/mock.data'
import {
    action
} from '@storybook/addon-actions';

export default {
    component: AirportLookup,
    title: 'Search form/Lookup/Airport Lookup Field',
    excludeStories: /.*Data$/,
};

const initialLocation = {primary: "Pulkovo airport", secondary: "Russia", code: "LED"};
export const successfullLoad = () => {
    fetchMock.restore().get('path:/api/lookup/airportSearch2', airportLookupResultsNYC);
    return (<AirportLookup initialLocation={initialLocation}
                           onSelectedLocationChange={action('onSelectedLocationChange')}/>);
}
export const failureErrorResponse = () => {
    fetchMock.restore().get('/api/lookup/airportSearch*', apiCallError);
    return (<AirportLookup initialLocation={initialLocation}
                           onSelectedLocationChange={action('onSelectedLocationChange')}/>);
}
export const failure404 = () => {
    fetchMock.restore().get('/api/lookup/airportSearch*', 404);
    return (<AirportLookup initialLocation={initialLocation}
                           onSelectedLocationChange={action('onSelectedLocationChange')}/>);
}
