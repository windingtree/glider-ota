import React, {useState} from 'react';
import {useParams} from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "../components/payments/CheckoutForm";
import api from "../components/payments/api";
import { useCookies } from 'react-cookie';
import {Button, Container, Row, Col} from "react-bootstrap";
import './payments.css'
const stripePromise = api.getPublicStripeKey().then(key => loadStripe(key));

export default function PaymentForm() {
    // const [cookies, setCookie] = useCookies();
    const { orderID } = useParams();
    return (
                <Container>
                    <Row>
                        <Col className='sr-main'>
                        OrderID:{orderID}
                            <Elements stripe={stripePromise}>
                                <CheckoutForm orderID={orderID}/>
                            </Elements>
                        </Col>
                    </Row>
                </Container>

    )
}

