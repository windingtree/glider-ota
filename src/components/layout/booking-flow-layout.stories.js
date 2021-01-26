import React from 'react';
import BookingFlowLayout from "./booking-flow-layout";

export default {
    component: BookingFlowLayout,
    title: 'layout/booking flow layout'
};

export const Default = () => {
    return (<BookingFlowLayout> test </BookingFlowLayout>);
}
export const WithBreadcrumbs = () => {
    return (<BookingFlowLayout breadcrumb={dummyBreadcrumbs()}> test </BookingFlowLayout>);
}
const dummyBreadcrumbs = () =>{
    return (
        <div>
            Shopping -> Passenger details -> Seat selection ->Payment
        </div>
    )
}
