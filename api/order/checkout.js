const {createPaymentIntent, convertPriceToMinorUnits,convertPriceToMajorUnits,PAYMENT_TYPES} = require('../_lib/stripe-api');
const {createLogger} = require('../_lib/logger')
const {ShoppingCart,CART_ITEMKEYS} = require('../_lib/shopping-cart');
const {decorate} = require('../_lib/decorators');
const {storeConfirmedOffer} = require('../_lib/mongo-dao');
const {createGuarantee} = require('../_lib/simard-api');
const logger = createLogger('/checkout')
const {sendErrorResponse,ERRORS} = require("../_lib/rest-utils")
const DEV_MODE=false;
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
    let sessionID=req.sessionID;
    console.debug("#1/checkout - call")
    logger.debug("#1/checkout - call")

    let shoppingCart = new ShoppingCart(sessionID);
    let confirmedOfferId=payload.confirmedOfferId;
        if (payment_type !== 'card') {
            logger.warn("Unsupported payment type, payment_type=%s", payment_type)
            sendErrorResponse(res,400,ERRORS.INVALID_INPUT,"Unsupported payment type",req.body);
            return;
        }
        logger.debug("SessionID: %s, confirmedOffer:%s", sessionID, confirmedOfferId)
        let passengers = await shoppingCart.getItemFromCart(CART_ITEMKEYS.PASSENGERS);
        let unconfirmedOffer = await shoppingCart.getItemFromCart(CART_ITEMKEYS.OFFER);
        let confirmedOffer = await shoppingCart.getItemFromCart(CART_ITEMKEYS.CONFIRMED_OFFER)
        logger.debug("passenger details in shopping cart", passengers)
        logger.debug("confirmed offer in shopping cart", confirmedOffer)
        logger.debug("unconfirmed offer in shopping cart", unconfirmedOffer)
        logger.debug("shopping cart ", await shoppingCart.getCart());

        if (confirmedOffer == null) {
            logger.warn("Cannot find requested confirmedOffer in session storage, SessionID: %s", sessionID)
            sendErrorResponse(res,400,ERRORS.INVALID_INPUT,"Cannot find offer",req.body);
            return;
        }
        if (confirmedOffer.offerId !== confirmedOfferId) {
            logger.warn("Requested offerId was found in session storage but its offerId(%s) does not match with requested confirmedOfferId(%s)", confirmedOffer.offerId, confirmedOfferId, confirmedOffer)
            sendErrorResponse(res,400,ERRORS.INVALID_INPUT,"Invalid offer retrieved",req.body);
            return;
        }

        await storeConfirmedOffer(confirmedOffer,passengers);
        let price = confirmedOffer.offer.price;
        let priceInBaseUnits = convertPriceToMinorUnits(price.public, price.currency);
        logger.debug("Will create payment intent, sessionID:%s, confirmedOfferId:%s, amount %s %s", sessionID, confirmedOfferId, price.currency, price.public)
        let intent = await createPaymentIntent(PAYMENT_TYPES.CARD, priceInBaseUnits, price.currency,confirmedOfferId);
        logger.debug("Intent received from stripe",intent);
        let response = prepareResponse(intent);
        res.json(response)
}



function prepareResponse(intent){
    return {
        client_secret:intent.client_secret,
        amount:convertPriceToMajorUnits(intent.amount,intent.currency),
        currency: intent.currency
    };
}



module.exports = decorate(checkoutUrlController);
