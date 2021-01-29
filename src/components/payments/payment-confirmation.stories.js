import React from 'react';
import PaymentConfirmation from "./payment-confirmation";
import fetchMock from 'fetch-mock';

export default {
    component: PaymentConfirmation,
    title: 'Payments/Payment confirmation',
};

const fragment_payment_details={
    "card": {
        "brand": "visa",
        "last4": "4242"
    },
    "receipt": {
        "url": "https://pay.stripe.com/receipts/acct_1GYSMZBtLSGo1hFP/ch_1HSgdsBtLSGo1hFPOG8zXvb6/rcpt_I2mChBbFKkjJvm80ji6KgqWPbBbQMuv"
    },
    "status": {
        "type": "authorized",
        "network": "approved_by_network",
        "message": "Payment complete."
    }
}
const fragment_hotel_confirmation={
    "orderId": "3750aa4a-7595-49b7-9860-dd10dc98605a",
    "order": {
        "passengers": {
            "PAX1": {
                "type": "ADT",
                "civility": "MR",
                "lastnames": [
                    "Kurek"
                ],
                "firstnames": [
                    "Tomasz"
                ],
                "gender": "Male",
                "birthdate": "1999-12-12",
                "contactInformation": [
                    "+48609111825",
                    "tomasz.kurek@gmail.com"
                ]
            }
        },
        "price": {
            "currency": "USD",
            "public": 582
        },
        "restrictions": {
            "exchangeable": false,
            "refundable": false
        },
        "status": "OK",
        "response": "Committed",
        "reservationNumber": "3750AA4A"
    }
}
const fragment_flight_confirmation={
    "orderId": "eJzTd9f3CQ%2FzcrQEAAudAmM%3D",
    "order": {
        "price": {
            "currency": "EUR",
            "public": "172.38",
            "commission": 0,
            "taxes": "0.00"
        },
        "passengers": {
            "EE273BF1": {
                "type": "ADT",
                "gender": "Male",
                "civility": "",
                "lastnames": [
                    "Kurek"
                ],
                "firstnames": [
                    "Tomasz"
                ],
                "birthdate": "1999-12-12",
                "contactInformation": [
                    "tomasz.kurek@gmail.com",
                    "48609111825"
                ]
            }
        },
        "itinerary": {
            "segments": [
                {
                    "operator": {
                        "operatorType": "airline",
                        "iataCode": "SN",
                        "flightNumber": "SN3721"
                    },
                    "origin": {
                        "locationType": "airport",
                        "iataCode": "BRU"
                    },
                    "destination": {
                        "locationType": "airport",
                        "iataCode": "MAD"
                    },
                    "departureTime": "2021-08-04T09:25:00",
                    "arrivalTime": "2021-08-04T11:50:00",
                    "Departure": {
                        "AirportCode": "BRU"
                    },
                    "Arrival": {
                        "AirportCode": "MAD"
                    }
                },
                {
                    "operator": {
                        "operatorType": "airline",
                        "iataCode": "SN",
                        "flightNumber": "SN3732"
                    },
                    "origin": {
                        "locationType": "airport",
                        "iataCode": "MAD"
                    },
                    "destination": {
                        "locationType": "airport",
                        "iataCode": "BRU"
                    },
                    "departureTime": "2021-08-14T06:20:00",
                    "arrivalTime": "2021-08-14T08:35:00",
                    "Departure": {
                        "AirportCode": "MAD"
                    },
                    "Arrival": {
                        "AirportCode": "BRU"
                    }
                }
            ]
        },
        "options": []
    },
    "travelDocuments": {
        "bookings": [
            "LWVJA9"
        ],
        "etickets": [
            {
                "082-3861720285": "EE273BF1"
            }
        ]
    }
}

// multiple orders
const status_NEW_NOT_PAID={
    "payment_status": "NOT_PAID",
    "order_status": "NEW",
    "payment_details": {},
    "history": [],
    "subOffers": {
        "ACCOMMODATION_OFFER": {
            "payment_status": "NOT_PAID",
            "payment_details": {},
            "order_status": "NEW",
            "history": [],
            "confirmation": {}
        },
        "TRANSPORTATION_OFFER": {
            "payment_status": "NOT_PAID",
            "payment_details": {},
            "order_status": "NEW",
            "history": [],
            "confirmation": {}
        }
    }
}
const status_NEW_PAID ={
    "payment_status": "PAID",
    "order_status": "NEW",
    "payment_details": fragment_payment_details,
    "history": [],
    "subOffers": {
        "ACCOMMODATION_OFFER": {
            "payment_status": "PAID",
            "payment_details": fragment_payment_details,
            "order_status": "NEW",
            "history": [],
            "confirmation": {}
        },
        "TRANSPORTATION_OFFER": {
            "payment_status": "PAID",
            "payment_details": fragment_payment_details,
            "order_status": "NEW",
            "history": [],
            "confirmation": {}
        }
    }
}
const status_FULFILLING_hotelComplete ={
    "payment_status": "PAID",
    "order_status": "FULFILLING",
    "payment_details": fragment_payment_details,
    "history": [],
    "subOffers": {
        "ACCOMMODATION_OFFER": {
            "payment_status": "PAID",
            "payment_details": fragment_payment_details,
            "order_status": "FULFILLED",
            "history": [],
            "confirmation": fragment_hotel_confirmation
        },
        "TRANSPORTATION_OFFER": {
            "payment_status": "PAID",
            "payment_details": fragment_payment_details,
            "order_status": "FULFILLING",
            "history": [],
            "confirmation": {}
        }
    }
}
const status_FULFILLING_flightCompleted ={
    "payment_status": "PAID",
    "order_status": "FULFILLING",
    "payment_details": fragment_payment_details,
    "history": [],
    "subOffers": {
        "ACCOMMODATION_OFFER": {
            "payment_status": "PAID",
            "payment_details": fragment_payment_details,
            "order_status": "NEW",
            "history": [],
            "confirmation": {}
        },
        "TRANSPORTATION_OFFER": {
            "payment_status": "PAID",
            "payment_details": fragment_payment_details,
            "order_status": "FULFILLED",
            "history": [],
            "confirmation": fragment_flight_confirmation
        }
    }
}
const status_FAILED ={
    "payment_status": "PAID",
    "order_status": "FAILED",
    "payment_details": fragment_payment_details,
    "history": [],
    "subOffers": {
        "ACCOMMODATION_OFFER": {
            "payment_status": "PAID",
            "payment_details": fragment_payment_details,
            "order_status": "FAILED",
            "history": [],
            "confirmation": {}
        },
        "TRANSPORTATION_OFFER": {
            "payment_status": "FAILED",
            "payment_details": fragment_payment_details,
            "order_status": "FULFILLED",
            "history": [],
            "confirmation": {}
        }
    }
}
const status_FULFILLED ={
    "payment_status": "PAID",
    "order_status": "FULFILLED",
    "payment_details": fragment_payment_details,
    "history": [],
    "subOffers": {
        "ACCOMMODATION_OFFER": {
            "payment_status": "PAID",
            "payment_details": fragment_payment_details,
            "order_status": "FULFILLED",
            "history": [],
            "confirmation": fragment_hotel_confirmation
        },
        "TRANSPORTATION_OFFER": {
            "payment_status": "PAID",
            "payment_details": fragment_payment_details,
            "order_status": "FULFILLED",
            "history": [],
            "confirmation": fragment_flight_confirmation
        }
    }
}
const status_FULFILLED_HotelOnly ={
    "payment_status": "PAID",
    "order_status": "FULFILLED",
    "payment_details": fragment_payment_details,
    "history": [],
    "subOffers": {
        "ACCOMMODATION_OFFER": {
            "payment_status": "PAID",
            "payment_details": fragment_payment_details,
            "order_status": "FULFILLED",
            "history": [],
            "confirmation": fragment_hotel_confirmation
        }
    }
}

const status_PARTIALLYFULFILLED_hotelFailure = {
    "payment_status": "PAID",
    "order_status": "FULFILLED_PARTIALLY",
    "payment_details": fragment_payment_details,
    "history": [],
    "subOffers": {
        "ACCOMMODATION_OFFER": {
            "payment_status": "PAID",
            "payment_details": fragment_payment_details,
            "order_status": "FAILED",
            "history": [],
            "confirmation": {}
        },
        "TRANSPORTATION_OFFER": {
            "payment_status": "PAID",
            "payment_details": fragment_payment_details,
            "order_status": "FULFILLED",
            "history": [],
            "confirmation": fragment_flight_confirmation
        }
    }
}
const status_PARTIALLYFULFILLED_flightFailure = {
    "payment_status": "PAID",
    "order_status": "FULFILLED_PARTIALLY",
    "payment_details": fragment_payment_details,
    "history": [],
    "subOffers": {
        "ACCOMMODATION_OFFER": {
            "payment_status": "PAID",
            "payment_details": fragment_payment_details,
            "order_status": "FULFILLED",
            "history": [],
            "confirmation": fragment_hotel_confirmation
        },
        "TRANSPORTATION_OFFER": {
            "payment_status": "PAID",
            "payment_details": fragment_payment_details,
            "order_status": "FAILED",
            "history": [],
            "confirmation": {}
        }
    }
}
const status_payment_failed ={
    "payment_status": "FAILED",
    "order_status": "FAILED",
    "payment_details": {},
    "history": [],
    "subOffers": {
        "ACCOMMODATION_OFFER": {
            "payment_status": "NOT_PAID",
            "payment_details": {},
            "order_status": "NEW",
            "history": [],
            "confirmation": {}
        },
        "TRANSPORTATION_OFFER": {
            "payment_status": "NOT_PAID",
            "payment_details": {},
            "order_status": "NEW",
            "history": [],
            "confirmation": {}
        }
    }
}
const status_payment_cancelled ={
    "payment_status": "CANCELLED",
    "order_status": "FAILED",
    "payment_details": {},
    "history": [],
    "subOffers": {
        "ACCOMMODATION_OFFER": {
            "payment_status": "NOT_PAID",
            "payment_details": {},
            "order_status": "NEW",
            "history": [],
            "confirmation": {}
        },
        "TRANSPORTATION_OFFER": {
            "payment_status": "NOT_PAID",
            "payment_details": {},
            "order_status": "NEW",
            "history": [],
            "confirmation": {}
        }
    }
}


export const NEW_NOT_PAID = () => {
    fetchMock.restore();
    fetchMock.mock('path:/api/order/status',status_NEW_NOT_PAID);
    return (<PaymentConfirmation orderID={"XYZ"}/>);
}
export const NEW_PAID = () => {
    fetchMock.restore();
    fetchMock.mock('path:/api/order/status',status_NEW_PAID);
    return (<PaymentConfirmation orderID={"XYZ"}/>);
}
export const FULFILLING_HotelCompleted = () => {
    fetchMock.restore();
    fetchMock.mock('path:/api/order/status',status_FULFILLING_hotelComplete);
    return (<PaymentConfirmation orderID={"XYZ"}/>);
}
export const FULFILLING_FlightCompleted = () => {
    fetchMock.restore();
    fetchMock.mock('path:/api/order/status',status_FULFILLING_flightCompleted);
    return (<PaymentConfirmation orderID={"XYZ"}/>);
}
export const FAILED = () => {
    fetchMock.restore();
    fetchMock.mock('path:/api/order/status',status_FAILED);
    return (<PaymentConfirmation orderID={"XYZ"}/>);
}
export const FULFILLED = () => {
    fetchMock.restore();
    fetchMock.mock('path:/api/order/status',status_FULFILLED);
    return (<PaymentConfirmation orderID={"XYZ"}/>);
}
export const FULFILLED_HotelOnly= () => {
    fetchMock.restore();
    fetchMock.mock('path:/api/order/status',status_FULFILLED_HotelOnly);
    return (<PaymentConfirmation orderID={"XYZ"}/>);
}
export const PARTIALLY_FULFILLED_hotelFailure = () => {
    fetchMock.restore();
    fetchMock.mock('path:/api/order/status',status_PARTIALLYFULFILLED_hotelFailure);
    return (<PaymentConfirmation orderID={"XYZ"}/>);
}
export const PARTIALLYFULFILLED_flightFailure = () => {
    fetchMock.restore();
    fetchMock.mock('path:/api/order/status',status_PARTIALLYFULFILLED_flightFailure);
    return (<PaymentConfirmation orderID={"XYZ"}/>);
}
export const payment_failed = () => {
    fetchMock.restore();
    fetchMock.mock('path:/api/order/status',status_payment_failed);
    return (<PaymentConfirmation orderID={"XYZ"}/>);
}
export const payment_cancelled = () => {
    fetchMock.restore();
    fetchMock.mock('path:/api/order/status',status_payment_cancelled);
    return (<PaymentConfirmation orderID={"XYZ"}/>);
}
