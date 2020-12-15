import React from 'react';
import {Breadcrumbs,BookingFlowBreadcrumb, STEPS} from "./breadcrumbs"

export default {
    title: 'DC/common blocks/fulfilment breadcrumbs',
    component: BookingFlowBreadcrumb
};

let items = ['Search','Traveller info','Flight details', 'Seat selection', 'Payment']
/*

export const GenericDefault = () => (<Breadcrumbs/> )
export const GenericWithoutActive = () => (<Breadcrumbs items={items}/> )
export const GenericWithActive = () => (<Breadcrumbs items={items} currentItemIndex={2}/> )
*/


export const GenericBookingFlow = () => (<BookingFlowBreadcrumb  currentStepId={STEPS.PAYMENT}/> )
export const HotelBookingFlow = () => (<BookingFlowBreadcrumb hotelOffer={{}} currentStepId={STEPS.PAYMENT}/> )
export const FlightBookingFlow = () => (<BookingFlowBreadcrumb flightOffer={{}} currentStepId={STEPS.PAYMENT}/> )
export const FlightAndBookingBookingFlow = () => (<BookingFlowBreadcrumb hotelOffer={{}} flightOffer={{}} currentStepId={STEPS.PAYMENT}/> )
