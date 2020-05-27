const {createLogger} = require('./logger');
const _ = require('lodash');
const axios = require('axios').default;
const {GLIDER_CONFIG} = require('../../config');
const logger = createLogger('aggregator-api');
const {enrichResponseWithDictionaryData} = require('./response-decorator');


function createHeaders(token) {
    return {
        'Authorization': 'Bearer ' + token,
        'accept': 'application/json',
        'Content-Type': 'application/json'
    }
}

/**
 * Search for offers using Glider API
 * @param criteria - request to be passed to /searchOffers API
 * @returns {Promise<any>} response from Glider
 */
async function searchOffers(criteria) {
    let response = await axios({
        method: 'post',
        url: GLIDER_CONFIG.SEARCH_OFFERS_URL,
        data: criteria,
        headers: createHeaders(GLIDER_CONFIG.GLIDER_TOKEN)
    });
    let searchResults = response.data;
    try {
        enrichResponseWithDictionaryData(searchResults)
    }catch(error){
        logger.error("Failed to enrich search results with dictionary data:%s",error.message,error);
        throw new Error("Failed to enrich search results with dictionary data");
    }
    return response.data;
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
    let urlTemplate=GLIDER_CONFIG.SEATMAP_URL;
    let urlWithOfferId = urlTemplate.replace("{offerId}",offerId);
    logger.debug("Seatmap URL:[%s]",urlWithOfferId);
    let response = await axios({
        method: 'get',
        url: urlWithOfferId,
        headers: createHeaders(GLIDER_CONFIG.GLIDER_TOKEN)
    });
    logger.debug("Seatmap response",response.data);
    return response.data;
}


/**
 * Create offer in Glider API
 * @param offerId - offerID to be repriced
 * @returns {Promise<any>} response from Glider
 */
async function reprice(offerId, options = []) {
    let urlTemplate=GLIDER_CONFIG.REPRICE_OFFER_URL;
    let urlWithOfferId = urlTemplate.replace("{offerId}",offerId);
    logger.debug("Reprice URL:[%s], options=%s",urlWithOfferId, JSON.stringify(options));
    let response = await axios({
        method: 'post',
        url: urlWithOfferId,
        headers: createHeaders(GLIDER_CONFIG.GLIDER_TOKEN),
        data : options,
    });
    logger.debug("Reprice response",response.data);
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
async function fulfill(orderId,orderItems,passengers, guaranteeId) {
    let request = createFulfilmentRequest(orderItems,passengers,guaranteeId)
    let urlTemplate=GLIDER_CONFIG.FULFILL_URL;
    let urlWithOrderId = urlTemplate.replace("{orderId}",orderId);
    logger.debug("Fulfillment URL:[%s]",urlWithOrderId);
    let response = await axios({
        method: 'post',
        url: urlWithOrderId,
        data: request,
        headers: createHeaders(GLIDER_CONFIG.GLIDER_TOKEN)
    });
    return response.data;
}


function createFulfilmentRequest(orderItems,passengers,guaranteeId){
    let passengerReferences=[];
    _.each(passengers, (rec,key)=>{
        passengerReferences.push(key)
    })

    return {
        orderItems:orderItems,
        passengerReferences:passengerReferences,
        guaranteeId:guaranteeId
    }
}



function addAirports(){}

module.exports = {
    createWithOffer,
    searchOffers,
    fulfill,
    reprice,
    seatmap,
}

