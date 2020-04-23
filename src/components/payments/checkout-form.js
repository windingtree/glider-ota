import React, { useEffect, useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import "./checkout-form.css";
import api from "./api";
import {Button, Form} from "react-bootstrap";
import Spinner from "../../components/common/spinner"

export default function CheckoutForm({orderID, onPaymentSuccess, onPaymentFailure}) {
  const [amount, setAmount] = useState(0);
  const [currency, setCurrency] = useState("");
  const [clientSecret, setClientSecret] = useState(null);
  const [error, setError] = useState(null);
  const [metadata, setMetadata] = useState(null);
  const [succeeded, setSucceeded] = useState(false);
  const [processing, setProcessing] = useState(false);
  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    // Step 1: Fetch product details such as amount and currency from
    // API to make sure it can't be tampered with in the client.
  /*  api.getProductDetails().then(productDetails => {
      setAmount(productDetails.amount / 100);
      setCurrency(productDetails.currency);
    });*/

    // Step 2: Create PaymentIntent over Stripe API
    api
      .createPaymentIntent({
        type: "card",
        orderId:orderID
      })
      .then(data => {
        setClientSecret(data.client_secret);
        setAmount(data.amount);
        setCurrency(data.currency);
      })
      .catch(err => {
        setError(err.message);
      });
  }, []);

  const handleSubmit = async ev => {
    console.log("Submit")
    ev.preventDefault();
    setProcessing(true);

    // Step 3: Use clientSecret from PaymentIntent and the CardElement
    // to confirm payment with stripe.confirmCardPayment()
    const payload = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          name: ev.target.name.value
        }
      }
    });

    if (payload.error) {
      setError(`Payment failed: ${payload.error.message}`);
      setProcessing(false);
      if(onPaymentFailure)
        onPaymentFailure(payload)
      console.log("[error]", payload.error);
    } else {
      setError(null);
      setSucceeded(true);
      setProcessing(false);
      setMetadata(payload.paymentIntent);
      if(onPaymentSuccess)
        onPaymentSuccess(payload)
      console.log("[PaymentIntent]", payload.paymentIntent);
    }
  };

  const renderSuccess = () => {
    return (
      <div className="sr-field-success message">
        <h1>Your payment succeeded</h1>
        <pre className="sr-callout">
          <code>{JSON.stringify(metadata, null, 2)}</code>
        </pre>
      </div>
    );
  };

  const renderForm = () => {
    const CARD_OPTIONS = {
      iconStyle: 'solid',
      style: {
        base: {
          iconColor: '#7161D6',
          color: 'black',
          fontWeight: 500,
          fontFamily: 'sans-serif,Roboto, Open Sans, Segoe UI',
          fontSize: '16px',
          fontSmoothing: 'antialiased',
          ':-webkit-autofill': {color: '#fce883'}, '::placeholder': {color: '#87bbfd'},
        },
        invalid: {
          iconColor: '#ffc7ee',
          color: 'red',
        },
      },
    };

    return (
      <>
        <Form.Row>
          <div className='pb-3 min-width-330'>
            <Form.Label>Card owner</Form.Label>
            <Form.Control type="text" id="name" name="name" placeholder="Name" autoComplete="cardholder"/>
          </div>
        </Form.Row>
        <Form.Row>
          <div className='pb-3 min-width-330'>
            <Form.Label>Card details</Form.Label>
            <CardElement className="sr-input" options={CARD_OPTIONS}/>
          </div>
        </Form.Row>
        <Form.Row>
          <div className='pb-3'>
            {error && <div className="message sr-field-error">ERR {error}</div>}
            <Button variant="primary"  size="lg"  disabled={processing || !clientSecret || !stripe} onClick={handleSubmit}>
              {processing ? "Processing...." : "Pay with credit card"}
            </Button>
          </div>
        </Form.Row>
        Processing:{processing}<br/>
        clientSecret:{clientSecret}<br/>
        stripe:{processing}<br/>
        <Spinner enabled={processing===true}/>
      </>
    );
  };

  return (
    <>
        {succeeded ? renderSuccess() : renderForm()}
    </>
  );
}
