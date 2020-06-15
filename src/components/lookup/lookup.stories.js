import React from 'react';
import {AirportLookup} from "./lookup";
import fetchMock from 'fetch-mock';
import {
    action
} from '@storybook/addon-actions';

export default {
    component: AirportLookup,
    title: 'Search form/Lookup/Airport Lookup Field',
    excludeStories: /.*Data$/,
};
const mockResultsSuccess = {"results":[{"city_name":"Yogyakarta","city_code":"JOG","country_code":"ID","airport_name":"New Yogyakarta Int.","airport_iata_code":"YIA","type":"AIRPORT","country_name":"Indonesia"},{"city_name":"New York","city_code":"NYC","country_code":"US","airport_name":"Newark Liberty Intl","airport_iata_code":"EWR","type":"AIRPORT","country_name":"United States"},{"city_name":"New York","city_code":"NYC","country_code":"US","airport_name":"John F Kennedy Intl","airport_iata_code":"JFK","type":"AIRPORT","country_name":"United States"},{"city_name":"New York","city_code":"NYC","country_code":"US","airport_name":"LaGuardia","airport_iata_code":"LGA","type":"AIRPORT","country_name":"United States"},{"city_name":"New York","city_code":"NYC","country_code":"US","airport_name":"Metropolitan Area","airport_iata_code":"NYC","type":"METROPOLITAN","country_name":"United States"},{"city_name":"New York","city_code":"NYC","country_code":"US","airport_name":"Skyports SPB","airport_iata_code":"NYS","type":"AIRPORT","country_name":"United States"},{"city_name":"New York","city_code":"NYC","country_code":"US","airport_name":"Stewart International","airport_iata_code":"SWF","type":"AIRPORT","country_name":"United States"}]};
const mockResultsError = {
    "http_status": 400,
    "error": "INVALID_INPUT",
    "description": "Invalid request parameter, searchquery=",
    "payload": {}
};
const initialLocation={primary:"Pulkovo airport",secondary:"Russia",code:"LED"};
export const Default = () => (<AirportLookup initialLocation={initialLocation} onSelectedLocationChange={action('onSelectedLocationChange')}/>);
export const successfullLoad = () => {
    fetchMock.restore().get('path:/api/lookup/airportSearch',mockResultsSuccess);
    return (<AirportLookup initialLocation={initialLocation} onSelectedLocationChange={action('onSelectedLocationChange')}/>);
}
export const failureErrorResponse = () => {
    fetchMock.restore().get('/api/lookup/airportSearch*',mockResultsError);
    return (<AirportLookup initialLocation={initialLocation} onSelectedLocationChange={action('onSelectedLocationChange')}/>);
}
export const failure404 = () => {
    fetchMock.restore().get('/api/lookup/airportSearch*',404);
    return (<AirportLookup initialLocation={initialLocation} onSelectedLocationChange={action('onSelectedLocationChange')}/>);
}
