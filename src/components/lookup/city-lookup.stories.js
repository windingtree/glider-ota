import React from 'react';
import {CityLookup} from "./city-lookup";
import fetchMock from 'fetch-mock';
import {cityLookupResultsLON, apiCallError} from './components/mock.data'
import {
    action
} from '@storybook/addon-actions';

export default {
    component: CityLookup,
    title: 'Search form/Lookup/City Lookup Field',
    excludeStories: /.*Data$/,
};

const initialLocation = {primary: "London", secondary: "United Kingdom", code: "GB"};

export const successfullLoad = () => {
    fetchMock.restore().get('path:/api/lookup/citySearch', cityLookupResultsLON);
    return (
        <CityLookup initialLocation={initialLocation} onSelectedLocationChange={action('onSelectedLocationChange')}/>);
}
export const failureErrorResponse = () => {
    fetchMock.restore().get('/api/lookup/citySearch*', apiCallError);
    return (
        <CityLookup initialLocation={initialLocation} onSelectedLocationChange={action('onSelectedLocationChange')}/>);
}
export const failure404 = () => {
    fetchMock.restore().get('/api/lookup/citySearch*', 404);
    return (
        <CityLookup initialLocation={initialLocation} onSelectedLocationChange={action('onSelectedLocationChange')}/>);
}
