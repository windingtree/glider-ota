import React, {useEffect, useState} from 'react';
import {Button, Container, Row, Col} from "react-bootstrap";
import Spinner from "../common/spinner";
import {getOrderStatus} from "../../../utils/api-utils";
import './payment-confirmation.scss';
import style from './payment-confirmation.module.scss';
import Alert from 'react-bootstrap/Alert';
import {
    DEFAULT_NETWORK
} from '../../../config/default';
import { strCenterEllipsis } from '../../../utils/strings';

import classNames from "classnames/bind";
let cx = classNames.bind(style);


const CONFIRMATION_STATUS={
    INITIAL:'INITIAL',
    PENDING:'PENDING',
    SUCCESS:'SUCCESS',
    FAILURE:'FAILURE',
    TIMEOUT:'TIMEOUT',
    CANNOT_CONFIRM:'CANNOT_CONFIRM',
    FULFILLED_PARTIALLY:'FULFILLED_PARTIALLY'
}

const MAX_CONFIRMATION_WAIT_TIME_MILLIS=1000;
const RETRY_TIMEOUT_MILLIS=5000;

const ACCOMMODATION_OFFER_KEY='ACCOMMODATION_OFFER';
const TRANSPORTATION_OFFER_KEY='TRANSPORTATION_OFFER';



const RenderBookingStatusMessage = ({variant = 'info', icon, pending = false, heading=undefined, children}) =>{
    let headerCN=cx({
        alertHeader:true,
        colorSuccess:variant === 'success',
        colorInfo:variant === 'info',
        colorDanger:variant === 'danger',
    })
    return (<>
        {/*{icon && <div className={`icon-status-${icon}`}/>}*/}
        {heading && <div className={headerCN}>{heading}</div>}
        <div className={style.alertBody}>{children}</div>
        {pending && <Spinner/>}
        </>)
}


// Render the Booking Status
const BookingStatus = ({subOrder, type}) => {
    const status = (subOrder && subOrder.order_status) ? subOrder.order_status : 'undefined';
    let iconStatus;
    let message;
    switch(status) {
        case 'NEW':
            iconStatus = 'pending';
            if(subOrder.payment_status !== 'PAID') {
                message = (
                    <RenderBookingStatusMessage icon={iconStatus} variant={'info'} pending={false}>
                        We will process your booking once the payment is confirmed
                    </RenderBookingStatusMessage>
                );
            }

            else {
                message = (
                    <RenderBookingStatusMessage icon={iconStatus} variant={'info'} pending={false}>
                        We are confirming your booking with the travel supplier.
                    </RenderBookingStatusMessage>
                );
            }

            break;
        case 'FULFILLED':
            iconStatus = 'success';
            if(
                subOrder.confirmation &&
                subOrder.confirmation.travelDocuments
            ) {
                const {bookings, etickets} = subOrder.confirmation.travelDocuments;
                message = (
                    <RenderBookingStatusMessage icon={iconStatus} heading={'Flights are booked successfully'} variant={'success'}>
                        Your booking reference{bookings.length > 1 ? 's are' : ' is'}: <b>{bookings.join(', ')}</b>
                        <br/>
                        {(etickets && etickets.length>0) && (<>Your e-ticket{bookings.length > 1 ? 's are' : ' is'}: <b>{(etickets).map(tkt => Object.keys(tkt)[0]).join(', ')}</b></>)}
                        <p/>
                        You should soon receive confirmation email
                    </RenderBookingStatusMessage>
                );
            }else if(
                subOrder.confirmation &&
                subOrder.confirmation.order &&
                subOrder.confirmation.order.reservationNumber
            ) {
                const reservationNumber = subOrder.confirmation.order.reservationNumber;
                message = (
                    <RenderBookingStatusMessage icon={iconStatus} variant={'success'} heading={'Hotel is booked successfully'}>
                        Your booking reference is: <b>{reservationNumber}</b>
                        <p/>
                        You should soon receive confirmation email
                    </RenderBookingStatusMessage>
                );
            }

            break;
        case 'FAILED':
            iconStatus = 'failed';
            message = (
                <RenderBookingStatusMessage icon={iconStatus} variant={'danger'} heading={'Booking failed'}>
                    This may be due to changed availability or increased price.
                    Please try again later.
                </RenderBookingStatusMessage>
            );
            break;
        default:
            iconStatus = 'undefined';
            message = (
                <>
                    <RenderBookingStatusMessage icon={iconStatus} variant={'info'}>
                        The status of your booking is being retrieved from the server
                    </RenderBookingStatusMessage>

                </>
            );
            break;
    }

    return (<>{message}</>
    );
};



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
            case 'FULFILLED_PARTIALLY':
                setCheckStatus(CONFIRMATION_STATUS.FULFILLED_PARTIALLY);
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
        <RenderBookingStatusMessage heading={'We cannot confirm your booking.'} pending={false} variant={'danger'}>
                We are sorry, we could not confirm your booking.<br/>
                Please see additional details below.
        </RenderBookingStatusMessage>
    );

    const ConfirmationPendingAlert = () => (
        <RenderBookingStatusMessage heading={'We are confirming your booking'} pending={true} variant={'info'}>
            Please wait while we confirm your booking.<br/>
            This can take a few minutes.
        </RenderBookingStatusMessage>
    );

    const ConfirmationTimeoutAlert = () => (
        <RenderBookingStatusMessage heading={'We could not yet fully confirm your booking'} pending={false} variant={'danger'}>
            We are sorry, your booking confirmation is taking longer than usual.<br/>
            Once your booking is created, you will receive an email with your confirmation.<br/>
            <Button
                onClick={retryCheck}
                variant='primary'>Refresh Status
            </Button>
        </RenderBookingStatusMessage>
    );

    const ConfirmationPartiallyFulfilledAlert = () => (
    <RenderBookingStatusMessage heading={'We could not confirm all requested services.'} pending={false} variant={'danger'}>
        We are sorry, we could only partially fulfill your booking but some elements could not be confirmed.<br/>
        Please contact our support to confirm the remaining elements of your booking.
    </RenderBookingStatusMessage>
    );

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
                    <RenderBookingStatusMessage icon={iconStatus} variant={'info'}>
                        We have not yet received confirmation of your payment
                    </RenderBookingStatusMessage>
                );
                break;
            case 'PAID':
                iconStatus = 'success';
                if (order.payment_details && !order.payment_details.tx) {
                    const {card, receipt, status} = order.payment_details;
                    message = (
                        <RenderBookingStatusMessage icon={iconStatus} variant={'success'} heading={'Payment completed'}>
                            Your {card.brand} card **{card.last4} is {status.type}. <a href={receipt.url} target='_blank' rel="noopener noreferrer">(Receipt)</a>
                        </RenderBookingStatusMessage>
                    );
                } else if (order.payment_details && order.payment_details.tx) {
                    const {
                        hash
                    } = order.payment_details.tx;
                    message = (
                            <RenderBookingStatusMessage icon={iconStatus} variant={'success'} heading={'Payment completed'}>
                            Payment made with crypto transaction:&nbsp;
                            <a
                                href={`https://${DEFAULT_NETWORK}.etherscan.io/tx/${hash}`}
                                target='_blanc'
                                rel="noreferrer noopener"
                            >{strCenterEllipsis(hash)}</a>
                            </RenderBookingStatusMessage>
                    );
                }
                break;
            case 'FAILED':
                iconStatus = 'failed';
                message = (
                    <RenderBookingStatusMessage icon={iconStatus} variant={'danger'}>
                        Your payment has been declined
                    </RenderBookingStatusMessage>
                );
                break;
            case 'CANCELLED':
                iconStatus = 'failed';
                message = (
                    <RenderBookingStatusMessage icon={iconStatus} variant={'danger'}>
                        Your payment was refunded
                    </RenderBookingStatusMessage>
                );
                break;
            default:
                iconStatus = 'undefined';
                message = (
                    <RenderBookingStatusMessage icon={iconStatus} variant={'info'} pending={true}>
                        The status of your payment is being retrieved from the server
                    </RenderBookingStatusMessage>
                );
                break;
        }

        return (
                <>{message}</>
        );
    };

    const displaySubOffersDetails = () => {
        let flightOrder;
        let hotelOrder;
        if (order) {
            const {subOffers} = order;
            if (subOffers) {
                flightOrder = subOffers[TRANSPORTATION_OFFER_KEY];
                hotelOrder = subOffers[ACCOMMODATION_OFFER_KEY];
            }
        }

        return (<>
            {flightOrder &&
            (<><div className={style.sectionHeader}>Flights</div>
                <div className={style.sectionBody}>
                    <BookingStatus subOrder={flightOrder} type={TRANSPORTATION_OFFER_KEY}/>
                </div></>)}
            {hotelOrder &&
            (<><div className={style.sectionHeader}>Hotel</div>
                <div className={style.sectionBody}>
                    <BookingStatus subOrder={hotelOrder} type={ACCOMMODATION_OFFER_KEY}/>
                </div></>)}
        </>)

    }

    let displaySubOfferStatus=true;
/*

   if(checkStatus === CONFIRMATION_STATUS.SUCCESS || checkStatus === CONFIRMATION_STATUS.FULFILLED_PARTIALLY){
        //only display sub offers statuses when booking is completed or partially fulfilled
        displaySubOfferStatus=true;
    }
*/

    return (<>
        {checkStatus === CONFIRMATION_STATUS.PENDING && ConfirmationPendingAlert()}
        {checkStatus === CONFIRMATION_STATUS.FAILURE && ConfirmationFailedAlert()}
        {/*{checkStatus === CONFIRMATION_STATUS.SUCCESS && ConfirmationSuccessAlert()}*/}
        {checkStatus === CONFIRMATION_STATUS.TIMEOUT && ConfirmationTimeoutAlert()}
        {checkStatus === CONFIRMATION_STATUS.FULFILLED_PARTIALLY && ConfirmationPartiallyFulfilledAlert()}


        <div className={style.sectionHeader}>Payment status</div>
        <div className={style.sectionBody}>{paymentStatus()}</div>
        {displaySubOfferStatus && displaySubOffersDetails()}

</>)


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
                {/*{checkStatus === CONFIRMATION_STATUS.SUCCESS && ConfirmationSuccessAlert()}*/}
                {checkStatus === CONFIRMATION_STATUS.TIMEOUT && ConfirmationTimeoutAlert()}
                {checkStatus === CONFIRMATION_STATUS.TIMEOUT && ConfirmationPartiallyFulfilledAlert()}
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
                    {/*{BookingStatus()}*/}
                    {/*{displaySubOffersStatus()}*/}
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



