import React, {useEffect, useState} from "react";
import {CardElement, useStripe, useElements, Elements} from "@stripe/react-stripe-js";
import {Button, Col, Container, Form} from "react-bootstrap";
import Spinner from "../../components/common/spinner"
import {loadStripe} from "@stripe/stripe-js";
import {createPaymentIntent, getStripePublicKey} from "../../utils/api-utils";
import style from "./checkout-form.module.scss";


const stripePromise = getStripePublicKey().then(data => {
    let key = data.publicKey;
    //console.log("Stripe public key", key)
    // loadStripe(key);
    return loadStripe(key);
}).catch(err => {
    console.error("Cannot load stripe public key", err);
})


export default function PaymentForm({confirmedOfferId, onPaymentSuccess, onPaymentFailure, cardholderName}) {
    return (
        <Container>
            <Elements stripe={stripePromise}>
                <CheckoutForm
                    onPaymentSuccess={onPaymentSuccess}
                    onPaymentFailure={onPaymentFailure}
                    confirmedOfferId={confirmedOfferId}
                    cardholderName={cardholderName}
                />
            </Elements>
        </Container>
    )
}


export function CheckoutForm({confirmedOfferId, onPaymentSuccess, onPaymentFailure, cardholderName}) {
    const [amount, setAmount] = useState(0);
    const [currency, setCurrency] = useState("");
    const [clientSecret, setClientSecret] = useState(null);
    const [error, setError] = useState(null);
    const [metadata, setMetadata] = useState(null);
    const [succeeded, setSucceeded] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [cardholder, setCardholder] = useState(cardholderName);
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
        createPaymentIntent(confirmedOfferId, "card")
            .then(data => {
                setClientSecret(data.client_secret);
                setAmount(data.amount);
                setCurrency(data.currency.toUpperCase());
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
            setError(`${payload.error.message}`);
            setProcessing(false);
            if (onPaymentFailure)
                onPaymentFailure(payload)
            console.log("[error]", payload.error);
        } else {
            setError(null);
            setSucceeded(true);
            setProcessing(false);
            setMetadata(payload.paymentIntent);
            if (onPaymentSuccess)
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
                    color: '#495057',
                    fontWeight: 400,
                    fontSize: '16px',
                    fontFamily: 'Poppins, sans-serif',
                    fontSmoothing: 'antialiased',
                    ':-webkit-autofill': {color: '#fce883'}, '::placeholder': {color: '#6c757d'},
                    border: '1px solid #ced4da',
                    borderRadius: '0.25rem',
                },
                invalid: {
                    iconColor: '#ffc7ee',
                    color: 'red',
                },
            },
        };

        return (
            <>
                <Form validated={false}>
                    <Form.Row className={style.checkoutFormRow}>
                        <h2>Payment</h2>
                    </Form.Row>
                    <Form.Row className={style.checkoutFormRow}>
                        <Col>
                            <Form.Label className=''>Card holder</Form.Label>
                            <Form.Control
                                type="text"
                                id="name"
                                name="name"
                                placeholder="Name"
                                autoComplete="cardholder"
                                value={cardholder}
                                onChange={(event)=>setCardholder(event.target.value)}
                            />
                        </Col>
                    </Form.Row>
                    <Form.Row className={style.checkoutFormRow}>
                        <Col>
                            <Form.Label className=''>Card details</Form.Label>
                            <CardElement className="sr-input" options={CARD_OPTIONS}/>
                        </Col>
                    </Form.Row>
                    <div>
                        {error && <div className={style.errorMessage}>{error}</div>}
                    </div>
                    <Form.Row className={style.priceRow}>
                            {amount !== 0 && <h2>Total Price {currency} {amount}</h2>}
                            <Button
                                variant="primary"
                                size="lg"
                                disabled={processing || !clientSecret || !stripe}
                                onClick={handleSubmit}>
                                {processing ? "Processing...." : "Pay with Card"}
                            </Button>
                    </Form.Row>
                    <Form.Row>
                        <small className={style.disclaimer}>
                            Your payment is made to Simard OÜ, the legal entity powering Glider.
                            We are partnering with Stripe to securely encrypt and process your card details.
                            You will be asked to authenticate with your bank if your card issuer supports strong authentication.
                        </small>
                    </Form.Row>
                </Form>

                {processing && <Spinner enabled={processing}/>}
            </>
        );
    };

    return (
        <>
            {succeeded ? renderSuccess() : renderForm()}
        </>
    );
}

