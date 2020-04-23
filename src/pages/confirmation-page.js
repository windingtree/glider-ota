import React, {useEffect, useState} from 'react';
import {Button, Container, Row, Col} from "react-bootstrap";
import PaymentConfirmation from "../components/payments/payment-confirmation";


export default function ConfirmationPage({match}) {
    let orderId = match.params.orderId;
    return (
        <Container fluid={true}>
            <Row>
                <PaymentConfirmation orderID={orderId}/>
            </Row>
        </Container>
    )
}



