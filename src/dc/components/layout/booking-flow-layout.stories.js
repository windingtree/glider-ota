import React from 'react';
import BookingFlowLayout from "./booking-flow-layout";
import DevConLayout from "./devcon-layout";

export default {
    component: BookingFlowLayout,
    title: 'DC/layout/booking flow layout'
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
