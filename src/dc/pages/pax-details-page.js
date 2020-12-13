import React, {useState} from 'react';
import BookingFlowLayout from "../components/layout/booking-flow-layout"
import FlightPassengersPage from "../components/passengers/flight-passengers-page"


export default function DCPaxDetailsPage() {
    return (<BookingFlowLayout>
        Pax details
        <FlightPassengersPage/>
    </BookingFlowLayout>)
}


