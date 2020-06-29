import React from 'react';
import {
    action
} from '@storybook/addon-actions';
import PaymentSummary, {TermsFareRules} from "./payment-summary";


export default {
    component: PaymentSummary,
    title: 'Payments/Payment summary',
};


const confirmedOffer = {
    "offerId": "e3efb841-5196-4ecd-a336-fb17c5f5dc5e",
    "offer": {
        "price": {
            "currency": "CAD",
            "public": 529.62,
            "taxes": "60.40",
            "publicWithoutFees": 504.4,
            "opcFee": 25.22
        },
        "pricedItems": [
            {
                "taxes": [
                    {
                        "amount": "7.75",
                        "code": "XG",
                        "description": "Canada Goods and Services Tax (GST/HST #10009-2287 RT0001)"
                    },
                    {
                        "amount": "15.46",
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
                        "amount": "119.00",
                        "components": [
                            {
                                "name": "Basic",
                                "basisCode": "A30ZABA",
                                "designator": "A",
                                "conditions": "Changes:\nPrior to day of departure - Change fee (not available at this time) per direction, passenger plus applicable taxes and any additional fare difference. Changes can be made up to 2 hours prior to departure.\nNo flight changes are permitted.\nFlights can only be used in sequence from the place of departure specified on the itinerary.\nCancellations:\nTickets are non-refundable and non-transferable.\nCancellations are not permitted.\nCustomers who no-show for their flight will forfeit the fare paid. Air Canada will provide a full refund without penalty when you cancel a new ticket (i.e. when a new booking is made and you are assigned a booking reference) within 24 hours of purchase.\nPaid Advance Seat Selection is offered on Air Canada and Air Canada Rouge, as well as on Air Canada Express flights operated by Jazz, subject to availability.\nThis fare does not allow for the accumulation of Aeroplan Miles.\nRead complete fare rules applicable to this fare.\nChecked Baggage Allowance and Fee on Air Canada:\n1st bag: $34.49*  for Non-member, Air Canada Basic members; Complimentary for Air Canada Prestige or Star Alliance Gold members; Complimentary for Air Canada Super Elite, Elite members.\n2nd bag: $57.49*  for Non-member, Air Canada Basic or Star Alliance Silver &amp; Gold members; Complimentary for Air Canada Prestige members; Complimentary for Air Canada Super Elite, Elite members.\n1 extra bag: Complimentary for Star Alliance Gold members."
                            }
                        ]
                    },
                    {
                        "usage": "surcharge",
                        "code": "S1",
                        "description": "Navigation Surcharge",
                        "amount": "6.00"
                    }
                ]
            }
        ],
        "disclosures": [],
        "terms": "The grand total shown includes all taxes, fees, fuel surcharges where applicable and other charges. Fares shown are the best available uniform rates at this time for the number of tickets requested and the selected travel times and dates. Fares are not guaranteed until you purchase your ticket.\nUnited States federal law forbids the carriage of hazardous materials aboard the aircraft in your baggage or on your person. A violation can result in five years imprisonment and penalties of $250,000 or more.\nHazardous materials include explosives (e.g. fireworks), compressed gases (e.g. oxygen bottles or tear gas), flammable liquids or solids (e.g. paints and lighter fluid), corrosive or oxidizing materials, poisons, and radioactive materials such as radio-pharmaceuticals.\nSpecial exceptions are made for small quantities (up to 2 L/70 fl. oz. total) of medicinal products and toiletry items that are carried in your baggage, as well as for certain smoking products carried on your person.\nhttp://www.aircanada.com/en/travelinfo/airport/baggage/security.html\nAir Passenger Protection Regulations Notice: If you are denied boarding, your flight is cancelled or delayed for at least two hours, or your baggage is lost or damaged, you may be entitled to certain standards of treatment and compensation under the Air Passenger Protection Regulations. For more information about your passenger rights please contact your air carrier or visit the Canadian Transportation Agency's website.\nGeneral terms and conditions pertaining to flight delays, cancellations, denied boarding, seating of children and lost or damaged baggage can be found in Air Canada's General Conditions of Carriage and Tariffs.\nhttps://www.aircanada.com/ca/en/aco/home/legal/conditions-carriage-tariffs.html",
        "passengers": {
            "03C8FEA2": {
                "type": "ADT"
            }
        },
        "itinerary": {
            "segments": {
                "B02S7XNQ3U-SEG1": {
                    "operator": {
                        "operatorType": "airline",
                        "iataCode": "KV",
                        "flightNumber": "AC2442"
                    },
                    "origin": {
                        "locationType": "airport",
                        "iataCode": "YUL"
                    },
                    "destination": {
                        "locationType": "airport",
                        "iataCode": "YYZ"
                    },
                    "departureTime": "2020-06-15T08:30:00.000Z",
                    "arrivalTime": "2020-06-15T10:54:00.000Z"
                }
            }
        },
        "options": [],
        "expiration": "2020-05-15T14:43:00.437Z"
    }
}


const confirmedOffer_multi_segment_with_seats = {
    "offerId": "523956ee-681a-4f13-8c78-d7b4df8e85c2",
    "offer": {
        "price": {
            "currency": "CAD",
            "public": 529.62,
            "taxes": "60.40",
            "publicWithoutFees": 504.4,
            "opcFee": 25.22
        },
        "pricedItems": [
            {
                "taxes": [
                    {
                        "amount": "25.91",
                        "code": "CA",
                        "description": "Air Travellers Security Charge (ATSC)"
                    },
                    {
                        "amount": "1.50",
                        "code": "XG",
                        "description": "Canada Goods and Services Tax (GST/HST #10009-2287 RT0001)"
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
                    },
                    {
                        "amount": "136.09",
                        "code": "GB",
                        "description": "Air Passenger Duty (APD) International"
                    },
                    {
                        "amount": "40.61",
                        "code": "UB",
                        "description": "Passenger Service Charge"
                    },
                    {
                        "amount": "30.66",
                        "code": "BE",
                        "description": "Passenger Service and Security Charge"
                    },
                    {
                        "amount": "0.00",
                        "code": "6A",
                        "description": "Total Seat Taxes"
                    },
                    {
                        "amount": "0.00",
                        "code": "6A",
                        "description": "Total Seat Taxes"
                    }
                ],
                "fare": [
                    {
                        "usage": "base",
                        "amount": "1545.01",
                        "components": [
                            {
                                "name": "Flex",
                                "basisCode": "QHX3RCE",
                                "designator": "Q",
                                "conditions": "Changes:\nPrior to day of departure - The Change fee per transaction, per passenger is up to $300 CAD for changes made within 60 days of departure. A lesser fee applies for changes made outside 60 days of departure. Change fees are plus applicable taxes and any fare difference. Changes can be made up to 2 hours before departure.\nDay of departure, at the airport - $100 CAD, per passenger, plus applicable taxes (no charge for fare difference) for same-day flights only.\nFlights can only be used in sequence from the place of departure specified on the itinerary.\nCancellations:\nTickets are refundable (a $300 CAD fee applies per person) and non-transferable.\nPartially used tickets may be submitted for a refund assessment. The refund will be calculated as follows: actual fare paid minus the value of the portion of the journey that has been flown, and minus the applicable fee.\nCancellations can be made up to 45 minutes prior to departure.\nMinimum/maximum stay and other conditions may apply.\nComplimentary advance standard seat selection on Air Canada and Air Canada Express (operated by Jazz), subject to availability.\n100% Air Canada Status Miles for flights operated by Air Canada.\nComplimentary onboard meal.\nRead complete fare rules applicable to this fare.\nChecked Baggage Allowance and Fee on Air Canada:\n1 extra bag: Complimentary for Star Alliance Gold members."
                            },
                            {
                                "name": "Flex",
                                "basisCode": "QHW3RCE",
                                "designator": "Q",
                                "conditions": "Changes:\nPrior to day of departure - The Change fee per transaction, per passenger is up to $300 CAD for changes made within 60 days of departure. A lesser fee applies for changes made outside 60 days of departure. Change fees are plus applicable taxes and any fare difference. Changes can be made up to 2 hours before departure.\nDay of departure, at the airport - $100 CAD, per passenger, plus applicable taxes (no charge for fare difference) for same-day flights only.\nFlights can only be used in sequence from the place of departure specified on the itinerary.\nCancellations:\nTickets are refundable (a $300 CAD fee applies per person) and non-transferable.\nPartially used tickets may be submitted for a refund assessment. The refund will be calculated as follows: actual fare paid minus the value of the portion of the journey that has been flown, and minus the applicable fee.\nCancellations can be made up to 45 minutes prior to departure.\nMinimum/maximum stay and other conditions may apply.\nComplimentary advance standard seat selection on Air Canada and Air Canada Express (operated by Jazz), subject to availability.\n100% Air Canada Status Miles for flights operated by Air Canada.\nComplimentary onboard meal.\nRead complete fare rules applicable to this fare.\nChecked Baggage Allowance and Fee on Air Canada:\n1 extra bag: Complimentary for Star Alliance Gold members."
                            },
                            {
                                "name": "Flex",
                                "basisCode": "QHW3RCE",
                                "designator": "Q",
                                "conditions": "Changes:\nPrior to day of departure - The Change fee per transaction, per passenger is up to $300 CAD for changes made within 60 days of departure. A lesser fee applies for changes made outside 60 days of departure. Change fees are plus applicable taxes and any fare difference. Changes can be made up to 2 hours before departure.\nDay of departure, at the airport - $100 CAD, per passenger, plus applicable taxes (no charge for fare difference) for same-day flights only.\nFlights can only be used in sequence from the place of departure specified on the itinerary.\nCancellations:\nTickets are refundable (a $300 CAD fee applies per person) and non-transferable.\nPartially used tickets may be submitted for a refund assessment. The refund will be calculated as follows: actual fare paid minus the value of the portion of the journey that has been flown, and minus the applicable fee.\nCancellations can be made up to 45 minutes prior to departure.\nMinimum/maximum stay and other conditions may apply.\nComplimentary advance standard seat selection on Air Canada and Air Canada Express (operated by Jazz), subject to availability.\n100% Air Canada Status Miles for flights operated by Air Canada.\nComplimentary onboard meal.\nRead complete fare rules applicable to this fare.\nChecked Baggage Allowance and Fee on Air Canada:\n1 extra bag: Complimentary for Star Alliance Gold members."
                            }
                        ]
                    },
                    {
                        "usage": "surcharge",
                        "code": "S1",
                        "description": "Navigation Surcharge",
                        "amount": "29.99"
                    },
                    {
                        "usage": "surcharge",
                        "code": "YQ",
                        "description": "Fuel Surcharge",
                        "amount": "440.00"
                    }
                ]
            }
        ],
        "disclosures": [
            "Select a Preferred Aisle seat for $108.\nThe seat charge is applicable to each one-way flight. Taxes are not included.\nIf you change your mind during the seat selection process, you can decline the selection and won't pay the applicable charge.\nAdvance Preferred seat selection is based on availability.\nPreferred seat charges are non refundable, except if:\nyou are not seated in your originally selected Preferred seat because of an involuntary schedule or airport change (e.g. flight disruption, cancellation), or because Air Canada moves you from your Preferred seat prior to departure or during the flight\nyou have a confirmed upgrade to Business or Business First Class prior to flight check-in\nyou cancel your itinerary, or voluntarily change to a different flight or fare family and Preferred seat selection becomes complimentary on your new itinerary."
        ],
        "terms": "The grand total shown includes all taxes, fees, fuel surcharges where applicable and other charges. Fares shown are the best available uniform rates at this time for the number of tickets requested and the selected travel times and dates. Fares are not guaranteed until you purchase your ticket.\nUnited States federal law forbids the carriage of hazardous materials aboard the aircraft in your baggage or on your person. A violation can result in five years imprisonment and penalties of $250,000 or more.\nHazardous materials include explosives (e.g. fireworks), compressed gases (e.g. oxygen bottles or tear gas), flammable liquids or solids (e.g. paints and lighter fluid), corrosive or oxidizing materials, poisons, and radioactive materials such as radio-pharmaceuticals.\nSpecial exceptions are made for small quantities (up to 2 L/70 fl. oz. total) of medicinal products and toiletry items that are carried in your baggage, as well as for certain smoking products carried on your person.\nhttp://www.aircanada.com/en/travelinfo/airport/baggage/security.html\nAir Passenger Protection Regulations Notice: If you are denied boarding, your flight is cancelled or delayed for at least two hours, or your baggage is lost or damaged, you may be entitled to certain standards of treatment and compensation under the Air Passenger Protection Regulations. For more information about your passenger rights please contact your air carrier or visit the Canadian Transportation Agency's website.\nGeneral terms and conditions pertaining to flight delays, cancellations, denied boarding, seating of children and lost or damaged baggage can be found in Air Canada's General Conditions of Carriage and Tariffs.\nhttps://www.aircanada.com/ca/en/aco/home/legal/conditions-carriage-tariffs.html",
        "passengers": {
            "2F05F355": {
                "type": "ADT"
            }
        },
        "itinerary": {
            "segments": {
                "VLJETKXXRA-SEG37": {
                    "operator": {
                        "operatorType": "airline",
                        "iataCode": "AC",
                        "flightNumber": "AC2495"
                    },
                    "origin": {
                        "locationType": "airport",
                        "iataCode": "YUL"
                    },
                    "destination": {
                        "locationType": "airport",
                        "iataCode": "LHR"
                    },
                    "departureTime": "2020-07-08T21:55:00.000Z",
                    "arrivalTime": "2020-07-09T04:25:00.000Z"
                },
                "YDIQO51URZ-SEG281": {
                    "operator": {
                        "operatorType": "airline",
                        "iataCode": "SN",
                        "flightNumber": "AC6336"
                    },
                    "origin": {
                        "locationType": "airport",
                        "iataCode": "LHR"
                    },
                    "destination": {
                        "locationType": "airport",
                        "iataCode": "BRU"
                    },
                    "departureTime": "2020-07-10T10:05:00.000Z",
                    "arrivalTime": "2020-07-10T11:15:00.000Z"
                },
                "HGWILMC8TX-SEG282": {
                    "operator": {
                        "operatorType": "airline",
                        "iataCode": "AC",
                        "flightNumber": "AC0833"
                    },
                    "origin": {
                        "locationType": "airport",
                        "iataCode": "BRU"
                    },
                    "destination": {
                        "locationType": "airport",
                        "iataCode": "YUL"
                    },
                    "departureTime": "2020-07-10T13:00:00.000Z",
                    "arrivalTime": "2020-07-10T20:35:00.000Z"
                }
            }
        },
        "options": [
            {
                "code": "ASPA",
                "name": "Preferred Seat - Aisle",
                "description": "Preferred Seat - Aisle",
                "segment": "VLJETKXXRA-SEG37",
                "passenger": "2F05F355",
                "price": {
                    "public": "108.00",
                    "taxes": "0.00"
                },
                "taxes": [
                    {
                        "amount": "0.00",
                        "code": "6A",
                        "description": "Total Seat Taxes"
                    }
                ]
            }
        ],
        "expiration": "2020-06-19T07:06:07.582Z"
    }
}


export const paymentSummary = () => (<PaymentSummary offer={confirmedOffer.offer}/>);
export const paymentSummaryComplexBooking = () => (<PaymentSummary offer={confirmedOffer_multi_segment_with_seats.offer}/>);
export const TermsWithFareRules = () =>(<TermsFareRules offer={confirmedOffer.offer}/>)
