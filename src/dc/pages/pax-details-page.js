import React, {useState} from 'react';
import DevConLayout from "../components/layout/devcon-layout"
import FlightPassengersPage from "./flight-passengers-page"
export default function DCPaxDetailsPage() {
    return (<DevConLayout>
        Pax details
        <FlightPassengersPage/>
    </DevConLayout>)
}
