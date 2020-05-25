import React, {useEffect, useState} from 'react';
import {Button, Container, Row, Col} from "react-bootstrap";
import Spinner from "../common/spinner";
import {getOrderStatus} from "../../utils/api-utils";

const CONFIRMATION_STATUS={
    INITIAL:'INITIAL',
    PENDING:'PENDING',
    SUCCESS:'SUCCESS',
    FAILURE:'FAILURE',
    TOOLONG:'TOOLONG',
    CANNOT_CONFIRM:'CANNOT_CONFIRM'
}

const MAX_CONFIRMATION_WAIT_TIME_MILLIS=60000;
const RETRY_TIMEOUT_MILLIS=5000;

export default function PaymentConfirmation({orderID}) {
    const [confirmation, setConfirmation] = useState(undefined);
    const [checkStatus, setCheckStatus] = useState(CONFIRMATION_STATUS.INITIAL);
    const [error, setError] = useState();
    const [timeoutRef,setTimeoutRef] = useState();
    const [firstCheck,setFirstCheck] = useState(new Date())

    function checkOrderStatus(orderIdentifier){
        setCheckStatus(CONFIRMATION_STATUS.PENDING)
        let now=Date.now();
        let diff=now-firstCheck;

        if(diff>MAX_CONFIRMATION_WAIT_TIME_MILLIS) {
            stopCheckingInFuture();
            setCheckStatus(CONFIRMATION_STATUS.TOOLONG);
            return;
        }
        getStatus(orderIdentifier)
    };

    function getStatus(orderIdentifier){
        let response = getOrderStatus(orderIdentifier);
        response
            .then(data => {
                processOrderStatus(data);
            })
            .catch(err=>{
                setError("Failure during check")
                setCheckStatus(CONFIRMATION_STATUS.FAILURE)
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
        let orderStatus = data.order_status;
        console.debug("processOrderStatus:", orderStatus);

        switch (orderStatus){
            case 'NEW':
                setCheckStatus(CONFIRMATION_STATUS.PENDING);
                checkStatusInFuture();
                break;
            case 'FULFILLED':
                setCheckStatus(CONFIRMATION_STATUS.SUCCESS);
                stopCheckingInFuture();
                setConfirmation(data.confirmation);
                break;
            case 'FAILED':
                setCheckStatus(CONFIRMATION_STATUS.FAILURE);
                stopCheckingInFuture();
                break;
            default:
                console.error("Unknown order status:",orderStatus)
        }
    }

    const retryCheck = ()=>{
        getStatus(orderID)
    }

    useEffect(() => {
        checkOrderStatus(orderID)
        }, []
    )


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
        let bookings = [];
        let etickets = [];
        try{
            console.debug("Confirmation data:",confirmation);
            console.debug("Confirmation data - travel docs:",confirmation.travelDocuments);
            bookings = confirmation.travelDocuments.bookings;
            etickets = confirmation.travelDocuments.etickets;
        }catch(err){
            console.error("Cant find travel documents in confirmation", confirmation)
        }

        let pnrs=[];
        bookings.map(pnrRef=>{
            pnrs.push(<>{pnrRef} </> )
        })

        let tickets=[];
        etickets.map(eticket=>{
            Object.keys(eticket).map(etkt=>{
                tickets.push(<>{etkt} </> )
            })

        })

        return (
            <div className='glider-font-h2-fg'>

                Your booking reference is <b>{pnrs}</b><br/>
                Your ticket number is <b>{tickets}</b><br/>
                <p>Your travel documents will be send by email.</p>
                <p>Thank you for using Glider OTA</p>
            </div>
        )
    }

    return (
        <Container >
            <Row >
                <Col className='pb-5'>
                    <h1>Booking confirmation </h1>
                </Col>
            </Row>
            <Row>
                <Col>
                {checkStatus === CONFIRMATION_STATUS.PENDING && renderPleaseWait()}
                {checkStatus === CONFIRMATION_STATUS.FAILURE && renderConfirmationFailed()}
                {checkStatus === CONFIRMATION_STATUS.SUCCESS && renderConfirmationSuccess()}
                {checkStatus === CONFIRMATION_STATUS.TOOLONG && renderRetry()}
                </Col>
            </Row>

            <Row>
                <Col >
                    <small>
                    {error}
                    </small>

                </Col>
            </Row>
        </Container>

                    )

}



