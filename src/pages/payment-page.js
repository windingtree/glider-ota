import React, {useState,useEffect} from 'react';
import Header from '../components/common/header/header';
import {useHistory} from "react-router-dom";
import PaymentForm from "../components/payments/checkout-form";


export default function PaymentPage({match}) {
    let history = useHistory();
    let confirmedOfferId = match.params.confirmedOfferId;

    function onPaymentSuccess(){
        console.log("Successful payment")
        let url='/confirmation/'+confirmedOfferId;
        history.push(url);
    }
    function onPaymentFailure(){
        console.log("Failed payment")
    }

    useEffect(()=>{

    },[])

    return (
        <>
            <div>
                <Header violet={true}/>
                <div className='root-container-subpages'>
                    <PaymentForm confirmedOfferId={confirmedOfferId} onPaymentSuccess={onPaymentSuccess} onPaymentFailure={onPaymentFailure}/>
                </div>
            </div>
        </>
    )
}
