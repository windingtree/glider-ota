import React from 'react';
import LookupField from "./lookup-field";
import {
    action
} from '@storybook/addon-actions';

export default {
    component: LookupField,
    title: 'Search form/Lookup/Generic Lookup Field',
    excludeStories: /.*Data$/,
};

export const airportsData = [
    {primary:"Pulkovo airport",secondary:"Russia",code:"LED"},
    {primary:"Phuket international airport",secondary:"Thailand",code:"HKT"},
    {primary:"Havana",secondary:"Cuba",code:"HAV"},
    {primary:"city without country",code:"HAV"},
    {primary:"city without cody",secondary:"Country"},
    {primary:"Very long primary name which should be truncated",secondary:"Very long secondary name which should be truncated",code:"HAV"},
    {primary:"Very long primary name which should be truncated without secondary"}];

const initialLocation={primary:"Pulkovo airport",secondary:"Russia",code:"LED"};

export const DefaultEmptyInputField = () => (<LookupField onLocationSelected={action('onLocationSelected')} onQueryEntered={action('onQueryEntered')}/>);
export const WithInitialLocationAsObject = () => (<LookupField initialLocation={initialLocation} onLocationSelected={action('onLocationSelected')} onQueryEntered={action('onQueryEntered')}/>);
export const WithInitialLocationAsString = () => (<LookupField initialLocation='London heathrow' onLocationSelected={action('onLocationSelected')} onQueryEntered={action('onQueryEntered')}/>);
export const InputFieldWithPlaceholder = () => (<LookupField onLocationSelected={action('onLocationSelected')} placeHolder='Destination' onQueryEntered={action('onQueryEntered')}/>);
export const WithInitialLocationAndPlaceholder = () => (<LookupField initialLocation={initialLocation} onLocationSelected={action('onLocationSelected')} placeHolder='Destination' onQueryEntered={action('onQueryEntered')}/>);
export const withExpandedList = () => (<LookupField initialLocation={initialLocation} onLocationSelected={action('onLocationSelected')} placeHolder='Destination' onQueryEntered={action('onQueryEntered')} locations={airportsData}/>);
