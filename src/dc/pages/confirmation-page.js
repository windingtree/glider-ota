import React from 'react';
import PaymentConfirmation from "../components/payments/payment-confirmation";
import BookingFlowLayout from "../components/layout/booking-flow-layout";


export default function ConfirmationPage({match}) {
    let confirmedOfferId = match.params.confirmedOfferId;
    return (
        <BookingFlowLayout>
                    <PaymentConfirmation orderID={confirmedOfferId}/>
        </BookingFlowLayout>
    )
}



