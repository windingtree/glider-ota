require('dotenv').config();  //load .env
const {prepareEmailTemplateInput, findEmail,sendBookingConfirmations} = require('../../../api/_lib/email-confirmations');
const assert = require('assert');
const Handlebars = require("handlebars");


let flightConfirmation_2ADT1CHD_Return = {
    "orderId": "eJzTd9cP8%2FEIcnEDAAuVAmw%3D",
    "order": {
        "price": {
            "currency": "EUR",
            "public": "2600.99",
            "commission": 0,
            "taxes": "0.00"
        },
        "passengers": {
            "PAX1": {
                "type": "ADT",
                "civility": "MR",
                "lastnames": [
                    "Marley"
                ],
                "firstnames": [
                    "Tomasz Kurek"
                ],
                "birthdate": "1980-03-21",
                "contactInformation": [
                    "+32123456789",
                    "tomasz@windingtree.com"
                ],
                "count": 1
            },
            "PAX2": {
                "type": "ADT",
                "civility": "MR",
                "lastnames": [
                    "Doe", "Trump"
                ],
                "firstnames": [
                    "John"
                ],
                "birthdate": "1980-03-21",
                "contactInformation": [
                    "tomasz@windingtree.com",
                    "+32123456789"
                ],
                "count": 1
            },
            "PAX3": {
                "type": "CHD",
                "civility": "MRS",
                "lastnames": [
                    "Smith"
                ],
                "firstnames": [
                    "Anna",
                    "Francesca"
                ],
                "birthdate": "1980-03-21",
                "contactInformation": [
                    "tomasz@windingtree.com",
                    "+32123456789"
                ],
                "count": 1
            }

        },
        "itinerary": {
            "segments": [
                {
                    "operator": {
                        "operatorType": "airline",
                        "iataCode": "AC",
                        "flightNumber": "AC0668"
                    },
                    "origin": {
                        "locationType": "airport",
                        "iataCode": "LHR"
                    },
                    "destination": {
                        "locationType": "airport",
                        "iataCode": "YUL"
                    },
                    "departureTime": "2021-04-12T23:20:50.52Z",
                    "arrivalTime": "2021-04-15T11:25:50.52Z"
                },
                {
                    "operator": {
                        "operatorType": "airline",
                        "iataCode": "AC",
                        "flightNumber": "AC0667"
                    },
                    "origin": {
                        "locationType": "airport",
                        "iataCode": "YUL"
                    },
                    "destination": {
                        "locationType": "airport",
                        "iataCode": "LHR"
                    },
                    "departureTime": "2021-04-19T09:20:50.52Z",
                    "arrivalTime": "2021-04-19T11:25:50.52Z"
                }
            ]
        },
        "options": [
            {
                "code": "divNonAir11.LGAC1",
                "name": "Lounge Access",
                "description": "An access to the Exclusive Lounge Access at the departure",
                "segment": "HW9EJ7XAC7-SEG1",
                "passenger": "PAX1",
                "seatNumber": "12C",
                "price": {
                    "currency": "EUR",
                    "private": "40.00",
                    "public": "40.00",
                    "commission": "40.00",
                    "taxes": "40.00"
                },
                "taxes": [
                    {
                        "amount": "40.00",
                        "code": "CA",
                        "description": "Air Travellers Security Charge (ATSC)"
                    }
                ]
            }
        ],
    },
    "travelDocuments": {
        "bookings": [
            "XXXXX", "YYYYY"
        ],
        "etickets": ["012-111111111", "012-111111112", "012-111111113", "012-111111114", "012-111111115", "012-111111116"]
    }
}
let hotelConfirmation_1ADT = {
    "orderId": "dabdf744-60f9-4b11-9937-0316efa03afb",
    "order": {
        "response": "Committed",
        "reservationNumber": "64478864",
        "passengers": {
            "PAX1": {
                "type": "ADT",
                "civility": "MR",
                "lastnames": [
                    "Marley"
                ],
                "firstnames": [
                    "Bob"
                ],
                "birthdate": "1980-03-21",
                "contactInformation": [
                    "+32123456789",
                    "tomasz@windingtree.com"
                ],
                "count": 1
            }
        }
    }
}
let flightConfirmatoin_2ADT1CHD_Return_GDS = {
    "orderId": "eJzTd9cPC3UKCQ4DAAveApA%3D",
    "order": {
        "price": {
            "currency": "EUR",
            "public": "281.86",
            "commission": 0,
            "taxes": "0.00"
        },
        "passengers": {
            "299E47E8": {
                "type": "ADT",
                "gender": "Male",
                "civility": "",
                "lastnames": [
                    "Smith"
                ],
                "firstnames": [
                    "John"
                ],
                "birthdate": "1980-03-21",
                "contactInformation": [
                    "tomasz@windingtree.com",
                    [
                        {
                            "deviceType": "MOBILE",
                            "countryCallingCode": "1",
                            "number": "+32123456789"
                        }
                    ]
                ]
            },
            "AD18A617": {
                "type": "ADT",
                "gender": "Male",
                "civility": "",
                "lastnames": [
                    "Marley"
                ],
                "firstnames": [
                    "Bob"
                ],
                "birthdate": "1980-03-21",
                "contactInformation": [
                    "tomasz@windingtree.com",
                    [
                        {
                            "deviceType": "MOBILE",
                            "countryCallingCode": "1",
                            "number": "+32123456789"
                        }
                    ]
                ]
            }
        },
        "itinerary": {
            "segments": {}
        },
        "options": []
    },
    "travelDocuments": {
        "bookings": [
            "VUBTSV"
        ],
        "etickets": []
    }
}


describe('Email booking confirmation', function () {
    describe('#sendBookingConfirmations()', function () {
        it('should send email', () => {
            sendBookingConfirmations(flightConfirmation_2ADT1CHD_Return)
            // sendBookingConfirmations(hotelConfirmation_1ADT)
            // sendBookingConfirmations(flightConfirmatoin_2ADT1CHD_Return_GDS)
        })
    });
    describe('#findEmail()', function () {
        it('should find first email address from the list', () => {
            assert.strictEqual(findEmail(['+1 123123123', 'john@doe.com', 'anna@smith.com']), 'john@doe.com');
            assert.strictEqual(findEmail(['+1 123123123', '+1 123123123', '+231 12321321']), undefined);
            assert.strictEqual(findEmail([]), undefined);
            assert.strictEqual(findEmail(), undefined);
        })
    });
    describe('#prepareEmailTemplateInput()', function () {
        it('should prepare a list of email templates in case passengerID is not provided', async () => {
            let templateInput = prepareEmailTemplateInput(flightConfirmation_2ADT1CHD_Return);
            assert.strictEqual(templateInput.length, 3);
        });

        it('should prepare one email template in case passengerID is provided', async () => {
            let templateInput = prepareEmailTemplateInput(flightConfirmation_2ADT1CHD_Return, "PAX1");
            assert.strictEqual(templateInput.length, 1);
        });


        it('should use correct email address and name for requested passenger', async () => {
            let templateInput = prepareEmailTemplateInput(flightConfirmation_2ADT1CHD_Return, "PAX1");
            assert.strictEqual(templateInput.length, 1);
            assert.strictEqual(templateInput[0].recipientEmail, "tomasz@windingtree.com")
            assert.strictEqual(templateInput[0].recipientName, "Mr Bob Andrew Marley")

            templateInput = prepareEmailTemplateInput(flightConfirmation_2ADT1CHD_Return, "PAX2");
            assert.strictEqual(templateInput.length, 1);
            assert.strictEqual(templateInput[0].recipientEmail, "tomasz@windingtree.com")
            assert.strictEqual(templateInput[0].recipientName, "Mr John Doe Trump")

            templateInput = prepareEmailTemplateInput(flightConfirmation_2ADT1CHD_Return, "PAX3");
            assert.strictEqual(templateInput.length, 1);
            assert.strictEqual(templateInput[0].recipientEmail, "tomasz@windingtree.com")
            assert.strictEqual(templateInput[0].recipientName, "Mrs Anna Francesca Smith")
        });

        it('should prepare segment information and enrich it with additional airport info', async () => {
            let templateInput = prepareEmailTemplateInput(flightConfirmation_2ADT1CHD_Return, "PAX1");
            let seg1 = templateInput[0].segments[0];
            assert.strictEqual(seg1.flightNumber, "AC0668")
            assert.strictEqual(seg1.origin, "Heathrow(LHR)")
            assert.strictEqual(seg1.destination, "Pierre E.Trudeau Intl(YUL)")
            assert.strictEqual(seg1.departureDate, "12 Apr")
            assert.strictEqual(seg1.departureTime, "23:20")
            assert.strictEqual(seg1.arrivalDate, "15 Apr")
            assert.strictEqual(seg1.arrivalTime, "11:25")
        });

        it('should prepare booking reference and etickets', async () => {
            let templateInput = prepareEmailTemplateInput(flightConfirmation_2ADT1CHD_Return, "PAX1");
            assert.strictEqual(templateInput[0].bookingReferences, "XXXXX, YYYYY")
            assert.strictEqual(templateInput[0].etickets, "012-111111111, 012-111111112, 012-111111113, 012-111111114, 012-111111115, 012-111111116")
        });

        it('should prepare correct price breakdown', async () => {
            let templateInput = prepareEmailTemplateInput(flightConfirmation_2ADT1CHD_Return, "PAX1");
            let {totalPrice, ancillaryPriceInfo} = templateInput[0];

            assert.strictEqual(totalPrice, "2600.99 EUR")
            assert.strictEqual(ancillaryPriceInfo.length, 1);
            let firstAncillary = ancillaryPriceInfo[0];
            assert.strictEqual(firstAncillary.price, "40.00 EUR")
            assert.strictEqual(firstAncillary.code, "divNonAir11.LGAC1")
            assert.strictEqual(firstAncillary.name, "Lounge Access")
            assert.strictEqual(firstAncillary.description, "An access to the Exclusive Lounge Access at the departure")
        });

        it('should prepare template for hotel booking correctly', async () => {
            let templateInput = prepareEmailTemplateInput(hotelConfirmation_1ADT, "PAX1");
            assert.strictEqual(templateInput.length, 1);

            assert.strictEqual(templateInput[0].bookingReferences, "64478864")
            assert.strictEqual(templateInput[0].etickets, undefined)

        });

        it('should prepare template for hotel booking correctly', async () => {
            let templateInput = prepareEmailTemplateInput(flightConfirmatoin_2ADT1CHD_Return_GDS, "299E47E8");
            assert.strictEqual(templateInput.length, 1);

        });
    });
    describe('prepare email template', () => {
        let template = `
<div id="mailbody">
    Dear {{recipientName}}
    <br/><br/>
    <strong>Your booking is confirmed.</strong>
    <br/>Thank you for booking with Glider OTA.
    <br/>Please find below the details of your purchase.

    <p class="sizeh2">Travel documents</p>
    {{#if bookingReferences}}
    Booking reference: <b>{{bookingReferences}}</b><br/>
    {{/if}}
    {{#if etickets}}
    Electronic ticket: <b>{{etickets}}</b>
    {{/if}}
    
    <p class="sizeh2">Passengers</p>
    {{#each passengers}}
    {{name}}<br/>
    
    {{#each contactInformation}}
    {{this}}<br/>
    {{/each}}
    <br/><br/>
    {{/each}}

    {{#if segments}}
    <p class="sizeh2">Trip details</p>

    <div class="trip-details">
        <table width="100%" class="trip" >
            <thead class="trip" >
            <tr class="trip">
                <td class="tripheader" style="width:15%">Departure</td>
                <td class="tripheader" style="width:30%">From</td>
                <td class="tripheader" style="width:15%">Arrival</td>
                <td class="tripheader" style="width:30%">To</td>
                <td class="tripheader" style="width:10%">Flight</td>
            </tr>
            </thead>
            <tbody class="trip" >
            {{#each segments}}
            <tr>
                <td class="tripcell">{{departureDate}}<br/><strong>{{departureTime}}</strong></td>
                <td class="tripcell">{{origin}}</td>
                <td class="tripcell">{{arrivalDate}}<br/><strong>{{arrivalTime}}</strong></td>
                <td class="tripcell">{{destination}}</td>
                <td class="tripcell">{{flightNumber}}</td>
            </tr>
            {{/each}}
            </tbody>
        </table>
    </div>

    {{/if}}
    {{#if totalPrice}}
    <p class="sizeh2">Purchase summary</p>
    Total price: {{totalPrice}}
    {{/if}}
</div>`;

        it('should prepare correct HTML for flight booking', () => {
            let templateData = prepareEmailTemplateInput(flightConfirmation_2ADT1CHD_Return, "PAX1")[0];
            let templateEng = Handlebars.compile(template);
            console.log(templateEng(templateData));
        })
        it('should prepare correct HTML for hotel booking', () => {
            let templateData = prepareEmailTemplateInput(hotelConfirmation_1ADT, "PAX1")[0];
            templateEng = Handlebars.compile(template);
            console.log(templateEng(templateData));
        })

    })

});


