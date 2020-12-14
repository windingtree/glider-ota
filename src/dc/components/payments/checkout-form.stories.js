import React from 'react';
import {
    action
} from '@storybook/addon-actions';
import PaymentForm from "./checkout-form";
import fetchMock from 'fetch-mock';

export default {
    component: PaymentForm,
    title: 'DC/Payments/Payment form',
};

const publicKeyMockedResponse={
    "publicKey": "pk_test_GRdI4fzbHKvry7GynyHMmJqi002bHvDY93"
}

const checkoutMockedResponse={
    "client_secret": "pi_1GlFafEGSIFX7DYMdwveX0uN_secret_tA9GHGOtpZAyB74LoOdjlBgIr",
    "amount": 2212.29,
    "currency": "cad"
}
export const paymentForm = () => {
    fetchMock.restore();
    fetchMock.mock('path:/api/order/key',publicKeyMockedResponse).mock('path:/api/order/checkout',checkoutMockedResponse);
    return (<PaymentForm orderID={"XYZ"} onPaymentFailure={action("onPaymentFailure")} onPaymentSuccess={action("onPaymentSuccess")}/>);
}


