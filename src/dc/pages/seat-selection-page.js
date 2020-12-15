import React, {useState} from 'react';
import BookingFlowLayout from "../components/layout/booking-flow-layout"
import SeatSelectionContent from "../components/seat-selection/seat-selection-content"
import BookingFlowBreadcrumb, {STEPS} from "../components/common-blocks/breadcrumbs"


export default function DCSeatSelectionPage() {
    let breadcrumb = <BookingFlowBreadcrumb currentStepId={STEPS.SEAT_SELECTION}/>

    return (<BookingFlowLayout breadcrumb={breadcrumb}>
        <SeatSelectionContent/>
    </BookingFlowLayout>)
}


