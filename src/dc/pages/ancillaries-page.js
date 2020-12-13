import React, {useState} from 'react';
import BookingFlowLayout from "../components/layout/booking-flow-layout"
import AncillariesSelection from "../components/ancillaries/ancillaries-page"


export default function DCAncillariesPage() {
    return (<BookingFlowLayout>
        <AncillariesSelection/>
    </BookingFlowLayout>)
}


