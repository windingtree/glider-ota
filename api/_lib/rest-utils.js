const REST_ERROR_CODES={
    REQUEST_TIMEOUT:500,
}

function error(){

}


function createErrorResponse(error_code , message, description, payload={}){
    return {
        error:message,
        error_code:error_code,
        error_message:message,
        error_description:description,
        payload:payload
    }
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


module.exports={REST_ERROR_CODES,createErrorResponse,getRawBodyFromRequest}