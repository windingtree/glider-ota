import React, {useEffect} from 'react';
import {useHistory} from "react-router-dom";
import PaymentForm from "../components/payments/checkout-form";
import BookingFlowLayout from "../components/layout/booking-flow-layout";
import BookingFlowBreadcrumb, {STEPS} from "../components/common-blocks/breadcrumbs"


export default function PaymentPage({match}) {
    let history = useHistory();
    let confirmedOfferId = match.params.confirmedOfferId;
    const firstPassenger = history.location.state.passengers && history.location.state.passengers[0];
    const cardholderName = firstPassenger && `${firstPassenger.civility?firstPassenger.civility:''} ${firstPassenger.firstName} ${firstPassenger.lastName}`;

    function onPaymentSuccess(){
        let url='/confirmation/'+confirmedOfferId;
        history.push(url);
    }
    function onPaymentFailure(){
        console.log("Failed payment")
    }

    useEffect(()=>{

    },[])
    let breadcrumb = <BookingFlowBreadcrumb currentStepId={STEPS.PAYMENT}/>

    return (
            <BookingFlowLayout breadcrumb={breadcrumb}>
            <PaymentForm
                confirmedOfferId={confirmedOfferId}
                onPaymentSuccess={onPaymentSuccess}
                onPaymentFailure={onPaymentFailure}
                cardholderName={cardholderName}
            />
        </BookingFlowLayout>
    )
}
