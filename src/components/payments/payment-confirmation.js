import React, {useEffect, useState} from 'react';
import {Button, Container, Row, Col} from "react-bootstrap";
import Spinner from "../common/spinner";
import {getOrderStatus} from "../../utils/api-utils";
import './payment-confirmation.scss';
import Alert from 'react-bootstrap/Alert';
import {
    DEFAULT_NETWORK
} from '../../config/default';
import { strCenterEllipsis } from '../../utils/strings';



const CONFIRMATION_STATUS={
    INITIAL:'INITIAL',
    PENDING:'PENDING',
    SUCCESS:'SUCCESS',
    FAILURE:'FAILURE',
    TIMEOUT:'TIMEOUT',
    CANNOT_CONFIRM:'CANNOT_CONFIRM'
}

const MAX_CONFIRMATION_WAIT_TIME_MILLIS=70000;
const RETRY_TIMEOUT_MILLIS=5000;

export default function PaymentConfirmation({orderID}) {
    const [checkStatus, setCheckStatus] = useState(CONFIRMATION_STATUS.INITIAL);
    const [error, setError] = useState();
    const [timeoutRef,setTimeoutRef] = useState();
    let firstCheck = new Date();
    const [order, setOrder] = useState();

    // Check the order status
    function checkOrderStatus(orderIdentifier) {
        setCheckStatus(CONFIRMATION_STATUS.PENDING);
        let now = new Date();

        // If timeout is exceeded, stop
        if((now - firstCheck) > MAX_CONFIRMATION_WAIT_TIME_MILLIS) {
            stopCheckingInFuture();
            setCheckStatus(CONFIRMATION_STATUS.TIMEOUT);
            return;
        }

        // Otherwise status is retrieved from server
        getStatus(orderIdentifier);
    };

    function getStatus(orderIdentifier){
        getOrderStatus(orderIdentifier)
            .then(data => {
                console.log(data)
                processOrderStatus(data);
            })
            .catch(err=>{
                setError("We can not retrieve the status, please refresh your browser to retry");
                setCheckStatus(CONFIRMATION_STATUS.FAILURE);
                //checkStatusInFuture();
            });
    }

    function checkStatusInFuture(){
        let ref=setTimeout(()=>checkOrderStatus(orderID), RETRY_TIMEOUT_MILLIS);
        setTimeoutRef(ref);
    }

    function stopCheckingInFuture(){
        try{
            clearTimeout(timeoutRef);
        }catch(err){

        }
    }

    function processOrderStatus(data){
        setOrder(data);
        let orderStatus = data.order_status;
        console.debug("processOrderStatus:", orderStatus);

        switch (orderStatus){
            case 'NEW':
            case 'FULFILLING':
                setCheckStatus(CONFIRMATION_STATUS.PENDING);
                checkStatusInFuture();
                break;
            case 'FULFILLED':
                setCheckStatus(CONFIRMATION_STATUS.SUCCESS);
                stopCheckingInFuture();
                break;
            case 'FAILED':
                setCheckStatus(CONFIRMATION_STATUS.FAILURE);
                stopCheckingInFuture();
                break;
            default:
                console.error("Unknown order status:",orderStatus);
                stopCheckingInFuture();//fail fast to avoid endless loop
        }
    }

    const retryCheck = ()=>{
        getStatus(orderID);
    }

    useEffect(() => {
        checkOrderStatus(orderID);
        }, [orderID]
    );


    const ConfirmationFailedAlert = () => (
        <Alert variant="danger">
            <Alert.Heading>We cannot confirm your booking.</Alert.Heading>
            <p>
                We are sorry, we could not confirm your booking.<br/>
                Please see additional details below.
            </p>
        </Alert>
    );

    const ConfirmationPendingAlert = () => (
        <>
            <Alert variant="info">
                <Alert.Heading>We are confirming your booking</Alert.Heading>
                <p>
                    Please wait while we confirm your booking.<br/>
                    This can take a few minutes.
                </p>
            </Alert>
            <Spinner/>
        </>
    );

    const ConfirmationTimeoutAlert = () => (
        <Alert variant="warning">
            <Alert.Heading>We could not yet confirm your booking</Alert.Heading>
            <p>
                We are sorry, your booking confirmation is taking longer than usual.<br/>
                Once your booking is created, you will receive an email with your confirmation.
            </p>
            <Button
                onClick={retryCheck}
                variant='primary'>Refresh Status
            </Button>
        </Alert>
    );

    const ConfirmationSuccessAlert = () => {
        const confirmation = order.confirmation;
        let bookings = [];

        // Get the bookings from travel document
        if(confirmation.travelDocuments &&
            Array.isArray(confirmation.travelDocuments.bookings))
        {
            bookings = confirmation.travelDocuments.bookings
        }

        // Add the bookings from the order (for Hotels)
        if(confirmation.order && confirmation.order.reservationNumber) {
            bookings.push(confirmation.order.reservationNumber);
        }

        return (
            <Alert variant="success">
                <Alert.Heading>Your booking confirmation number{bookings.length > 1 ? 's are' : ' is'} <b>{bookings.join(', ')}</b></Alert.Heading>
                <p>
                    Your booking has been created with the travel supplier.<br/>
                    You will receive your booking confirmation by email shortly!
                </p>
            </Alert>
        )
    };

    // Render the Payment Status
    const paymentStatus = () => {
        // Determine the status
        const status = (order && order.payment_status) ? order.payment_status : 'undefined';

        // Determine the icon
        let iconStatus;
        let message;
        switch(status) {
            case 'NOT_PAID':
                iconStatus = 'pending';
                message = (
                    <small>
                        We have not yet received confirmation of your payment
                    </small>
                );
                break;
            case 'PAID':
                iconStatus = 'success';
                if (order.payment_details && !order.payment_details.tx) {
                    const {card, receipt, status} = order.payment_details;
                    message = (
                        <small>
                            Your {card.brand} card **{card.last4} is {status.type}. <a href={receipt.url} target='_blank' rel="noopener noreferrer">(Receipt)</a>
                        </small>
                    );
                } else if (order.payment_details && order.payment_details.tx) {
                    const {
                        hash
                    } = order.payment_details.tx;
                    message = (
                        <small>
                            Payment made with crypto transaction:&nbsp;
                            <a
                                href={`https://${DEFAULT_NETWORK}.etherscan.io/tx/${hash}`}
                                target='_blanc'
                                rel="noreferrer noopener"
                            >{strCenterEllipsis(hash)}</a>
                        </small>
                    );
                }
                break;
            case 'FAILED':
                iconStatus = 'failed';
                message = (
                    <small>
                        Your payment has been declined
                    </small>
                );
                break;
            case 'CANCELLED':
                iconStatus = 'failed';
                message = (
                    <small>
                        Your payment was refunded
                    </small>
                );
                break;
            default:
                iconStatus = 'undefined';
                message = (
                    <small>
                        The status of your payment is being retrieved from the server
                    </small>
                );
                break;
        }

        return (
            <div className='col-status'>
                <div className={`icon-status-${iconStatus}`} aria-label={status}/>
                <div className='message-status'>{message}</div>
            </div>
        );
    };

    // Render the Booking Status
    const bookingStatus = () => {
        const status = (order && order.order_status) ? order.order_status : 'undefined';
        let iconStatus;
        let message;
        switch(status) {
            case 'NEW':
                iconStatus = 'pending';
                if(order.payment_status !== 'PAID') {
                    message = (
                        <small>
                            We will process your booking once the payment is confirmed
                        </small>
                    );
                }

                else {
                    message = (
                        <small>
                            We are confirming your booking with the travel supplier.
                        </small>
                    );
                }

                break;
            case 'FULFILLED':
                iconStatus = 'success';
                if(
                    order.confirmation &&
                    order.confirmation.travelDocuments
                ) {
                    const {bookings, etickets} = order.confirmation.travelDocuments;
                    message = (
                        <small>
                            Your booking reference{bookings.length > 1 ? 's are' : ' is'}: {bookings.join(', ')}
                            <br/>
                            {(etickets && etickets.length>0) && (<>Your e-ticket{bookings.length > 1 ? 's are' : ' is'}: {(etickets).map(tkt => Object.keys(tkt)[0]).join(', ')}</>)}
                        </small>
                    );
                }else if(
                    order.confirmation &&
                    order.confirmation.order &&
                    order.confirmation.order.reservationNumber
                ) {
                    const reservationNumber = order.confirmation.order.reservationNumber;
                    message = (
                        <small>
                            Your booking reference is: {reservationNumber}
                        </small>
                    );
                }

                break;
            case 'FAILED':
                iconStatus = 'failed';
                message = (
                    <small>
                        We could not create your booking due to an error.
                        This may be due to changed availability or increased price.
                        Please try again later.
                    </small>
                );
                break;
            default:
                iconStatus = 'undefined';
                message = (
                    <small>
                        The status of your booking is being retrieved from the server
                    </small>
                );
                break;
        }

        return (
            <div className='col-status'>
                <div className={`icon-status-${iconStatus}`} aria-label={status}/>
                <div className='message-status'>{message}</div>
            </div>
        );
    };

    return (
        <Container >
            <Row >
                <Col className='pb-5'>
                    <h1>Booking confirmation </h1>
                </Col>
            </Row>
            <Row>
                <Col>
                {checkStatus === CONFIRMATION_STATUS.PENDING && ConfirmationPendingAlert()}
                {checkStatus === CONFIRMATION_STATUS.FAILURE && ConfirmationFailedAlert()}
                {checkStatus === CONFIRMATION_STATUS.SUCCESS && ConfirmationSuccessAlert()}
                {checkStatus === CONFIRMATION_STATUS.TIMEOUT && ConfirmationTimeoutAlert()}
                </Col>
            </Row>
            <Row>
                <Col xs={12} md={3} className='col-category'>
                    <span>Payment</span>
                </Col>
                <Col xs={12} md={9}>
                    {paymentStatus()}
                </Col>
            </Row>
            <Row>
                <Col xs={12} md={3} className='col-category'>
                    <span>Booking</span>
                </Col>
                <Col xs={12} md={9}>
                    {bookingStatus()}
                </Col>
            </Row>
            <Row>
                <Col >
                    <small>
                    {error}
                    </small>
                </Col>
            </Row>
            <Row>
                <Col className='col-thankyou'>
                    <div className='glider-font-h2-fg'>
                        <p>{checkStatus === CONFIRMATION_STATUS.SUCCESS && "Thank you for using Glider !"}</p>
                    </div>
                </Col>
            </Row>
        </Container>

    );

}



