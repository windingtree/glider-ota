
const controller = (req, res) => {
    console.debug("/api/test request");
    res.status(500).json({ret:"OK"});
}

module.exports = controller;


let event = {
    "id": "evt_1GQ6kWEGSIFX7DYMojTvTfnw",
    "object": "event",
    "api_version": "2020-03-02",
    "created": 1585033232,
    "data": {
        "object": {
            "id": "pi_1GQ6kLEGSIFX7DYM7Ku4BkGX",
            "object": "payment_intent",
            "amount": 32376,
            "amount_capturable": 0,
            "amount_received": 32376,
            "application": null,
            "application_fee_amount": null,
            "canceled_at": null,
            "cancellation_reason": null,
            "capture_method": "automatic",
            "charges": {
                "object": "list", "data": [{
                    "id": "ch_1GQ6kWEGSIFX7DYM4HElOxFb",
                    "object": "charge",
                    "amount": 32376,
                    "amount_refunded": 0,
                    "application": null,
                    "application_fee": null,
                    "application_fee_amount": null,
                    "balance_transaction": "txn_1GQ6kWEGSIFX7DYM2f1RlHjo",
                    "billing_details": {
                        "address": {
                            "city": null,
                            "country": null,
                            "line1": null,
                            "line2": null,
                            "postal_code": "12122",
                            "state": null
                        }, "email": null, "name": "test", "phone": null
                    },
                    "captured": true,
                    "created": 1585033232,
                    "currency": "eur",
                    "customer": null,
                    "description": null,
                    "destination": null,
                    "dispute": null,
                    "disputed": false,
                    "failure_code": null,
                    "failure_message": null,
                    "fraud_details": {},
                    "invoice": null,
                    "livemode": false,
                    "metadata": {"orderId": "f62feba9-a5d0-4979-80e0-b12f7abc48ab"},
                    "on_behalf_of": null,
                    "order": null,
                    "outcome": {
                        "network_status": "approved_by_network",
                        "reason": null,
                        "risk_level": "normal",
                        "risk_score": 57,
                        "seller_message": "Payment complete.",
                        "type": "authorized"
                    },
                    "paid": true,
                    "payment_intent": "pi_1GQ6kLEGSIFX7DYM7Ku4BkGX",
                    "payment_method": "pm_1GQ6kVEGSIFX7DYMYTs8tVww",
                    "payment_method_details": {
                        "card": {
                            "brand": "visa",
                            "checks": {
                                "address_line1_check": null,
                                "address_postal_code_check": "pass",
                                "cvc_check": "pass"
                            },
                            "country": "US",
                            "exp_month": 12,
                            "exp_year": 2021,
                            "fingerprint": "PyC29PEiFCLZIasT",
                            "funding": "credit",
                            "installments": null,
                            "last4": "4242",
                            "network": "visa",
                            "three_d_secure": null,
                            "wallet": null
                        }, "type": "card"
                    },
                    "receipt_email": null,
                    "receipt_number": null,
                    "receipt_url": "https://pay.stripe.com/receipts/acct_1GLl0hEGSIFX7DYM/ch_1GQ6kWEGSIFX7DYM4HElOxFb/rcpt_Gy2qHw5lJZlLwg8qMoRUeVe9DKQHoK1",
                    "refunded": false,
                    "refunds": {
                        "object": "list",
                        "data": [],
                        "has_more": false,
                        "total_count": 0,
                        "url": "/v1/charges/ch_1GQ6kWEGSIFX7DYM4HElOxFb/refunds"
                    },
                    "review": null,
                    "shipping": null,
                    "source": null,
                    "source_transfer": null,
                    "statement_descriptor": null,
                    "statement_descriptor_suffix": null,
                    "status": "succeeded",
                    "transfer_data": null,
                    "transfer_group": null
                }], "has_more": false, "total_count": 1, "url": "/v1/charges?payment_intent=pi_1GQ6kLEGSIFX7DYM7Ku4BkGX"
            },
            "client_secret": "pi_1GQ6kLEGSIFX7DYM7Ku4BkGX_secret_7VaX6mxhuoR6pl7H5935JRig8",
            "confirmation_method": "automatic",
            "created": 1585033221,
            "currency": "eur",
            "customer": null,
            "description": null,
            "invoice": null,
            "last_payment_error": null,
            "livemode": false,
            "metadata": {"orderId": "f62feba9-a5d0-4979-80e0-b12f7abc48ab"},
            "next_action": null,
            "on_behalf_of": null,
            "payment_method": "pm_1GQ6kVEGSIFX7DYMYTs8tVww",
            "payment_method_options": {"card": {"installments": null, "request_three_d_secure": "automatic"}},
            "payment_method_types": ["card"],
            "receipt_email": null,
            "review": null,
            "setup_future_usage": null,
            "shipping": null,
            "source": null,
            "statement_descriptor": null,
            "statement_descriptor_suffix": null,
            "status": "succeeded",
            "transfer_data": null,
            "transfer_group": null
        }
    },
    "livemode": false,
    "pending_webhooks": 3,
    "request": {"id": "req_fI6WX6BsBdOIRT", "idempotency_key": null},
    "type": "payment_intent.succeeded"
};
