import React from 'react';
import PaymentConfirmation from "../components/payments/payment-confirmation";
import {BookingFlowBreadcrumb, STEPS} from "./booking-flow-breadcrumb";
import BookingFlowLayout from "../components/layout/booking-flow-layout";


export default function ConfirmationPage({match}) {
    let confirmedOfferId = match.params.confirmedOfferId;
    let breadcrumb = <BookingFlowBreadcrumb currentStepId={STEPS.PAYMENT}/>

    return (
        <BookingFlowLayout breadcrumb={breadcrumb}>
                    <PaymentConfirmation orderID={confirmedOfferId}/>
        </BookingFlowLayout>
    )
}



