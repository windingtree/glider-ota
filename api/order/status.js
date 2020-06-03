const {createLogger} = require('../_lib/logger')
const {decorate} = require('../_lib/decorators');
const {sendErrorResponse,ERRORS} = require("../_lib/rest-utils")
const {findConfirmedOffer} = require('../_lib/mongo-dao');
const logger = createLogger('/checkoutUrl')
const DEV_MODE=true;

const checkOrderStatusController = async (req, res) => {
    let offerId=req.body.offerId;
    //TODO add additional check (e.g. sessionID vs orderID)
    logger.info("Checking order status, offerId:%s", offerId)
    if (offerId === undefined) {
        logger.warn("Missing offerId");
        sendErrorResponse(res,400,ERRORS.INVALID_INPUT,"Missing offerId",req.body);
        return;
    }
/*
    if(DEV_MODE) {
        res.json({
            orderId: orderId,
            status: 'confirmed',
            bookingConfirmation: 'ABCDEF',
            ticketNumber: '0123123123123'
        });
        return;
    }*/

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
    };
    if(document.confirmation) {
        order.confirmation = document.confirmation;
    }
    res.json(order);
}

module.exports = decorate(checkOrderStatusController);
