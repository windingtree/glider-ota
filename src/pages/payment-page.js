import React, {useState,useEffect} from 'react';
import Header from '../components/common/header/header';
import {useHistory} from "react-router-dom";
import PaymentForm from "../components/payments/checkout-form";
import Footer from "../components/common/footer/footer";


export default function PaymentPage({match}) {
    let history = useHistory();
    let confirmedOfferId = match.params.confirmedOfferId;
    const firstPassenger = history.location.state.passengers && history.location.state.passengers[0];
    const cardholderName = firstPassenger && `${firstPassenger.civility} ${firstPassenger.firstName} ${firstPassenger.lastName}`;

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
                    <PaymentForm 
                        confirmedOfferId={confirmedOfferId}
                        onPaymentSuccess={onPaymentSuccess}
                        onPaymentFailure={onPaymentFailure}
                        cardholderName={cardholderName}
                    />
                </div>
                <Footer/>

            </div>
        </>
    )
}
