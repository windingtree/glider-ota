const {createPaymentIntent, convertPriceToMinorUnits,convertPriceToMajorUnits,PAYMENT_TYPES} = require('./_lib/stripe-api');
const {createLogger} = require('./_lib/logger')
const {SessionStorage} = require('./_lib/session-storage');
const {decorate} = require('./_lib/decorators');
const {storeOrder} = require('./_lib/mongo-dao');
const logger = createLogger('/checkoutUrl')

/**
 * /checkoutUrl call handler
 * This creates payment intent to be later paid with a given form of payment
 * Expected request:
 * {
 *     type: <form of payment - so far 'card' is only supported>
 *     orderId: <orderId to be paid for>
 * }
 *
 * Handlers performs the following logical steps:
 * 1 - retrieve order details (e.g. amount, currency) from session storage
 * 2 - stores order details in a database (mongo)
 * 3 - creates an intent
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
const checkoutUrlController = async (req, res) => {
    let payload = req.body;
    let payment_type=payload.type;
    let orderId=payload.orderId;

    if(payment_type !== 'card'){
        throw Error("Unsupported payment type:"+payment_type)
    }
    let sessionID=req.sessionID;
    let order = await retrieveOrderFromSessionStorage(sessionID,orderId);
    logger.debug("SessionID: %s, order:%s",sessionID,order)
    if(!order) {
        logger.warn("Cannot find requested order in session storage, SessionID: %s, orderId:%s",sessionID,orderId)
        res.json({error: "Error | Cannot find order in session"});
        res.status(500)
        return;
    }
    if(order.orderId!==orderId){
        logger.warn("Invalid orderID:%s",orderId)
        res.json({error: "Error | invalid order ID"});
        res.status(500)
        return;
    }

    logger.debug("Storing order %s in a database",orderId)
    await storeOrder(orderId,order);
    logger.debug("Order saved")
    let price = order.order.price;
    let priceInBaseUnits = convertPriceToMinorUnits(price.public, price.currency);
    logger.debug("Will create payment intent, sessionID:%s, orderID:%s, amount %s %s",sessionID,orderId,price.currency, price.public)
    let intent = await createPaymentIntent(PAYMENT_TYPES.CARD, priceInBaseUnits, price.currency,orderId);
    logger.debug("Intent received from stripe",intent);
    let response = prepareResponse(intent);
    res.json(response)
}

function retrieveOrderFromSessionStorage(sessionID, orderId){
    let sessionStorage = new SessionStorage(sessionID);
    return sessionStorage.retrieveOrder(orderId);
}

function prepareResponse(intent){
    return {
        client_secret:intent.client_secret,
        amount:convertPriceToMajorUnits(intent.amount,intent.currency),
        currency: intent.currency
    };
}



module.exports = decorate(checkoutUrlController);
