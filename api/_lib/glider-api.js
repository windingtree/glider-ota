const {createLogger} = require('./logger');
const _ = require('lodash');
const axios = require('axios').default;
const {GLIDER_CONFIG} = require('./config');
const {storeOffersMetadata} = require('./model/offerMetadata');
const logger = createLogger('aggregator-api');
const {enrichResponseWithDictionaryData, setDepartureDatesToNoonUTC, increaseConfirmedPriceWithStripeCommission} = require('./response-decorator');
const {createErrorResponse,mergeAggregatorResponse, ERRORS} = require ('./rest-utils');
const OrgId= require('./orgId');
const SEARCH_TIMEOUT=1000*50;

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
    let response;
    if (criteria.itinerary)
        setDepartureDatesToNoonUTC(criteria)
    logger.debug(`Search criteria:${JSON.stringify(criteria)}`);

    let availableAPIsURLs = await OrgId.getEndpoints(criteria);

    try {
        const searchPromises = availableAPIsURLs.map(endpoint=>{
            return searchOffersUsingEndpoint(criteria,endpoint,SEARCH_TIMEOUT);
        })
        const allSearchResults = await Promise.all(searchPromises.map(p => p.catch(e => e)));
        let validResults = allSearchResults.filter(result => (!(result instanceof Error)));
        await storeOfferToOrgIdMapping(validResults)


        if (validResults.length === 0) {
            throw new Error('No results.')
        } else{
            response = mergeAggregatorResponse(validResults)
        }

    }catch(err){
        logger.error("Error ",err)
        return createErrorResponse(400,ERRORS.INVALID_SERVER_RESPONSE,err.message,criteria);
    }
    let searchResults = [];
    if(response && response.data) {
        searchResults = response.data;
        enrichResponseWithDictionaryData(searchResults)
    }else{
        logger.info("Response from /searchOffers API was empty, search criteria:", criteria)
    }
    return searchResults;
}

const storeOfferToOrgIdMapping = async (validResults) => {
    let offersMetadata = [];
    validResults.forEach(result => {
        let {endpoint, data} = result;
        let offers = data.offers;
        let passengers = data.passengers;
        Object.keys(offers).forEach(offerId=>{
            let offerMetadata = {
                endpoint:endpoint,
                offerId:offerId,
                passengers:passengers
            }
            offersMetadata.push(offerMetadata)
        })
    })
    await storeOffersMetadata(offersMetadata);
}

async function searchOffersUsingEndpoint (criteria, endpoint, timeout) {
    const {serviceEndpoint, jwt} = endpoint;
    let url = urlFactory(serviceEndpoint).SEARCH_OFFERS_URL;
    console.log('Searching with URL:',url, 'JWT:',jwt)
    console.log('JWT:',jwt)

    let response = await axios({
            method: 'post',
            url: url,
            data: criteria,
            headers: createHeaders(jwt),
            timeout:timeout
        });
    response.endpoint=endpoint; //store this so that we know from which endpoint results arrived
    return response;
}



/**
 * Create offer in Glider API
 * @param criteria- request to be passed to /createWithOffer API
 * @returns {Promise<any>} response from Glider
 */
async function createWithOffer(criteria, endpoint) {
    const {serviceEndpoint, jwt} = endpoint;
    let url = urlFactory(serviceEndpoint).CREATE_WITH_OFFER_URL;
    console.log('Creating order with URL:',url, 'JWT:',jwt)
    console.log('JWT:',jwt)

    let response = await axios({
        method: 'post',
        url: url,
        data: criteria,
        headers: createHeaders(jwt)
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

const urlFactory = (baseUrl, param) => {
    return {
        SEARCH_OFFERS_URL: baseUrl + "/offers/search",
        CREATE_WITH_OFFER_URL: baseUrl + "/orders/createWithOffer",
        SEATMAP_URL: baseUrl + "/offers/{offerId}/seatmap",
        REPRICE_OFFER_URL: baseUrl + "/offers/{offerId}/price",
        FULFILL_URL: baseUrl + "/orders/{orderId}/fulfill",
    }
}

module.exports = {
    createWithOffer,
    searchOffers,
    fulfill,
    reprice,
    seatmap,
};
