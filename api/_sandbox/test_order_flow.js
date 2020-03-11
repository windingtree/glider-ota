const fetch = require('node-fetch');
const _ = require('underscore');
let response = require('./results.json');
let META = {orig: 'CDG', dest: 'PRG', 'departureTime': '2020-06-14T00:00:00Z'};
const SEARCH_OFFERS_URL = 'http://localhost:3000/api/searchOffers';
const CREATE_WITH_OFFER_URL = 'http://localhost:3000/api/createWithOffer';


function createSearchRequest(params) {
    let criteria = {
        "itinerary": {
            "segments": [
                {
                    "origin": {
                        "locationType": "airport",
                        "iataCode": params.orig
                    },
                    "destination": {
                        "locationType": "airport",
                        "iataCode": params.dest
                    },
                    "departureTime": params.departureTime
                }
            ]
        },
        "passengers": [
            {
                "type": "ADT",
                "count": 1
            }
        ]
    }

    let requestInfo = {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json'
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
        body: JSON.stringify(criteria)
    };
    return requestInfo;

}

async function fetchOffers(request) {
    return await fetch(SEARCH_OFFERS_URL, request)
        .then(function (res) {
            return res.json()
        })
        .then(function (data) {
            console.debug('Search results arrived')
            return data;
        }).catch(function (err) {
            console.error('Search failed', err)
        })
}

async function createOrder(request) {
    return await fetch(CREATE_WITH_OFFER_URL, request)
        .then(function (res) {
            return res.json()
        })
        .then(function (data) {
            console.debug('Order arrived')
            return data;
        }).catch(function (err) {
            console.error('Search failed', err)
        })
}

function takeFirstOffer(offers) {
    let result = undefined;
    _.each(offers, (offer, id) => {
        if (!result) {
            result = offer;
            result.offerId = id;
        }
    })
    return result
}

function createOrderRequest(offer) {
    return {
        "offerId": offer,
        "offerItems": offer.offerItems,
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
                "birthdate": "1980-03-21T00:00:00Z",
                "contactInformation": [
                    "+32123456789",
                    "contact@org.co.uk"
                ]
            }
        }
    }
}

let request = createSearchRequest(META);

/*fetchOffers(request).then(data=>{
    console.log("done with results")
    console.log(JSON.stringify(data))
});*/

let offer = takeFirstOffer(response.offers);
let orderRequest = createOrderRequest(offer);
createOrder(orderRequest).then(data => {
    console.log("Order created:", JSON.stringify(data))
}).catch(function (err) {
    console.error('Order creation failed', err)
})


