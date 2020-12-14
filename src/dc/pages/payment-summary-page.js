import React, {useState} from 'react';
import BookingFlowLayout from "../components/layout/booking-flow-layout"
import SummaryContent from "../components/payment/summary-content"
import {BookingFlowBreadcrumb, STEPS} from "./booking-flow-breadcrumb";


export default function DCPaymentSummaryPage() {
    let breadcrumb = <BookingFlowBreadcrumb currentStepId={STEPS.PAYMENT}/>
    return (<BookingFlowLayout breadcrumb={breadcrumb}>
        <SummaryContent/>
    </BookingFlowLayout>)
}


