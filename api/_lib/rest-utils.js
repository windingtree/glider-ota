const ERRORS={
    REQUEST_TIMEOUT:500,
    INVALID_METHOD:'INVALID_METHOD',
    INVALID_INPUT:'INVALID_INPUT',
    VALIDATION_ERROR:'VALIDATION_ERROR',
    INVALID_SERVER_RESPONSE:'INVALID_SERVER_RESPONSE',
    INTERNAL_SERVER_ERROR:'INTERNAL_SERVER_ERROR',
}

function error(){

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
async function getRawBodyFromRequest(request) {
    let bodyChunks = [];
    let p = new Promise(function (resolve, reject) {
        request.on('data', (chunk) => {
            bodyChunks.push(chunk);
        });
        request.on('end', () => {
            const rawBody = Buffer.concat(bodyChunks).toString('utf8');
            resolve(rawBody)
            // console.log("Raw body:",rawBody)
        })
        request.on('error', (error) => {
            logger.error("Problem extracting raw body from request, error:%d", error.message)
            reject(error)
        })
    })
    return p
}


module.exports={ERRORS,createErrorResponse,sendErrorResponse,getRawBodyFromRequest}