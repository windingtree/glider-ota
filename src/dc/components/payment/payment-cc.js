import React from 'react';
import { useHistory } from 'react-router-dom';
import PaymentForm from "../payments/checkout-form";

export default props => {
    const history = useHistory();
    const {
        confirmedOfferId,
        passengers
    } = props;
    const firstPassenger = passengers && passengers[0];
    const cardholderName = firstPassenger && `${firstPassenger.civility?firstPassenger.civility:''} ${firstPassenger.firstName} ${firstPassenger.lastName}`;

    const onPaymentSuccess = () => {
        let url=`/dc/confirmation/${confirmedOfferId}`;
        history.push(url);
    }
    const onPaymentFailure = error => {
        console.log("Failed payment", error)
    }

    return (
        <PaymentForm
            confirmedOfferId={confirmedOfferId}
            onPaymentSuccess={onPaymentSuccess}
            onPaymentFailure={onPaymentFailure}
            cardholderName={cardholderName}
        />
    )
};
