import React from 'react';
import LookupField from "./lookup-field";
import {
    action
} from '@storybook/addon-actions';

export default {
    component: LookupField,
    title: 'LookupField',
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

export const Default = () => (<LookupField onLocationSelected={action('onLocationSelected')} onQueryEntered={action('onQueryEntered')}/>);
export const InitialLocationObjectProvided = () => (<LookupField initialLocation={initialLocation} onLocationSelected={action('onLocationSelected')} onQueryEntered={action('onQueryEntered')}/>);
export const InitialLocationStringProvided = () => (<LookupField initialLocation='London heathrow' onLocationSelected={action('onLocationSelected')} onQueryEntered={action('onQueryEntered')}/>);
export const PlaceholderProvided = () => (<LookupField onLocationSelected={action('onLocationSelected')} placeHolder='Destination' onQueryEntered={action('onQueryEntered')}/>);
export const InitialLocationAndPlaceholderProvided = () => (<LookupField initialLocation={initialLocation} onLocationSelected={action('onLocationSelected')} placeHolder='Destination' onQueryEntered={action('onQueryEntered')}/>);
export const withExpandedList = () => (<LookupField initialLocation={initialLocation} onLocationSelected={action('onLocationSelected')} placeHolder='Destination' onQueryEntered={action('onQueryEntered')} locations={airportsData}/>);
