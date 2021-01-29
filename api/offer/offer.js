const {getOfferMetadata} = require('../_lib/models/offerMetadata');
const {sendErrorResponse, ERRORS} = require("../_lib/rest-utils")
const logger = require('../_lib/logger').createLogger('/offer')
const {decorate} = require('../_lib/decorators');

const offer = async (req, res) => {
    let method = req.method;
    if (method === 'GET') {
        let offerId = req.query.offerId;
        if (!offerId) {
            logger.warn("Missing mandatory offerId parameter");
            sendErrorResponse(res, 400, ERRORS.INVALID_INPUT, "Missing offerId parameter");
            return;
        }

        let offerMetadata;
        try {
            offerMetadata = await getOfferMetadata(offerId)
        }catch(err){
            logger.warn(`Failed to retrieve offer details for offerId:${offerId}`);
            sendErrorResponse(res, 400, ERRORS.INVALID_SERVER_RESPONSE, `Failed to retrieve offer details for offerId:${offerId}`);
            return;
        }

        if(!offerMetadata){
            sendErrorResponse(res, 400, ERRORS.INVALID_INPUT, `Offer not found`);
            return;
        }
        //FIXME - to be on a safer side we should only expose selected properties
        delete offerMetadata.endpoint;
        res.json(offerMetadata);
    } else {
        logger.warn("Unsupported method:%s", req.method);
        sendErrorResponse(res, 400, ERRORS.INVALID_METHOD, "Unsupported request method");
    }

}

module.exports = decorate(offer);

