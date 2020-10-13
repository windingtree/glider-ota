import React from 'react';
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "./checkout-form";
import api from "./api";
import {Container, Row, Col} from "react-bootstrap";
const stripePromise = api.getPublicStripeKey().then(key => loadStripe(key));



export default function PaymentForm({match, onPaymentSuccess, onPaymentFailure, cardholderName}) {

    return (
        <Container>
            <Row>
                <Col className='sr-main'>
                    <Elements stripe={stripePromise}>
                        <CheckoutForm
                            onPaymentSuccess={onPaymentSuccess}
                            onPaymentFailure={onPaymentFailure}
                            orderID={orderID}
                            cardholderName={cardholderName}
                        />
                    </Elements>
                </Col>
            </Row>
        </Container>
    )
}

