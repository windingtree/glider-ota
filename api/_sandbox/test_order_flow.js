const fetch = require('node-fetch');
const _ = require('underscore');
let META = {orig: 'CDG', dest: 'PRG', 'departureTime': '2020-06-14T00:00:00Z'};
const SEARCH_OFFERS_URL = 'http://localhost:3000/api/searchOffers';
const CREATE_WITH_OFFER_URL = 'http://localhost:3000/api/createWithOffer';
const CHECKOUT_URL = 'http://localhost:3000/api/checkoutUrl';

function createHTTPRequest(payload){
    let requestInfo = {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
            'cookie':'wt-ota-session-id=DUMMY-SESSIONID;'
        },

        redirect: 'follow',
        referrerPolicy: 'no-referrer',
        body: JSON.stringify(payload)
    };
    return requestInfo;
}
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
    return criteria;

}

async function searchOffers(criteria) {
    let request = createHTTPRequest(criteria);
    console.log("/serachOffers criteria:", JSON.stringify(criteria));
    return fetch(SEARCH_OFFERS_URL, request)
        .then(function (res) {
            return res.json()
        })
        .then(function (data) {
            console.debug('Search results arrived:', JSON.stringify(data));
            return data;
        }).catch(function (err) {
            console.error('Search failed', err);
        })
}

async function createWithOffer(criteria) {
    let request = createHTTPRequest(criteria);
    console.log("/createWithOffer criteria:", JSON.stringify(criteria))
    return fetch(CREATE_WITH_OFFER_URL, request)
        .then(function (res) {
            console.debug('Order arrived - convert to json')
            return res.json()
        })
        .then(function (data) {
            console.debug('Order arrived:',JSON.stringify(data))
            return data;
        }).catch(function (err) {
            console.error('Create order failed', err)
        })
}


async function checkout(criteria) {
    let request = createHTTPRequest(criteria);
    console.log("/checkout criteria:", JSON.stringify(criteria))
    return fetch(CHECKOUT_URL, request)
        .then(function (res) {
            console.debug('Checkout response arrived - convert to json')
            return res.json()
        })
        .then(function (data) {
            console.debug('Checkout response arrived:',JSON.stringify(data))
            return data;
        }).catch(function (err) {
            console.error('Checkout failed', err)
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
        "offerId": offer.offerId,
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

function createCheckoutRequest(order){
    return {
        type:'card',
        orderId:order.orderId
    }
}

async function flow() {
    let request = createSearchRequest(META);
    let searchResults = await searchOffers(request);
    let offer = takeFirstOffer(searchResults.offers);
    let orderRequest = createOrderRequest(offer);
    let orderResponse = await createWithOffer(orderRequest);
    let checkoutRequest = createCheckoutRequest(orderResponse);
    let checkoutResponse = await checkout(checkoutRequest);
    console.log("Checkout response:", checkoutResponse)
}

flow();