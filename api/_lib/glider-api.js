const {createLogger} = require('./logger');
const _ = require('lodash');
const axios = require('axios').default;
const {GLIDER_CONFIG} = require('./config');
const logger = createLogger('aggregator-api');
const {enrichResponseWithDictionaryData, setDepartureDatesToNoonUTC, increaseConfirmedPriceWithStripeCommission} = require('./response-decorator');
const {createErrorResponse, mergeAggregatorResponse, ERRORS} = require('./rest-utils');

function createHeaders(token) {
    return {
        'Authorization': 'Bearer ' + token,
        'accept': 'application/json',
        'Content-Type': 'application/json'
    }
}

/*
axios.interceptors.request.use(request => {
    console.log('Axios request', JSON.stringify(request.data))
    return request
})

axios.interceptors.response.use(response => {
    console.log('Axios response:', response)
    return response
})
*/

//helper to detect which endpoints failed
const search = async (url, criteria, token) => {

    let results;
    try {
        results = await axios({
            method: 'post',
            url: url,
            data: criteria,
            headers: createHeaders(token)
        })
        if (results && results.data && results.data.offers) {
            console.log(`Received ${Object.keys(results.data.offers).length} offers from ${url}`)
        } else {
            console.warn(`No data received from ${url}`);
        }
    } catch (err) {
        console.log(`Exception while searching ${url}, error:${err}`);
        throw err;
    }
    return results;
}


/**
 * Search for offers using Glider API
 * @param criteria - request to be passed to /searchOffers API
 * @returns {Promise<any>} response from Glider
 */
async function searchOffers(criteria) {
    let response;
    if (criteria.itinerary)
        setDepartureDatesToNoonUTC(criteria)
    logger.debug(`Search criteria:${JSON.stringify(criteria)}`);
    try {
        let promises = []
        if (criteria.accommodation) {
            //search for hotels
            console.log(`GLIDER_CONFIG.ENABLE_ROOMS_SEARCH = ${GLIDER_CONFIG.ENABLE_ROOMS_SEARCH}`)
            console.log(`GLIDER_CONFIG.ROOMS_SEARCH_OFFERS_URL = ${GLIDER_CONFIG.ROOMS_SEARCH_OFFERS_URL}`)
            console.log(`GLIDER_CONFIG.ROOMS_TOKEN = ${GLIDER_CONFIG.ROOMS_TOKEN}`)
            if (GLIDER_CONFIG.ENABLE_ROOMS_SEARCH !== 'yes') {
                promises.push(search(GLIDER_CONFIG.SEARCH_OFFERS_URL, criteria, GLIDER_CONFIG.GLIDER_TOKEN));
            } else {
                // promises.push(search(GLIDER_CONFIG.SEARCH_OFFERS_URL, criteria, GLIDER_CONFIG.GLIDER_TOKEN));
                promises.push(search(GLIDER_CONFIG.ROOMS_SEARCH_OFFERS_URL, criteria, GLIDER_CONFIG.ROOMS_TOKEN));
            }
        }
        if (criteria.itinerary) {
            //search for flights
            promises.push(search(GLIDER_CONFIG.SEARCH_OFFERS_URL, criteria, GLIDER_CONFIG.GLIDER_TOKEN));
        }


        const results = await Promise.all(promises.map(p => p.catch(e => e)))
        const validResults = results.filter(result => !(result instanceof Error))

        if (validResults.length === 0) {
            throw new Error('No results.')
        } else if (validResults.length === 1) {
            response = validResults[0]
        } else {
            response = mergeAggregatorResponse(validResults[0], validResults[1])
        }
    } catch (err) {
        logger.error("Error ", err)
        return createErrorResponse(400, ERRORS.INVALID_SERVER_RESPONSE, err.message, criteria);
    }
    let searchResults = [];
    if (response && response.data) {
        searchResults = response.data;
        enrichResponseWithDictionaryData(searchResults)
    } else {
        logger.info("Response from /searchOffers API was empty, search criteria:", criteria)
    }
    return searchResults;
}


/**
 * Create offer in Glider API
 * @param criteria- request to be passed to /createWithOffer API
 * @returns {Promise<any>} response from Glider
 */
async function createWithOffer(criteria) {
    let response = await axios({
        method: 'post',
        url: GLIDER_CONFIG.CREATE_WITH_OFFER_URL,
        data: criteria,
        headers: createHeaders(GLIDER_CONFIG.GLIDER_TOKEN)
    });
    return response.data;
}

/**
 * Retrieve seatmap for an offer using Glider API
 * @param offerId - offerId(s) for which the seatmaps are requested
 * @returns {Promise<any>} response from Glider
 */
async function seatmap(offerId) {
    let urlTemplate = GLIDER_CONFIG.SEATMAP_URL;
    let urlWithOfferId = urlTemplate.replace("{offerId}", offerId);
    logger.debug("Seatmap URL:[%s]", urlWithOfferId);
    let response = await axios({
        method: 'get',
        url: urlWithOfferId,
        headers: createHeaders(GLIDER_CONFIG.GLIDER_TOKEN)
    });
    logger.debug("Seatmap response", response.data);
    return response.data;
}


/**
 * Create offer in Glider API
 * @param offerId - offerID to be repriced
 * @returns {Promise<any>} response from Glider
 */
async function reprice(offerId, options) {
    let urlTemplate = GLIDER_CONFIG.REPRICE_OFFER_URL;
    let urlWithOfferId = urlTemplate.replace("{offerId}", offerId);
    logger.debug("Reprice URL:[%s], options=%s", urlWithOfferId, JSON.stringify(options));
    let response = await axios({
        method: 'post',
        url: urlWithOfferId,
        headers: createHeaders(GLIDER_CONFIG.GLIDER_TOKEN),
        data: options ? options : [],
    });
    let repriceResponse = {};
    if (response && response.data) {
        repriceResponse = response.data;
        increaseConfirmedPriceWithStripeCommission(repriceResponse)
    }
    logger.debug("Reprice response", repriceResponse);
    return response.data;
}


/**
 * Fulfills an order in Glider
 * @param orderId - ID of a previously created order in Glider
 * @param orderItems
 * @param passengers
 * @param guaranteeId - guaranteeId previously created with Simard API
 * @returns {Promise<any>} - booking confirmation, response from Glider /orders/.../fulfill API
 */
async function fulfill(orderId, orderItems, passengers, guaranteeId) {
    let request = createFulfilmentRequest(orderItems, passengers, guaranteeId)
    let urlTemplate = GLIDER_CONFIG.FULFILL_URL;
    let urlWithOrderId = urlTemplate.replace("{orderId}", orderId);
    logger.debug("Fulfillment URL:[%s]", urlWithOrderId);
    let response = await axios({
        method: 'post',
        url: urlWithOrderId,
        data: request,
        headers: createHeaders(GLIDER_CONFIG.GLIDER_TOKEN)
    });
    return response.data;
}


function createFulfilmentRequest(orderItems, passengers, guaranteeId) {
    let passengerReferences = [];
    _.each(passengers, (rec, key) => {
        passengerReferences.push(key)
    })

    return {
        orderItems: orderItems,
        passengerReferences: passengerReferences,
        guaranteeId: guaranteeId
    }
}


module.exports = {
    createWithOffer,
    searchOffers,
    fulfill,
    reprice,
    seatmap,
}

