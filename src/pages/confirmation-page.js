import React from 'react';
import PaymentConfirmation from "../components/payments/payment-confirmation";
import Header from "../components/common/header/header";
import Footer from "../components/common/footer/footer";
import BookingFlowBreadcrumb, {STEPS} from "../dc/components/common-blocks/breadcrumbs";
import BookingFlowLayout from "../dc/components/layout/booking-flow-layout";


export default function ConfirmationPage({match}) {
    let confirmedOfferId = match.params.confirmedOfferId;
    let breadcrumb = <BookingFlowBreadcrumb currentStepId={STEPS.PAYMENT}/>

    return (
        <BookingFlowLayout breadcrumb={breadcrumb}>
                <div className='root-container-subpages'>
                    <PaymentConfirmation orderID={confirmedOfferId}/>
                </div>
        </BookingFlowLayout>    )
}



