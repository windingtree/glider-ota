import React from 'react';
import {
    action
} from '@storybook/addon-actions';
import PaymentSummary from "./payment-summary";


export default {
    component: PaymentSummary,
    title: 'Payment summary',
};

const confirmedOffer = {
    "offerId": "e3efb841-5196-4ecd-a336-fb17c5f5dc5e",
    "offer": {
        "price": {
            "currency": "CAD",
            "public": "178.21",
            "taxes": "53.21"
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



export const paymentSummary = () => (<PaymentSummary totalPrice={confirmedOffer.offer.price} pricedItems={confirmedOffer.offer.pricedItems} />);

