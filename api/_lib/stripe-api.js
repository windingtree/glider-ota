const {STRIPE_CONFIG} = require('../../config');
const {createLogger} = require('./logger');
const currencies = require('../_data/currencies')

const logger = createLogger("stripe-api")

const stripe = require("stripe")(STRIPE_CONFIG.SECRET_KEY);

function getPublicKey(){
    return { publicKey: STRIPE_CONFIG.PUBLISHABLE_KEY }
}

const PAYMENT_TYPES={CARD:'card'}

/**
 * Creates payment intent - that's required before authorizing payment by stripe.
 * For security reasons, server side must future transaction details, before card can be authorized.
 * OrderID is passed to stripe intent as metadata, so that it can be later on retrieved in a webhook call (after successful payment)
 * @param payment_method_type
 * @param amount
 * @param currency
 * @param orderId
 * @returns {Promise<Stripe.PaymentIntent|*>}
 */
async function createPaymentIntent(payment_method_type, amount, currency, orderId){

    const options = {
        payment_method_types:[payment_method_type],
        amount: amount,
        currency: currency,
        metadata:{
            orderId:orderId
        }
    };
    try {
        logger.debug("Payment intent will be created:%s",JSON.stringify(options));
        const paymentIntent = await stripe.paymentIntents.create(options);
        return paymentIntent;
    } catch (err) {
        logger.error("Error while creating intent %s",err)
        return err;
    }
}

/**
 * This validates if the webhook request is legit. Stripe provides measures to verify that request body is unmodified
 * @param rawBody - request body (important - this must be raw body!)
 * @param sig - content of stripe-signature header
 * @returns {Stripe.Event}
 */
function validateWebhook(rawBody, sig){
    let event;
    let endpointSecret=STRIPE_CONFIG.WEBHOOK_SECRET;

    try {
        event = stripe.webhooks.constructEvent(rawBody, sig, endpointSecret);
    }
    catch (err) {
        logger.error("Stripe webhook cannot be validated: %s",err)
        throw new Error(`Stripe webhook cannot be validated: ${err.message}`)
    }
    logger.info("Successfully verified webhook, event.type:%s",event.type)
    return event;
}

/**
 * Convert amount from major units to minor units (e.g. 100 EUR-> 10000 cents)
 * @param price
 * @param currencyCode
 * @returns {number}
 */
function convertPriceToMinorUnits(price, currencyCode){
    let currencyDefinition = currencies[currencyCode.toUpperCase()];
    if(!currencyDefinition)
        throw new Error (`Cannot convert amount in currency:${currencyCode} to minor units - missing definition`);
    let multiplier = Math.pow(10,currencyDefinition.minor_unit);
    return Math.round(price*multiplier);
}

/**
 * Convert amount from minor units to major units (e.g. 100 cents -> 100 EUR)
 * @param price
 * @param currencyCode
 * @returns {number}
 */
function convertPriceToMajorUnits(price, currencyCode){
    let currencyDefinition = currencies[currencyCode.toUpperCase()];
    if(!currencyDefinition)
        throw new Error (`Cannot convert amount in currency:${currencyCode} to major units - missing definition`);
    let multiplier = Math.pow(10,currencyDefinition.minor_unit);
    return price/multiplier;
}



module.exports = {
    getPublicKey,createPaymentIntent, validateWebhook,convertPriceToMajorUnits,convertPriceToMinorUnits,PAYMENT_TYPES
}
