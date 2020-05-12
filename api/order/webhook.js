const {validateWebhook} = require('../_lib/stripe-api');
const {decorate} = require('../_lib/decorators');
const {createLogger} = require('../_lib/logger');
const {getRawBodyFromRequest} = require('../_lib/rest-utils');
const {createWithOffer} = require('../_lib/glider-api');
const {createGuarantee, simulateDeposit} = require('../_lib/simard-api');
const {STRIPE_CONFIG} = require('../../config');
const {sendErrorResponse, ERRORS} = require("../_lib/rest-utils")
const _ = require('lodash');
const {updateOrderStatus, updatePaymentStatus, findConfirmedOffer, ORDER_STATUSES, PAYMENT_STATUSES} = require('../_lib/mongo-dao');
const logger = createLogger("/webhook");


/**
 * /webhook call handler
 * This is invoked by Stripe after a given event related to a payment occurs.
 */
const webhookController = async (request, response) => {
    if (STRIPE_CONFIG.DISABLE_WEBHOOK_SIGNATURE_CHECK) {
        logger.warn("Webhook signature verification is disabled! It should not be disabled in PROD environments")
        if (process.env.NODE_ENV === 'production') {
            logger.error("Webhook signature verification is disabled in PROD! It should not be disabled in PROD environments")
            sendErrorResponse(res, 500, ERRORS.INTERNAL_SERVER_ERROR, "Signature checking is disabled", req.body);
            return;
        }
    }
    let rawBody = await getRawBodyFromRequest(request);
    let event = request.body;
    if (!STRIPE_CONFIG.DISABLE_WEBHOOK_SIGNATURE_CHECK) {
        let stripeSignature = request.headers['stripe-signature'];
        event = validateWebhook(rawBody, stripeSignature);
    }
    try {
        processWebhookEventAC(event);
        response.json({received: true});
    } catch (error) {
        logger.error("/webhook error:%s", error);
        response.status(400).send(`Webhook processing error: ${error.message}`);
    }
}

/**
 * Extract orderID from stripe event (orderID is passed as metadata)
 * @param event Stripe event
 * @returns {string}
 */
function getOrderId(event) {
    return event.data.object.metadata.orderId;
}

/**
 * Extract confirmedOfferId from stripe event (confirmedOfferId is passed as metadata)
 * @param event Stripe event
 * @returns {string}
 */
function getConfirmedOfferId(event) {
    return event.data.object.metadata.confirmedOfferId;
}

/**
 * Depending on a type of event, perform further actions.
 * Event <payment_intent.succeeded>: update payment_status in DB to PAID, fulfill order related to payment, update order status in DB to FULFILLED, notify customer (TODO)
 * Event <payment_intent.payment_failed>: update payment_status in DB to FAILED
 *
 * @param event
 */
function processWebhookEvent(event) {
    logger.debug("Webhook event:%s", JSON.stringify(event));
    let orderId = getOrderId(event);


// Handle the event
    switch (event.type) {
        case 'payment_intent.payment_failed':
            logger.debug('Payment failed!')
            processPaymentFailure(orderId, event);
            break;
        case 'payment_intent.succeeded':
            logger.debug('Payment was successful!')
            processPaymentSuccess(orderId, event);
            break;
        case 'payment_method.attached':
            const paymentMethod = event.data.object;
            logger.debug('PaymentMethod was attached to a Customer!')
            break;
        // ... handle other event types
        default:
            // Unexpected event type
            logger.warn("Unhandled event type: [%d], ignoring this webhook", event.type)
        // throw new Error(`Unhandled event type: ${event.type}`)
    }
// Return a response to acknowledge receipt of the event
    logger.debug("Webhook successfully processed")
}

function processWebhookEventAC(event) {
    logger.debug("Webhook event:%s", JSON.stringify(event));
    let confirmedOfferId = getConfirmedOfferId(event);
    logger.debug("Confirmed offerID:%s", confirmedOfferId);

// Handle the event
    switch (event.type) {
        case 'payment_intent.payment_failed':
            logger.debug('Payment failed!')
            processPaymentFailure(confirmedOfferId, event);
            break;
        case 'payment_intent.succeeded':
            logger.debug('Payment was successful!')
            processPaymentSuccess(confirmedOfferId, event);
            break;
        case 'payment_method.attached':
            const paymentMethod = event.data.object;
            logger.debug('PaymentMethod was attached to a Customer!')
            break;
        // ... handle other event types
        default:
            // Unexpected event type
            logger.warn("Unhandled event type: [%d], ignoring this webhook", event.type)
        // throw new Error(`Unhandled event type: ${event.type}`)
    }
// Return a response to acknowledge receipt of the event
    logger.debug("Webhook successfully processed")
}


/**
 * * Perform necessary steps after receiving information that payment failed
 * 1 - update payment status in DB (FAILED)
 * @param confirmedOfferId
 * @param webhookEvent
 */
function processPaymentFailure(confirmedOfferId, webhookEvent) {
    logger.info("Update payment status, status:%s, confirmedOfferId:%s", PAYMENT_STATUSES.FAILED, confirmedOfferId);
    updatePaymentStatus(confirmedOfferId, PAYMENT_STATUSES.FAILED, "Webhook event:" + webhookEvent.type, {webhookEvent})
}


/**
 * Perform necessary steps after receiving confirmation that payment was successful
 * 1 - update payment status in DB (PAID)
 * 2 - fulfill an order
 * 3 - update order status in DB (FULFILLED)
 * 4 - notify customer (TODO)
 * @param confirmedOfferId
 * @param webhookEvent
 * @returns {Promise<void>}
 */
async function processPaymentSuccess(confirmedOfferId, webhookEvent) {
    logger.info("Update payment status, status:%s, confirmedOfferId:%s", PAYMENT_STATUSES.PAID, confirmedOfferId);
    updatePaymentStatus(confirmedOfferId, PAYMENT_STATUSES.PAID, "Webhook event:" + webhookEvent.type, {webhookEvent});
    let confirmation = await fulfillment(confirmedOfferId);
    logger.info("Response from fulfillment", confirmation);
    if(confirmation!=null) {
        updateOrderStatus(confirmedOfferId, ORDER_STATUSES.FULFILLED, "Fulfilled after successful payment", confirmation);
        sendConfirmation(confirmedOfferId, confirmation);
    }
    return confirmation;
}

/**
 * Order fulfillment
 * @param confirmedOfferId
 * @returns {Promise<any>}
 */
async function fulfillment(confirmedOfferId) {
    logger.debug("Starting fulfilment process for confirmedOfferId:%s", confirmedOfferId);
    logger.debug("#1 Retrieve offerDetails from DB");
    let document = await findConfirmedOffer(confirmedOfferId);
    console.debug("#2 document retrieved", document);
    let passengers = document.passengers;
    let offerItems = document.offerItems;
    let offerId = document.confirmedOffer.offerId;
    let offer = document.confirmedOffer.offer;
    let price = offer.price;
    logger.debug("#3 create deposit");
    let settlement = await simulateDeposit(price.public, price.currency);
    logger.info("#3 deposit created, settlementId:%s", settlement.settlementId);
    logger.debug("#3 creating guarantee");
    let guarantee = await createGuarantee(price.public, price.currency);
    logger.debug("#4 guarantee created, guaranteeId:%s", guarantee.guaranteeId);
    logger.debug("#5 create, offerId:%s",offerId);
    let orderRequest = prepareRequest(offerId, offerItems, guarantee.guaranteeId, passengers)
    logger.info("#6 order request:", orderRequest);
    let confirmation = undefined;
    try {
        confirmation = await createOrder(orderRequest);
        logger.info("#6 fulfilled, %s", JSON.stringify(confirmation));
    }catch(error){
        logger.error("Failure in response from /createWithOffer, error message:%s",error.message)
        await updateOrderStatus(confirmedOfferId, ORDER_STATUSES.FAILED, `Order creation failed[${error}]`, {request:orderRequest});
    }

    return confirmation;
}


function prepareRequest(offerId, offerItems, guaranteeId, passengers) {
    return {
        offerId: offerId,
        offerItems: offerItems,
        guaranteeId: guaranteeId,
        passengers: createPassengers(passengers)
    }
}

function createPassengers(passengers) {
    let passengersRequest = {};
    for (let i = 0; i < passengers.length; i++) {
        let pax = passengers[i];
        let record = {
            type: pax.type,
            civility: pax.civility,
            lastnames: [pax.lastname],
            firstnames: [pax.firstname],
            gender: pax.gender,
            birthdate: pax.birthdate,
            contactInformation: [
                pax.phone,
                pax.email
            ]
        }
        passengersRequest[pax.passenger_id] = record;
    }
    return passengersRequest;
}

async function createOrder(orderRequest) {
    let response = await createWithOffer(orderRequest)
    return response;
}


/**
 * Send confirmation email
 * @Param orderId
 * @param confirmation
 * @returns {Promise<any>}
 */
async function sendConfirmation(orderId, confirmation) {
    //TODO
    logger.info("Send confirmation email ")
}

module.exports = decorate(webhookController);


