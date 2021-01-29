import React from 'react';
import {BookingFlowBreadcrumb, STEPS,} from "./breadcrumbs"

export default {
    title: 'common blocks/fulfilment breadcrumbs',
    component: BookingFlowBreadcrumb
};


export const HotelBookingFlow = () => (<BookingFlowBreadcrumb isHotelBooking={true} currentStepId={STEPS.SEAT_SELECTION}/> )
export const FlightBookingFlow = () => (<BookingFlowBreadcrumb isFlightBooking={true} currentStepId={STEPS.SEAT_SELECTION}/> )
export const FlightAndBookingBookingFlow = () => (<BookingFlowBreadcrumb isHotelBooking={true} isFlightBooking={true} currentStepId={STEPS.SEAT_SELECTION}/> )
