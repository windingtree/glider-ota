import React, {useEffect, useState} from 'react';
import {Button, Container, Row, Col} from "react-bootstrap";
import Spinner from "../common/spinner";

const CONFIRMATION_STATUS={
    INITIAL:'INITIAL',
    PENDING:'PENDING',
    SUCCESS:'SUCCESS',
    FAILURE:'FAILURE',
    CANNOT_CONFIRM:'CANNOT_CONFIRM'
}

export default function PaymentConfirmation({orderID}) {
    const [confirmation, setConfirmation] = useState(undefined);
    const [checkStatus, setCheckStatus] = useState(CONFIRMATION_STATUS.INITIAL);
    const [error, setError] = useState();

    const checkOrderStatus = (orderIdentifier) => {
        setCheckStatus(CONFIRMATION_STATUS.PENDING)
        let request = {
            orderId: orderIdentifier,test:'test'
        }
        console.log("Checking oder status, orderId",orderIdentifier)
        let response = fetch(`/api/verifyPayment`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(request)
        })
            .then(res => {
                if (res.status === 200) {
                    return res.json();
                } else {
                    return null;
                }
            })
            .then(data => {
                console.log("Checking oder status, response",data)
                if (!data || data.error) {
                    console.log("API error:", {data});
                    setError("Failure during check")
                    setCheckStatus(CONFIRMATION_STATUS.FAILURE)
                } else {
                    setCheckStatus(CONFIRMATION_STATUS.SUCCESS)
                    setConfirmation(data)
                    return data;
                }
            });
    };

    const retryCheck = ()=>{
        checkOrderStatus(orderID)
    }

    useEffect(()=>{
        if(checkStatus !== CONFIRMATION_STATUS.INITIAL)
            return;
        setCheckStatus(CONFIRMATION_STATUS.PENDING);
        checkOrderStatus(orderID)})



    const renderRetry = () => {
        return (
            <div className='glider-font-text24medium-fg'>
                Confirmation takes too much time.
                Please retry by clicking below button
                <Button onClick={retryCheck} size='lg' variant='primary'>Retry</Button>
            </div>
        )
    }

    const renderPleaseWait = () => {
        return (
            <div className='glider-font-text24medium-fg'>
                Please wait while we are completing your travel documents
                <Spinner enabled={true}></Spinner>
            </div>

        )
    }

    const renderConfirmationFailed = () => {
        return (
            <div className='glider-font-h2-fg'>
                Unfortunately we cannot confirm your booking at the moment. <br/>
                Your travel documents will be send to you by email
            </div>
        )
    }

    const renderConfirmationSuccess = () => {
        console.log("Confirmation data:",confirmation);
        return (
            <div className='glider-font-h2-fg'>

                Your booking reference is <b>${confirmation!=undefined?confirmation.bookingReference:'unknown'}</b><br/>
                Your ticket number is <b>$${confirmation!=undefined?confirmation.ticketNbr:'unknown'}</b><br/>
                <p>Your travel documents will be send by email.</p>
                <p>Thank you for using Glider OTA</p>
            </div>
        )
    }

    return (
        <Container >
            <Row >
                <Col className='pb-5'>
                    <h1>Booking confirmation</h1>
                </Col>
            </Row>
            <Row>
                <Col>
                {checkStatus === CONFIRMATION_STATUS.PENDING && renderPleaseWait()}
                {checkStatus === CONFIRMATION_STATUS.FAILURE && renderConfirmationFailed()}
                {checkStatus === CONFIRMATION_STATUS.SUCCESS && renderConfirmationSuccess()}
                {checkStatus === CONFIRMATION_STATUS.PENDING && renderRetry()}
                </Col>
            </Row>

            <Row>
                <Col >
                    <small>
                    status:{checkStatus}
                    <br/>error:{error}
                    </small>

                </Col>
            </Row>
        </Container>

                    )

}



