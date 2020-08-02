const {createLogger} = require('../_lib/logger')
const {decorate} = require('../_lib/decorators');
const {sendErrorResponse,ERRORS} = require("../_lib/rest-utils")
const {findConfirmedOffer} = require('../_lib/mongo-dao');
const logger = createLogger('/checkoutUrl')
const DEV_MODE=true;
/**
 * @module endpoint /order/status
 */

/**
 *  /order/status endpoint handler
 *  <p/>This endpoint is used to check what is the status of an order (either hotel or flight booking).
 *  <br/>Payment processing and ticket creation is a time consuming process. This endpoint is used to poll the status of order creation process (status of payment and ticketing separately)
 *  @async
 */

const orderStatusController = async (req, res) => {
    let offerId=req.body.offerId;
    //TODO add additional check (e.g. sessionID vs orderID)
    logger.info("Checking order status, offerId:%s", offerId)
    if (offerId === undefined) {
        logger.warn("Missing offerId");
        sendErrorResponse(res,400,ERRORS.INVALID_INPUT,"Missing offerId",req.body);
        return;
    }

    let document = await findConfirmedOffer(offerId);
    if (!document) {
        logger.warn("Cannot find confirmed offer, orderId:%s", offerId);
        sendErrorResponse(res,400,ERRORS.INVALID_INPUT,"Offer not found",req.body);
        return;
    }

    // Return a subset of the order to avoid leaking sensitive information
    let order = {
        payment_status: document.payment_status,
        payment_details: document.payment_details,
        order_status: document.order_status,
        history: document.transactions && document.transactions.map(transaction => {
            return {
                comment: transaction.comment,
                timestamp: transaction.transactionTime,
            }
        }),
    };
    if(document.confirmation) {
        order.confirmation = document.confirmation;
    }
    res.json(order);
}

module.exports = decorate(orderStatusController);
