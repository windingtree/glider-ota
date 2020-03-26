const {createLogger} = require('./logger');
const _ = require('lodash');
const axios = require('axios').default;
const {GLIDER_CONFIG} = require('../../config');
const logger = createLogger('aggregator-api');


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
 * Fulfills an order in Glider
 * @param orderId - ID of a previously created order in Glider
 * @param orderItems
 * @param passengers
 * @param guaranteeId - guaranteeId previously created with Simard API
 * @returns {Promise<any>} - booking confirmation, response from Glider /orders/.../fulfill API
 */
async function fulfill(orderId,orderItems,passengers, guaranteeId) {
    let request = createFulfilmentRequest(orderItems,passengers,guaranteeId)
    logger.debug("Creating fulfillment for order:%s, request:%s",orderId,JSON.stringify(request));
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


module.exports = {
    createWithOffer, searchOffers, fulfill
}

