import React, {useState} from 'react';
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "./checkout-form";
import api from "./api";
import {Button, Container, Row, Col} from "react-bootstrap";
const stripePromise = api.getPublicStripeKey().then(key => loadStripe(key));



export default function PaymentForm({orderID, onPaymentSuccess, onPaymentFailure}) {



    return (
                <Container>
                    <Row>
                        <Col className='sr-main'>
                        {/*OrderID:{orderID}*/}
                            <Elements stripe={stripePromise}>
                                <CheckoutForm onPaymentSuccess={onPaymentSuccess} onPaymentFailure={onPaymentFailure} orderID={orderID}/>
                            </Elements>
                        </Col>
                    </Row>
                </Container>

    )
}

