const axios = require('axios').default;
const {
    createPaymentIntent,
    convertPriceToMinorUnits,
    convertPriceToMajorUnits,
    PAYMENT_TYPES
} = require('../_lib/stripe-api');
const {createLogger} = require('../_lib/logger')
const {ShoppingCart,CART_ITEMKEYS} = require('../_lib/shopping-cart');
const {decorate} = require('../_lib/decorators');
const {storeConfirmedOffer} = require('../_lib/mongo-dao');
const logger = createLogger('/checkout')
const {sendErrorResponse,ERRORS} = require("../_lib/rest-utils")
const {validateCheckoutPayload} = require('../_lib/validators')
const {
    createQuote
} = require('../_lib/simard-api');

const checkoutCard = async (req, res) => {
    let payload = req.body;
    let confirmedOfferId=payload.confirmedOfferId;
    let sessionID=req.sessionID;
    let shoppingCart = new ShoppingCart(sessionID);
    logger.debug("SessionID: %s, confirmedOffer:%s", sessionID, confirmedOfferId)
    let passengers = await shoppingCart.getItemFromCart(CART_ITEMKEYS.PASSENGERS);
    let confirmedOffer = await shoppingCart.getItemFromCart(CART_ITEMKEYS.CONFIRMED_OFFER)
    logger.debug("passenger details in shopping cart", passengers);
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
    return {
        client_secret:intent.client_secret,
        amount:convertPriceToMajorUnits(intent.amount,intent.currency),
        currency: intent.currency
    };
};

const convertCurrencyToUSD = async (currency, amount) => {
    // if (currency === 'USD' || currency === 'usd') {
    //     return amount;
    // }
    // const response = await axios.get(
    //     `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=${currency}&to_currency=USD&apikey=${CRYPTO_CONFIG.EXCHANGE_RATE_KEY}`
    // );
    // const rate = response.data['Realtime Currency Exchange Rate']['9. Ask Price'];

    return createQuote('USD', currency, amount);
};

const checkoutCrypto = async (req, res) => {
    const payload = req.body;
    const confirmedOfferId = payload.confirmedOfferId;
    logger.debug("confirmedOffer:", confirmedOfferId);

    const sessionID=req.sessionID;
    const shoppingCart = new ShoppingCart(sessionID);
    logger.debug("shopping cart:", await shoppingCart.getCart());

    const passengers = await shoppingCart.getItemFromCart(CART_ITEMKEYS.PASSENGERS);
    logger.debug("passenger details in shopping cart:", passengers);

    const confirmedOffer = await shoppingCart.getItemFromCart(CART_ITEMKEYS.CONFIRMED_OFFER);
    logger.debug("confirmedOffer:", confirmedOffer);

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

    await storeConfirmedOffer(confirmedOffer, passengers);

    const {
        public: publicPrice,
        currency
    } = confirmedOffer.offer.price;
    let amount = publicPrice;

    const isNonUsd = String(currency).toLowerCase() !== 'usd';

    if (isNonUsd) {
        const {
            quoteId,
            rate,
            sourceAmount,
            sourceCurrency,
            targetAmount,
            targetCurrency
        } = await convertCurrencyToUSD(currency, publicPrice);
        amount = sourceAmount;
        logger.info(`Quote created: quoteId=${quoteId}; from ${targetAmount}${targetCurrency} to ${sourceAmount}${sourceCurrency} with rate: ${rate}`);
    }

    return {
        offer: confirmedOffer,
        amount
    };
};

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
    validateCheckoutPayload(req.body)
    let payload = req.body;
    let payment_type=payload.type;
    // let sessionID=req.sessionID;
    // let shoppingCart = new ShoppingCart(sessionID);
    // let confirmedOfferId=payload.confirmedOfferId;

    let response;

    switch (payment_type) {
        case 'card':
            response = await checkoutCard(req, res);
            break;
        case 'crypto':
            response = await checkoutCrypto(req, res);
            break;
        default:
            logger.warn("Unsupported payment type, payment_type=%s", payment_type);
            sendErrorResponse(res,400,ERRORS.INVALID_INPUT,"Unsupported payment type",req.body);
    }

    // if (payment_type !== 'card') {
    //     logger.warn("Unsupported payment type, payment_type=%s", payment_type)
    //     sendErrorResponse(res,400,ERRORS.INVALID_INPUT,"Unsupported payment type",req.body);
    //     return;
    // }
    // logger.debug("SessionID: %s, confirmedOffer:%s", sessionID, confirmedOfferId)
    // let passengers = await shoppingCart.getItemFromCart(CART_ITEMKEYS.PASSENGERS);
    // let confirmedOffer = await shoppingCart.getItemFromCart(CART_ITEMKEYS.CONFIRMED_OFFER)
    // logger.debug("passenger details in shopping cart", passengers)
    // logger.debug("shopping cart ", await shoppingCart.getCart());

    // if (confirmedOffer == null) {
    //     logger.warn("Cannot find requested confirmedOffer in session storage, SessionID: %s", sessionID)
    //     sendErrorResponse(res,400,ERRORS.INVALID_INPUT,"Cannot find offer",req.body);
    //     return;
    // }
    // if (confirmedOffer.offerId !== confirmedOfferId) {
    //     logger.warn("Requested offerId was found in session storage but its offerId(%s) does not match with requested confirmedOfferId(%s)", confirmedOffer.offerId, confirmedOfferId, confirmedOffer)
    //     sendErrorResponse(res,400,ERRORS.INVALID_INPUT,"Invalid offer retrieved",req.body);
    //     return;
    // }

    // await storeConfirmedOffer(confirmedOffer,passengers);
    // let price = confirmedOffer.offer.price;
    // let priceInBaseUnits = convertPriceToMinorUnits(price.public, price.currency);
    // logger.debug("Will create payment intent, sessionID:%s, confirmedOfferId:%s, amount %s %s", sessionID, confirmedOfferId, price.currency, price.public)
    // let intent = await createPaymentIntent(PAYMENT_TYPES.CARD, priceInBaseUnits, price.currency,confirmedOfferId);
    // logger.debug("Intent received from stripe",intent);
    // let response = prepareResponse(intent);
    res.json(response)
}

module.exports = decorate(checkoutUrlController);
