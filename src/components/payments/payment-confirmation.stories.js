import React from 'react';
import {
    action
} from '@storybook/addon-actions';
import PaymentConfirmation from "./payment-confirmation";
import fetchMock from 'fetch-mock';

export default {
    component: PaymentConfirmation,
    title: 'Payments/Payment confirmation',
};

const pendingStatusMockResponse={
    "_id": "5ec69309e025507efc80ae24",
    "offerId": "3875fa87-e6e7-4cc0-81b6-f920c1256d20",
    "confirmedOffer": {
        "offerId": "3875fa87-e6e7-4cc0-81b6-f920c1256d20",
        "offer": {
            "price": {
                "currency": "CAD",
                "public": "212.29",
                "taxes": "65.30"
            },
            "pricedItems": [
                {
                    "taxes": [
                        {
                            "amount": "8.85",
                            "code": "XG",
                            "description": "Canada Goods and Services Tax (GST/HST #10009-2287 RT0001)"
                        },
                        {
                            "amount": "5.51",
                            "code": "XA",
                            "description": "U.S Agriculture Fee"
                        },
                        {
                            "amount": "9.75",
                            "code": "XY",
                            "description": "U.S.A Immigration User Fee"
                        },
                        {
                            "amount": "8.20",
                            "code": "YC",
                            "description": "Customs User Fee"
                        },
                        {
                            "amount": "2.99",
                            "code": "XQ",
                            "description": "Canada Quebec Sales Tax (QST #1000-043-172 TQ1991)"
                        },
                        {
                            "amount": "30.00",
                            "code": "SQ",
                            "description": "Canada Airport Improvement Fee"
                        }
                    ],
                    "fare": [
                        {
                            "usage": "base",
                            "amount": "146.99",
                            "components": [
                                {
                                    "name": "Standard",
                                    "basisCode": "KNA5A0TG",
                                    "designator": "K",
                                    "conditions": "Changes:\nPrior to day of departure - The Change fee per direction, per passenger is up to $100 CAD for changes made within 60 days of departure. A lesser fee applies for changes made outside 60 days of departure. Change fees are plus applicable taxes and any fare difference. Changes can be made up to 2 hours before departure.\nAirport same-day changes are subject to availability and are permitted only for same-day flights at a fee of $150 CAD per direction, per passenger.\nSame-day standby is available only to passengers travelling between Toronto Pearson (YYZ) and LaGuardia (LGA), John F. Kennedy (JFK) and Newark (EWR) airports.\nFlights can only be used in sequence from the place of departure specified on the itinerary.\nCancellations:\nTickets are non-refundable and non-transferable.\nCancellations can be made up to 45 minutes prior to departure.\nProvided the original booking is cancelled prior to the original flight departure, the value of unused ticket can be applied within a one year period from date of issue of the original tickets to the value of a new ticket subject to a change fee per direction, per passenger, plus applicable taxes and any additional fare difference, subject to availability and advance purchase requirements. The new outbound travel date must commence within a one year period from the original date of ticket issuance. If the fare for the new journey is lower, any residual amount will be forfeited.\nCustomers who no-show their flight will forfeit the fare paid.\nPaid Advance Seat Selection is available on Air Canada flights and Air Canada Express (operated by Jazz), subject to availability.\nFlights operated by Air Canada: earn 25% Aeroplan Miles (Altitude Qualifying Miles) for flights within Canada and 50% Aeroplan Miles (Altitude Qualifying Miles) for flights between Canada and the U.S.\nRead complete fare rules applicable to this fare.\nChecked Baggage Allowance and Fee on Air Canada:\n1st bag: $31.50*  for Non-member, Air Canada Basic members; Complimentary for Air Canada Prestige or Star Alliance Gold members; Complimentary for Air Canada Super Elite, Elite members.\n2nd bag: $52.50*  for Non-member, Air Canada Basic or Star Alliance Silver &amp; Gold members; Complimentary for Air Canada Prestige members; Complimentary for Air Canada Super Elite, Elite members.\n1 extra bag: Complimentary for Star Alliance Gold members."
                                }
                            ]
                        },
                        {
                            "usage": "surcharge",
                            "code": "S1",
                            "description": "Navigation Surcharge",
                            "amount": "0.00"
                        }
                    ]
                }
            ],
            "disclosures": [],
            "terms": "The grand total shown includes all taxes, fees, fuel surcharges where applicable and other charges. Fares shown are the best available uniform rates at this time for the number of tickets requested and the selected travel times and dates. Fares are not guaranteed until you purchase your ticket.\nUnited States federal law forbids the carriage of hazardous materials aboard the aircraft in your baggage or on your person. A violation can result in five years imprisonment and penalties of $250,000 or more.\nHazardous materials include explosives (e.g. fireworks), compressed gases (e.g. oxygen bottles or tear gas), flammable liquids or solids (e.g. paints and lighter fluid), corrosive or oxidizing materials, poisons, and radioactive materials such as radio-pharmaceuticals.\nSpecial exceptions are made for small quantities (up to 2 L/70 fl. oz. total) of medicinal products and toiletry items that are carried in your baggage, as well as for certain smoking products carried on your person.\nhttp://www.aircanada.com/en/travelinfo/airport/baggage/security.html\nAir Passenger Protection Regulations Notice: If you are denied boarding, your flight is cancelled or delayed for at least two hours, or your baggage is lost or damaged, you may be entitled to certain standards of treatment and compensation under the Air Passenger Protection Regulations. For more information about your passenger rights please contact your air carrier or visit the Canadian Transportation Agency's website.\nGeneral terms and conditions pertaining to flight delays, cancellations, denied boarding, seating of children and lost or damaged baggage can be found in Air Canada's General Conditions of Carriage and Tariffs.\nhttps://www.aircanada.com/ca/en/aco/home/legal/conditions-carriage-tariffs.html",
            "passengers": {
                "3F114013": {
                    "type": "ADT"
                }
            },
            "itinerary": {
                "segments": {
                    "Y5RCGV5L5P-SEG1": {
                        "operator": {
                            "operatorType": "airline",
                            "iataCode": "KV",
                            "flightNumber": "AC7727"
                        },
                        "origin": {
                            "locationType": "airport",
                            "iataCode": "YUL"
                        },
                        "destination": {
                            "locationType": "airport",
                            "iataCode": "DFW"
                        },
                        "departureTime": "2020-06-21T18:25:00.000Z",
                        "arrivalTime": "2020-06-21T22:20:00.000Z"
                    }
                }
            },
            "options": [],
            "expiration": "2020-05-21T15:11:05.152Z"
        }
    },
    "passengers": [
        {
            "id": "3F114013",
            "type": "ADT",
            "civility": "MR",
            "lastName": "Smith",
            "firstName": "John",
            "gender": "Male",
            "birthdate": "1980-01-01T00:00:00Z",
            "email": "test@test.com",
            "phone": "+48123456789"
        }
    ],
    "order_status": "NEW",
    "payment_status": "PAID",
    "payment_details": {
        "card": {
            "brand": "VISA",
            "last4": "1234"
        },
        "receipt": {
            "url": "https://pay.stripe.com/receipts/acct_1GYSMZBtLSGo1hFP/ch_1GpdcHBtLSGo1hFPmmxZDIXD/rcpt_HOQTaYAn1S9RgonBodL3XpoabVTttHk"
        },
        "status": {
            "type": "authorized",
            "network": "approved_by_network",
            "seller_message": "Payment complete.",
        },
    },
    "createDate": "2020-05-21T14:41:13.380Z"
}

const flightBookingFulfilledStatusMockResponse={
    "_id": "5ec6ddb3dafff062187951c3",
    "offerId": "ed0acb4c-b8a1-425a-bce5-459f27220a71",
    "confirmedOffer": {
        "offerId": "ed0acb4c-b8a1-425a-bce5-459f27220a71",
        "offer": {
            "price": {
                "currency": "CAD",
                "public": "212.29",
                "taxes": "65.30"
            },
            "pricedItems": [
                {
                    "taxes": [
                        {
                            "amount": "8.85",
                            "code": "XG",
                            "description": "Canada Goods and Services Tax (GST/HST #10009-2287 RT0001)"
                        },
                        {
                            "amount": "5.51",
                            "code": "XA",
                            "description": "U.S Agriculture Fee"
                        },
                        {
                            "amount": "9.75",
                            "code": "XY",
                            "description": "U.S.A Immigration User Fee"
                        },
                        {
                            "amount": "8.20",
                            "code": "YC",
                            "description": "Customs User Fee"
                        },
                        {
                            "amount": "2.99",
                            "code": "XQ",
                            "description": "Canada Quebec Sales Tax (QST #1000-043-172 TQ1991)"
                        },
                        {
                            "amount": "30.00",
                            "code": "SQ",
                            "description": "Canada Airport Improvement Fee"
                        }
                    ],
                    "fare": [
                        {
                            "usage": "base",
                            "amount": "146.99",
                            "components": [
                                {
                                    "name": "Standard",
                                    "basisCode": "KNA5A0TG",
                                    "designator": "K",
                                    "conditions": "Changes:\nPrior to day of departure - The Change fee per direction, per passenger is up to $100 CAD for changes made within 60 days of departure. A lesser fee applies for changes made outside 60 days of departure. Change fees are plus applicable taxes and any fare difference. Changes can be made up to 2 hours before departure.\nAirport same-day changes are subject to availability and are permitted only for same-day flights at a fee of $150 CAD per direction, per passenger.\nSame-day standby is available only to passengers travelling between Toronto Pearson (YYZ) and LaGuardia (LGA), John F. Kennedy (JFK) and Newark (EWR) airports.\nFlights can only be used in sequence from the place of departure specified on the itinerary.\nCancellations:\nTickets are non-refundable and non-transferable.\nCancellations can be made up to 45 minutes prior to departure.\nProvided the original booking is cancelled prior to the original flight departure, the value of unused ticket can be applied within a one year period from date of issue of the original tickets to the value of a new ticket subject to a change fee per direction, per passenger, plus applicable taxes and any additional fare difference, subject to availability and advance purchase requirements. The new outbound travel date must commence within a one year period from the original date of ticket issuance. If the fare for the new journey is lower, any residual amount will be forfeited.\nCustomers who no-show their flight will forfeit the fare paid.\nPaid Advance Seat Selection is available on Air Canada flights and Air Canada Express (operated by Jazz), subject to availability.\nFlights operated by Air Canada: earn 25% Aeroplan Miles (Altitude Qualifying Miles) for flights within Canada and 50% Aeroplan Miles (Altitude Qualifying Miles) for flights between Canada and the U.S.\nRead complete fare rules applicable to this fare.\nChecked Baggage Allowance and Fee on Air Canada:\n1st bag: $31.50*  for Non-member, Air Canada Basic members; Complimentary for Air Canada Prestige or Star Alliance Gold members; Complimentary for Air Canada Super Elite, Elite members.\n2nd bag: $52.50*  for Non-member, Air Canada Basic or Star Alliance Silver &amp; Gold members; Complimentary for Air Canada Prestige members; Complimentary for Air Canada Super Elite, Elite members.\n1 extra bag: Complimentary for Star Alliance Gold members."
                                }
                            ]
                        },
                        {
                            "usage": "surcharge",
                            "code": "S1",
                            "description": "Navigation Surcharge",
                            "amount": "0.00"
                        }
                    ]
                }
            ],
            "disclosures": [],
            "terms": "The grand total shown includes all taxes, fees, fuel surcharges where applicable and other charges. Fares shown are the best available uniform rates at this time for the number of tickets requested and the selected travel times and dates. Fares are not guaranteed until you purchase your ticket.\nUnited States federal law forbids the carriage of hazardous materials aboard the aircraft in your baggage or on your person. A violation can result in five years imprisonment and penalties of $250,000 or more.\nHazardous materials include explosives (e.g. fireworks), compressed gases (e.g. oxygen bottles or tear gas), flammable liquids or solids (e.g. paints and lighter fluid), corrosive or oxidizing materials, poisons, and radioactive materials such as radio-pharmaceuticals.\nSpecial exceptions are made for small quantities (up to 2 L/70 fl. oz. total) of medicinal products and toiletry items that are carried in your baggage, as well as for certain smoking products carried on your person.\nhttp://www.aircanada.com/en/travelinfo/airport/baggage/security.html\nAir Passenger Protection Regulations Notice: If you are denied boarding, your flight is cancelled or delayed for at least two hours, or your baggage is lost or damaged, you may be entitled to certain standards of treatment and compensation under the Air Passenger Protection Regulations. For more information about your passenger rights please contact your air carrier or visit the Canadian Transportation Agency's website.\nGeneral terms and conditions pertaining to flight delays, cancellations, denied boarding, seating of children and lost or damaged baggage can be found in Air Canada's General Conditions of Carriage and Tariffs.\nhttps://www.aircanada.com/ca/en/aco/home/legal/conditions-carriage-tariffs.html",
            "passengers": {
                "857E0FF6": {
                    "type": "ADT"
                }
            },
            "itinerary": {
                "segments": {
                    "I14URV6DX8-SEG1": {
                        "operator": {
                            "operatorType": "airline",
                            "iataCode": "KV",
                            "flightNumber": "AC7727"
                        },
                        "origin": {
                            "locationType": "airport",
                            "iataCode": "YUL"
                        },
                        "destination": {
                            "locationType": "airport",
                            "iataCode": "DFW"
                        },
                        "departureTime": "2020-06-21T18:25:00.000Z",
                        "arrivalTime": "2020-06-21T22:20:00.000Z"
                    }
                }
            },
            "options": [],
            "expiration": "2020-05-21T20:27:15.531Z"
        }
    },
    "passengers": [
        {
            "id": "857E0FF6",
            "type": "ADT",
            "civility": "MR",
            "lastName": "Smith",
            "firstName": "John",
            "birthdate": "1980-01-01T00:00:00Z",
            "email": "test@test.com",
            "phone": "+48123456789"
        }
    ],
    "order_status": "FULFILLED",
    "payment_status": "PAID",
    "payment_details": {
        "card": {
            "brand": "VISA",
            "last4": "1234"
        },
        "receipt": {
            "url": "https://pay.stripe.com/receipts/acct_1GYSMZBtLSGo1hFP/ch_1GpdcHBtLSGo1hFPmmxZDIXD/rcpt_HOQTaYAn1S9RgonBodL3XpoabVTttHk"
        },
        "status": {
            "type": "authorized",
            "network": "approved_by_network",
            "seller_message": "Payment complete.",
        },
    },
    "createDate": "2020-05-21T19:59:47.492Z",
    "transaction_history": [],
    "lastModifyDateTime": "6829389843391315971",
    "transactions": [
        {
            "comment": "Webhook event:payment_intent.succeeded",
            "data": {
                "webhookEvent": {
                    "type": "payment_intent.succeeded",
                    "data": {
                        "object": {
                            "metadata": {
                                "confirmedOfferId": "ed0acb4c-b8a1-425a-bce5-459f27220a71"
                            }
                        }
                    }
                }
            },
            "transactionTime": "2020-05-21T19:59:58.661Z"
        },
        {
            "comment": "Fulfilled after successful payment",
            "data": {
                "orderId": "UYRISL",
                "order": {
                    "version": "1.0.0",
                    "type": "transportation",
                    "subtype": "flight",
                    "price": {
                        "currency": "CAD",
                        "public": "212.29",
                        "commission": "0",
                        "taxes": "65.3"
                    },
                    "passengers": {
                        "857E0FF6": {
                            "type": "ADT",
                            "gender": "Male",
                            "civility": "MR",
                            "lastnames": [
                                "SMITH"
                            ],
                            "firstnames": [
                                "JOHN"
                            ],
                            "birthdate": "1980-01-01",
                            "contactInformation": [
                                "TEST@TEST.COM",
                                "+48123456789"
                            ]
                        }
                    },
                    "itinerary": {
                        "segments": {
                            "I14URV6DX8-SEG1": {
                                "operator": {
                                    "operatorType": "airline",
                                    "iataCode": "KV",
                                    "flightNumber": "AC7727"
                                },
                                "origin": {
                                    "locationType": "airport",
                                    "iataCode": "YUL"
                                },
                                "destination": {
                                    "locationType": "airport",
                                    "iataCode": "DFW"
                                },
                                "departureTime": "2020-06-21T18:25:00.000Z",
                                "arrivalTime": "2020-06-21T22:20:00.000Z"
                            }
                        }
                    }
                },
                "travelDocuments": {
                    "bookings": [
                        "UYRISL"
                    ],
                    "etickets": [
                        {
                            "0142171527413": "857E0FF6"
                        }
                    ]
                }
            },
            "transactionTime": "2020-05-21T20:00:35.310Z"
        }
    ],
    "confirmation": {
        "orderId": "UYRISL",
        "order": {
            "version": "1.0.0",
            "type": "transportation",
            "subtype": "flight",
            "price": {
                "currency": "CAD",
                "public": "212.29",
                "commission": "0",
                "taxes": "65.3"
            },
            "passengers": {
                "857E0FF6": {
                    "type": "ADT",
                    "gender": "Male",
                    "civility": "MR",
                    "lastnames": [
                        "SMITH"
                    ],
                    "firstnames": [
                        "JOHN"
                    ],
                    "birthdate": "1980-01-01",
                    "contactInformation": [
                        "TEST@TEST.COM",
                        "+48123456789"
                    ]
                }
            },
            "itinerary": {
                "segments": {
                    "I14URV6DX8-SEG1": {
                        "operator": {
                            "operatorType": "airline",
                            "iataCode": "KV",
                            "flightNumber": "AC7727"
                        },
                        "origin": {
                            "locationType": "airport",
                            "iataCode": "YUL"
                        },
                        "destination": {
                            "locationType": "airport",
                            "iataCode": "DFW"
                        },
                        "departureTime": "2020-06-21T18:25:00.000Z",
                        "arrivalTime": "2020-06-21T22:20:00.000Z"
                    }
                }
            }
        },
        "travelDocuments": {
            "bookings": [
                "UYRISL"
            ],
            "etickets": [
                {
                    "0142171527413": "857E0FF6"
                }
            ]
        }
    }
}


const hotelBookingFulfilledStatusMockResponse={
    "payment_status": "PAID",
    "payment_details": {
        "card": {
            "brand": "visa",
            "last4": "4242"
        },
        "receipt": {
            "url": "https://pay.stripe.com/receipts/acct_1GYSMZBtLSGo1hFP/ch_1GqL7IBtLSGo1hFPD8BB8j6t/rcpt_HP9QD6V22sO4HHXsGbeoIWOMwjTAVoO"
        },
        "status": {
            "type": "authorized",
            "network": "approved_by_network",
            "message": "Payment complete."
        }
    },
    "order_status": "FULFILLED",
    "history": [
        {
            "comment": "Webhook event:payment_intent.succeeded",
            "timestamp": "2020-06-04T15:36:33.845Z"
        },
        {
            "comment": "Fulfilled after successful payment",
            "timestamp": "2020-06-04T15:36:47.701Z"
        }
    ],
    "confirmation": {
        "orderId": "67e4fc9c-dfb4-4587-beaf-e2dc86a214b3",
        "order": {
            "response": "Committed",
            "reservationNumber": "64478864",
            "passengers": {
                "PAX1": {
                    "type": "ADT",
                    "civility": "MR",
                    "lastnames": [
                        "test"
                    ],
                    "firstnames": [
                        "test"
                    ],
                    "gender": "Male",
                    "birthdate": "1999-12-12",
                    "contactInformation": [
                        "+12313123213",
                        "tomasz.kurek@gmail.com"
                    ]
                }
            }
        }
    }
}




const failedStatusMockResponse={
    "_id": "5ec69309e025507efc80ae24",
    "offerId": "3875fa87-e6e7-4cc0-81b6-f920c1256d20",
    "confirmedOffer": {
        "offerId": "3875fa87-e6e7-4cc0-81b6-f920c1256d20",
        "offer": {
            "price": {
                "currency": "CAD",
                "public": "212.29",
                "taxes": "65.30"
            },
            "pricedItems": [
                {
                    "taxes": [
                        {
                            "amount": "8.85",
                            "code": "XG",
                            "description": "Canada Goods and Services Tax (GST/HST #10009-2287 RT0001)"
                        },
                        {
                            "amount": "5.51",
                            "code": "XA",
                            "description": "U.S Agriculture Fee"
                        },
                        {
                            "amount": "9.75",
                            "code": "XY",
                            "description": "U.S.A Immigration User Fee"
                        },
                        {
                            "amount": "8.20",
                            "code": "YC",
                            "description": "Customs User Fee"
                        },
                        {
                            "amount": "2.99",
                            "code": "XQ",
                            "description": "Canada Quebec Sales Tax (QST #1000-043-172 TQ1991)"
                        },
                        {
                            "amount": "30.00",
                            "code": "SQ",
                            "description": "Canada Airport Improvement Fee"
                        }
                    ],
                    "fare": [
                        {
                            "usage": "base",
                            "amount": "146.99",
                            "components": [
                                {
                                    "name": "Standard",
                                    "basisCode": "KNA5A0TG",
                                    "designator": "K",
                                    "conditions": "Changes:\nPrior to day of departure - The Change fee per direction, per passenger is up to $100 CAD for changes made within 60 days of departure. A lesser fee applies for changes made outside 60 days of departure. Change fees are plus applicable taxes and any fare difference. Changes can be made up to 2 hours before departure.\nAirport same-day changes are subject to availability and are permitted only for same-day flights at a fee of $150 CAD per direction, per passenger.\nSame-day standby is available only to passengers travelling between Toronto Pearson (YYZ) and LaGuardia (LGA), John F. Kennedy (JFK) and Newark (EWR) airports.\nFlights can only be used in sequence from the place of departure specified on the itinerary.\nCancellations:\nTickets are non-refundable and non-transferable.\nCancellations can be made up to 45 minutes prior to departure.\nProvided the original booking is cancelled prior to the original flight departure, the value of unused ticket can be applied within a one year period from date of issue of the original tickets to the value of a new ticket subject to a change fee per direction, per passenger, plus applicable taxes and any additional fare difference, subject to availability and advance purchase requirements. The new outbound travel date must commence within a one year period from the original date of ticket issuance. If the fare for the new journey is lower, any residual amount will be forfeited.\nCustomers who no-show their flight will forfeit the fare paid.\nPaid Advance Seat Selection is available on Air Canada flights and Air Canada Express (operated by Jazz), subject to availability.\nFlights operated by Air Canada: earn 25% Aeroplan Miles (Altitude Qualifying Miles) for flights within Canada and 50% Aeroplan Miles (Altitude Qualifying Miles) for flights between Canada and the U.S.\nRead complete fare rules applicable to this fare.\nChecked Baggage Allowance and Fee on Air Canada:\n1st bag: $31.50*  for Non-member, Air Canada Basic members; Complimentary for Air Canada Prestige or Star Alliance Gold members; Complimentary for Air Canada Super Elite, Elite members.\n2nd bag: $52.50*  for Non-member, Air Canada Basic or Star Alliance Silver &amp; Gold members; Complimentary for Air Canada Prestige members; Complimentary for Air Canada Super Elite, Elite members.\n1 extra bag: Complimentary for Star Alliance Gold members."
                                }
                            ]
                        },
                        {
                            "usage": "surcharge",
                            "code": "S1",
                            "description": "Navigation Surcharge",
                            "amount": "0.00"
                        }
                    ]
                }
            ],
            "disclosures": [],
            "terms": "The grand total shown includes all taxes, fees, fuel surcharges where applicable and other charges. Fares shown are the best available uniform rates at this time for the number of tickets requested and the selected travel times and dates. Fares are not guaranteed until you purchase your ticket.\nUnited States federal law forbids the carriage of hazardous materials aboard the aircraft in your baggage or on your person. A violation can result in five years imprisonment and penalties of $250,000 or more.\nHazardous materials include explosives (e.g. fireworks), compressed gases (e.g. oxygen bottles or tear gas), flammable liquids or solids (e.g. paints and lighter fluid), corrosive or oxidizing materials, poisons, and radioactive materials such as radio-pharmaceuticals.\nSpecial exceptions are made for small quantities (up to 2 L/70 fl. oz. total) of medicinal products and toiletry items that are carried in your baggage, as well as for certain smoking products carried on your person.\nhttp://www.aircanada.com/en/travelinfo/airport/baggage/security.html\nAir Passenger Protection Regulations Notice: If you are denied boarding, your flight is cancelled or delayed for at least two hours, or your baggage is lost or damaged, you may be entitled to certain standards of treatment and compensation under the Air Passenger Protection Regulations. For more information about your passenger rights please contact your air carrier or visit the Canadian Transportation Agency's website.\nGeneral terms and conditions pertaining to flight delays, cancellations, denied boarding, seating of children and lost or damaged baggage can be found in Air Canada's General Conditions of Carriage and Tariffs.\nhttps://www.aircanada.com/ca/en/aco/home/legal/conditions-carriage-tariffs.html",
            "passengers": {
                "3F114013": {
                    "type": "ADT"
                }
            },
            "itinerary": {
                "segments": {
                    "Y5RCGV5L5P-SEG1": {
                        "operator": {
                            "operatorType": "airline",
                            "iataCode": "KV",
                            "flightNumber": "AC7727"
                        },
                        "origin": {
                            "locationType": "airport",
                            "iataCode": "YUL"
                        },
                        "destination": {
                            "locationType": "airport",
                            "iataCode": "DFW"
                        },
                        "departureTime": "2020-06-21T18:25:00.000Z",
                        "arrivalTime": "2020-06-21T22:20:00.000Z"
                    }
                }
            },
            "options": [],
            "expiration": "2020-05-21T15:11:05.152Z"
        }
    },
    "passengers": [
        {
            "id": "3F114013",
            "type": "ADT",
            "civility": "MR",
            "lastName": "Smith",
            "firstName": "John",
            "gender": "Male",
            "birthdate": "1980-01-01T00:00:00Z",
            "email": "test@test.com",
            "phone": "+48123456789"
        }
    ],
    "order_status": "FAILED",
    "payment_status": "PAID",
    "createDate": "2020-05-21T14:41:13.380Z",
    "payment_details": {
        "card": {
            "brand": "VISA",
            "last4": "1234"
        },
        "receipt": {
            "url": "https://pay.stripe.com/receipts/acct_1GYSMZBtLSGo1hFP/ch_1GpdcHBtLSGo1hFPmmxZDIXD/rcpt_HOQTaYAn1S9RgonBodL3XpoabVTttHk"
        },
        "status": {
            "type": "authorized",
            "network": "approved_by_network",
            "seller_message": "Payment complete.",
        },
    },
}


export const StatusPending = () => {
    fetchMock.restore();
    fetchMock.mock('path:/api/order/status',pendingStatusMockResponse);
    return (<PaymentConfirmation orderID={"XYZ"}/>);
}



export const StatusFulfilledForFlightBooking = () => {
    fetchMock.restore();
    fetchMock.mock('path:/api/order/status',flightBookingFulfilledStatusMockResponse);
    return (<PaymentConfirmation orderID={"XYZ"}/>);
}

export const StatusFulfilledForHotelBooking = () => {
    fetchMock.restore();
    fetchMock.mock('path:/api/order/status',hotelBookingFulfilledStatusMockResponse);
    return (<PaymentConfirmation orderID={"XYZ"}/>);
}


export const StatusFailed = () => {
    fetchMock.restore();
    fetchMock.mock('path:/api/order/status',failedStatusMockResponse);
    return (<PaymentConfirmation orderID={"XYZ"}/>);
}
