import React, {useState} from 'react';
import {useParams} from "react-router-dom";

import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "../components/payments/CheckoutForm";
import api from "../components/payments/api";
import { useCookies } from 'react-cookie';
import {Button} from "react-bootstrap";
import './payments.css'
const stripePromise = api.getPublicStripeKey().then(key => loadStripe(key));


export default function PaymentForm() {
    // const [selectedHotel, setSelectedHotel] = useState();
    const [cookies, setCookie] = useCookies();
    const { orderID } = useParams();
    function click(){
        console.log("Clicked")
        setCookie('name', 'newName', { path: '/' });
    }
    return (
        <div className="App">
            <div className="sr-root">
                <div className="sr-main">
                    <header className="sr-header">
                        <div className="sr-header__logo" />
                        OrderID:{orderID}
                    </header>
                    <Elements stripe={stripePromise}>
                        <CheckoutForm orderID={orderID}/>
                    </Elements>
                </div>
            </div>
        </div>

    )
}

