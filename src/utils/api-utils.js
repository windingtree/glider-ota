import  {stringify}  from 'query-string';
import {config} from "../config/default";

/**
 * Common functions to be used to interact with Glider OTA backend, such as:
 * <ul>
 *     <li>add/retrieve items from shopping cart</li>
 *     <li>retrieve seatmap</li>
 *     <li>store seat selection</li>
 *     <li>store passenger details</li>
 *     <li>cart checkout</li>
 * </ul>
 * @module utils/api-utils
 */

/**
 * Wrapper for all kinds of errors/exceptions thrown while retrieving data from Glider OTA backend (derived from Error object)
 * @param message
 * @param response
 * @returns {Error}
 * @constructor
 */

function ApiFetchException(message,response) {
  const error = new Error(message);
  error.response=response;
  return error;
}

ApiFetchException.prototype = Object.create(Error.prototype);

/**
 * Function to be used to fetch data from the backend using GET
 * @param url
 * @param params
 * @returns {Promise<*>}
 * @throws {ApiFetchException}
 */
export async function fetchGet(url,params){
  let queryString = stringify(params);
  let options = {
    method: 'GET',
    headers: {
      'Content-type': 'application/json'
    }
  }
  let urlWithQueryString = url;
  if(queryString.length>0)
    urlWithQueryString+='?'+queryString;
  let results;
  try {
    results = await fetch(urlWithQueryString, options);
    results = await results.json();
  }catch(error){
    throw new ApiFetchException("Failed to retrieve data from server")
  }
  if(results.error){
    throw new ApiFetchException("Error while fetching data from server",results)
  }
  return results;
}

/**
 * Function to be used to fetch data from the backend using POST
 * @param url
 * @param payload
 * @returns {Promise<*>}
 * @throws ApiFetchException
 */
export async function fetchPost(url,payload){
  let options = {
    method: 'POST',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify(payload),
  };
  let results;
  try {
    results = await fetch(url, options);
    results = await results.json();
  }catch(error){
    throw new ApiFetchException("Failed to retrieve data from server");
  }
  if(results.error){
    throw new ApiFetchException("Error while fetching data from server",results);
  }
  return results;
}

///////////////// PASSENGERS //////////////////////

/**
 * Store passenger contact details in session (for booking creation purpose)
 * @param passengers
 * @returns {Promise<*>}
 * @example <caption>Example request</caption>
{
  "passengers":[
  {
    "passenger_id":"PAX1",
    "type": "ADT",
    "civility": "MR",
    "lastname": "Smith",
    "firstname": "John",
    "gender": "Male",
    "birthdate": "1980-01-01T00:00:00Z",
    "email": "test@test.com",
    "phone":"+48123456789"
  }
]
}

 */
export async function storePassengerDetails(passengers){
  return fetchPost('/api/cart/passengers',{passengers:passengers});
}

/**
 * Retrieve passenger contact details from session
 * @returns {Promise<*>}
 */

export async function retrievePassengerDetails(){
  return fetchGet('/api/cart/passengers',{});
}

///////////////// SHOPPING CART //////////////////////

/**
 * Use this to store offer that user selected. It will be stored in session (server side/cart) for later usage/booking creation
 * @param selectedOffer
 * @returns {Promise<*>}
 * @example <caption>Sample request</caption>
{
"offer": {
  "offerId": "a14add45-2ce6-4ac6-a606-cd16b6d22b27",
  "offerItems": {
      "HMUQY6T8RJ-OfferItemID-1": {
          "passengerReferences": "DBE33D49"
      }
  },
  "expiration": "2020-05-12T05:23:07.873Z",
  "pricePlansReferences": {
      "GDNP3ZKXFU-Flex": {
          "flights": [
              "RL29Y9GC48-OD1"
          ]
      }
  },
  "price": {
      "currency": "CAD",
      "public": "1828.36",
      "commission": "0.00",
      "taxes": "45.42"
  }
}
}
 */
export async function storeSelectedOffer(selectedOffer){
  return fetchPost('/api/cart/offer',{offer:selectedOffer});
}

/**
 * Retrieve selected offer from session
 * @returns {Promise<*>}
 */
export async function retrieveSelectedOffer(){
  return fetchGet('/api/cart/offer',{});
}


/**
 * Store selected hotel accommodation offer in session.
 *
 * @param selectedOffer
 * @returns {Promise<*>}
 */
export async function storeSelectedAccommodation(selectedOffer){
  return fetchPost('/api/cart/accommodation',{offer:selectedOffer});
}

///////////////// SEATMAP //////////////////////

/**
 * Retrieve seatmap for an offer
 * @returns {Promise<*>}
 */
export async function retrieveSeatmap() {
  return fetchGet('/api/seatmap', {});
};


/**
 * Store seat selection
 * @param selectedSeats
 * @returns {Promise<*>}
 */
export async function addSeats(selectedSeats){
  return fetchPost('/api/cart/seats', selectedSeats);
}

///////////////// REPRICE //////////////////////

/**
 * Use this function to get a fare quote for offer and selected options (such as seats, ancillaries, etc).
 * <br/> Price that is returned in search results is not a final, binding fare. It may change once user adds additional items (e.g. seats), thus such a call is mandatory to get a final price.
 * @returns {Promise<*>}
 */
export async function repriceShoppingCartContents(){
  return fetchPost('/api/cart/reprice',{});
}

///////////////// CHECKOUT //////////////////////
/**
 * This function initiates payment process. It creates a payment intent (with Stripe API)
 * @param confirmedOfferId
 * @param type
 * @returns {Promise<*>}
 */
export async function createPaymentIntent(confirmedOfferId,type){
  return fetchPost('/api/order/checkout',{type:type,confirmedOfferId:confirmedOfferId});
}

export async function getStripePublicKey() {
  return fetchPost('/api/order/key', {});
}


///////////////// ORDER CONFIRMATION //////////////////////
/**
 * Retrieve status of an order (payment status and ticketing status separately)
 * @param confirmedOfferId
 * @returns {Promise<*>}
 */
export async function getOrderStatus(confirmedOfferId){
  return fetchPost('/api/order/status',{offerId:confirmedOfferId});
}

export function executionTimeCheck(taskName, callback) {
  let start = Date.now();
  try {
    callback()
  } finally {
    let end = Date.now();
    console.log(`Task:${taskName}, Execution time:${end - start}ms`);
  }
}
