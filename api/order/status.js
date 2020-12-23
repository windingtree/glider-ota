const {BOOKEABLE_ITEMS_IN_CART} = require("../_lib/shopping-cart");
const {createLogger} = require('../_lib/logger')
const {decorate} = require('../_lib/decorators');
const {sendErrorResponse,ERRORS} = require("../_lib/rest-utils")
const {findConfirmedOffer} = require('../_lib/mongo-dao');
const logger = createLogger('/checkoutUrl')

const checkOrderStatusController = async (req, res) => {
    let offerId=req.body.offerId;
    //TODO add additional check (e.g. sessionID vs orderID)
    // logger.info("Checking masterOrderStatus status, offerId:%s", offerId)
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

    let masterOrderStatus = createOrderStatus(document, true);
    const confirmedOffer = document.confirmedOffer;
    const cartItems = confirmedOffer.cartItems;
    let subOffersStatuses = {}
    for(let key of BOOKEABLE_ITEMS_IN_CART){
        if (cartItems[key]) {
            const item = cartItems[key].item;
            const offerId = item.offerId;
            let order = await findConfirmedOffer(offerId);
            let status = createOrderStatus(order, false);
            subOffersStatuses[key] = status;
        }
    }
    masterOrderStatus.subOffers=subOffersStatuses;


    res.json(masterOrderStatus);
}


const createOrderStatus = (document, isMaster) => {
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
    if (!isMaster && document.confirmation) {
        order.confirmation = document.confirmation;
    }
    return order;
}
module.exports = decorate(checkOrderStatusController);
