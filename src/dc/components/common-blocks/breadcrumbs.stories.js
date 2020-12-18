import React from 'react';
import {BookingFlowBreadcrumb, STEPS,} from "./breadcrumbs"

export default {
    title: 'common blocks/fulfilment breadcrumbs',
    component: BookingFlowBreadcrumb
};

let items = ['Search','Traveller info','Flight details', 'Seat selection', 'Payment']


export const HotelBookingFlow = () => (<BookingFlowBreadcrumb isHotelBooking={true} currentStepId={STEPS.SEAT_SELECTION}/> )
export const FlightBookingFlow = () => (<BookingFlowBreadcrumb isFlightBooking={true} currentStepId={STEPS.SEAT_SELECTION}/> )
export const FlightAndBookingBookingFlow = () => (<BookingFlowBreadcrumb isHotelBooking={true} isFlightBooking={true} currentStepId={STEPS.SEAT_SELECTION}/> )
