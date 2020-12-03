const _ = require('lodash');

const ERRORS={
    REQUEST_TIMEOUT:500,
    INVALID_METHOD:'INVALID_METHOD',
    INVALID_INPUT:'INVALID_INPUT',
    VALIDATION_ERROR:'VALIDATION_ERROR',
    INVALID_SERVER_RESPONSE:'INVALID_SERVER_RESPONSE',
    INTERNAL_SERVER_ERROR:'INTERNAL_SERVER_ERROR',
}

class GliderError extends Error {
    constructor (...args) {
        super(args[0]);
        this.status = args[1] || 500;
        if (args[2]) {
            this.code = args[2];
        }
    }
}


/**
 * Utility to be used to create an error response from API call
 * @param http_status Mandatory HTTP status code (e.g. 404)
 * @param error_code Mandatory error code (e.g. INVALID_INPUT)
 * @param error_description Additional (optional) description of an error (e.g. Invalid value of parameter X was provided)
 * @param payload Additional data related to the error (optional)
 * @returns {{payload: {}, description: *, error: *}}
 */
function createErrorResponse(http_status, error_code , error_description = '', payload=undefined){
    return {
        http_status:http_status,
        error:error_code,
        description:error_description,
        payload:payload
    }
}

/**
 * Same as {@link createErrorResponse} but this sends response to the client with appropriate HTTP status code.
 * @param response HTTP Response to be used to reply to the client
 * @param http_status Mandatory HTTP status code (e.g. 404)
 * @param error_code Mandatory error code (e.g. INVALID_INPUT)
 * @param error_description Additional (optional) description of an error (e.g. Invalid value of parameter X was provided)
 * @param payload Additional data related to the error (optional)
 */
function sendErrorResponse(response, http_status, error_code , error_description = '', payload=undefined) {
    let error = createErrorResponse(http_status,error_code,error_description,payload);
    response.statusCode = error.http_status;
    response.json(error);
}
/**
 * Extracts raw body from request.
 * Zeit provides only request object and already parsed body (as a json) but Stripe requires raw body to be provided in order to validate signature.
 * This function extracts raw body from request
 * @param request
 * @returns {Promise<unknown>}
 */
function getRawBodyFromRequest(request) {
    return new Promise(function (resolve, reject) {
        let bodyChunks = [];

        request.on('data', (chunk) => {
            bodyChunks.push(chunk);
        });

        request.on('end', () => {
            const rawBody = Buffer.concat(bodyChunks).toString('utf8');
            resolve(rawBody)
            // console.log("Raw body:",rawBody)
        })

        request.on('error', (error) => {
            //logger.error("Problem extracting raw body from request, error:%d", error.message)
            reject(error)
        })
    });
}

/**
 * Quickly check an Axios response from a Hotel search query.
 * See if response contains data property, and check that key properties are defined.
 *
 * @param response
 *
 * @returns {boolean} True is all is OK. False if something is missing.
 */
function dirtyAggregatorResponseValidator(response) {
    if (!response || !response.data || (typeof response.data !== 'object')) {
        return false
    }
    return true;
}
/**
 * Combines multiple Axios responses from Hotel/Flight search queries. Only combine if both
 * responses are potentially populated with data.
 *
 * @param responses
 * @param propsToMerge
 *
 * @returns {response} The merged response.
 */
function mergeAggregatorResponse(responsesToMerge) {
    const response = { data: {} };
    if(!responsesToMerge)
        return response;

    const propsToMerge = ['accommodations', 'pricePlans', 'offers', 'passengers', 'itineraries']

    responsesToMerge.forEach(responseToMerge=>{
        let isValid = dirtyAggregatorResponseValidator(responseToMerge);
        if(!isValid)
            console.log('Not valid:');
        if(isValid){
            propsToMerge.forEach((prop) => {
                response.data[prop] = {}
                _.merge(response.data[prop], responseToMerge.data[prop])
            })
        }
    })
    return response;
}

module.exports={ERRORS,createErrorResponse,mergeAggregatorResponse,sendErrorResponse,getRawBodyFromRequest, GliderError}
