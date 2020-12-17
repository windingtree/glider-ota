const {validateWebhook, cancelPaymentIntent} = require('../_lib/stripe-api');
const {decorate} = require('../_lib/decorators');
const {createLogger} = require('../_lib/logger');
const {getRawBodyFromRequest} = require('../_lib/rest-utils');
const {createWithOffer} = require('../_lib/glider-api');
const {createGuarantee} = require('../_lib/simard-api');
const {sendBookingConfirmations} = require('../_lib/email-confirmations');
const {getOfferMetadata} = require('../_lib/model/offerMetadata');

const {STRIPE_CONFIG} = require('../_lib/config');
const {
    updateOrderStatus,
    updatePaymentStatus,
    findConfirmedOffer,
    ORDER_STATUSES,
    PAYMENT_STATUSES,
    ORDER_TYPES
} = require('../_lib/mongo-dao');
const logger = createLogger("/webhook");

/**
 * /webhook call handler
 * This is invoked by Stripe after a given event related to a payment occurs.
 */
const webhookController = async (request, response) => {

    // Send error response to the client with error code
    const sendErrorResponseAndFinish = (code, message) => {
        logger.info(`/webhook reply to caller with failure: ${message}`);
        response.status(code).json({
            received: true,
            fulfilled: false,
            message: message,
        });
    }

    // Send success response to the client with body
    const sendSuccessResponseAndFinish = (body) => {
        logger.info("/webhook acknowledged with success");
        response.status(200).json(body);
    }

    try {
        // Extract the event and signature, verify if it's legit request or skip verification if configuration flag is set (DEV purpose only)
        let event = await validateAndParseEvent(request);
        if (!event) {
            return sendErrorResponseAndFinish(500, `Webhook processing error, invalid webhook body`);
        }
        logger.info(`Process webhook, type:[${event.type}]`);
        // Process the webhook
        let confirmation = await processWebhookEvent(event);
        console.log('Confirmation:', JSON.stringify(confirmation))
        // Answer to webhook if not yet done
        return sendSuccessResponseAndFinish({
            received: true,
            fulfilled: (confirmation && !confirmation.isDuplicate && confirmation.orderId) ? true : false,
            isDuplicate: confirmation && confirmation.isDuplicate === true,
            orderId: confirmation && confirmation.orderId,
        });
    } catch (error) {
        logger.error("/webhook error:%s", error);
        sendErrorResponseAndFinish(500, `Webhook processing error: ${error.message}`);
    }

}
const validateAndParseEvent = async (request) => {
    let event;
    let stripeSignature = request.headers['stripe-signature'];
    let rawBody = await getRawBodyFromRequest(request);
    // Validate the signature
    try {
        event = validateWebhook(rawBody, stripeSignature);
    } catch (error) {
        // Signature verification fails
        logger.warn("Webhook signature verification failed %s", error.message);

        // If signature bypassed, fallback
        if (STRIPE_CONFIG.BYPASS_WEBHOOK_SIGNATURE_CHECK) {
            logger.warn("Signature check bypassed");
            event = JSON.parse(rawBody);
        }
        // If process not bypassed, stop processing immediately
        else {
            throw new Error(`Webhook signature verification failed: ${error.message}`)
        }
    }
    return event;
}
/**
 * This will cancel payment on stripe (in case fulfillment fails)
 * When order cannot be created, we should return money to they passenger.
 *
 * @param confirmedOfferId  ID of the offer which we want to cancel payment for
 * @param intentId  payment intent ID (from stripe)
 * @param errorMessage  error message (text)
 * @param errorDetails  additional information to be added to a DB transaction log
 */
const cancelPaymentAndUpdatePaymentStatus = async (confirmedOfferId, webhookEvent, errorMessage) => {
    try {
        let paymentIntentId = getPaymentIntentId(webhookEvent);
        await cancelPaymentIntent(paymentIntentId);
        logger.info('Payment cancelled successfully')
        await updatePaymentStatus(confirmedOfferId, PAYMENT_STATUSES.CANCELLED, {paymentIntentId: paymentIntentId}, errorMessage, {});
    } catch (cancellationError) {
        logger.error(`Failed to cancel payment!, error: ${getErrorMessage(cancellationError)}`);
        console.error(cancellationError);
        //last resort - got error while cancelling payment, set payment status to UNKNOWN for further analysis/manual handling
        await updatePaymentStatus(confirmedOfferId, PAYMENT_STATUSES.UNKNOWN, {paymentIntentId: paymentIntentId}, "Payment cancellation failed due to error", cancellationError && cancellationError.message?cancellationError:'Unknown error');
    }
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
 * Extract payment_intent_id from stripe event
 * @param event Stripe event
 * @returns {string}
 */
function getPaymentIntentId(event) {
    return event.data.object.payment_intent;
}

/**
 * Depending on a type of event, perform further actions.
 * Event <payment_intent.succeeded>: update payment_status in DB to PAID, fulfill order related to payment, update order status in DB to FULFILLED, notify customer (TODO)
 * Event <payment_intent.payment_failed>: update payment_status in DB to FAILED
 *
 * @param event
 */
async function processWebhookEvent(event) {

    let confirmedOfferId = getConfirmedOfferId(event);
    logger.debug("Confirmed offerID:%s", confirmedOfferId);
    let response;
    // Handle the event
    switch (event.type) {
        case 'payment_intent.payment_failed':
            logger.debug('Payment failed!')
            await processPaymentFailure(confirmedOfferId, event)
            break;
        // case 'payment_intent.succeeded': //
        case 'charge.succeeded':
            logger.debug('Payment was successful!')
            response = await processPaymentSuccessMulti(confirmedOfferId, event);
            // response = await processPaymentSuccess(confirmedOfferId, event);
            break;f267d068-8fbc-44d0-b9b5-52e91d8aeb06
        case 'payment_method.attached':
            //const paymentMethod = event.data.object;
            logger.debug('PaymentMethod was attached to a Customer!')
            break;
        // Handle other event types
        default:
            // Unexpected event type
            logger.warn(`Unhandled event type: [${event.type}], ignoring this webhook`);
        // throw new Error(`Unhandled event type: ${event.type}`)
    }
    return response;
}


async function processPaymentSuccessMulti(confirmedOfferId, webhookEvent) {
    let masterOffer = await findConfirmedOffer(confirmedOfferId)
    let {orderType, masterOrderId, subOfferIDs} = masterOffer;
    let results = []
    if(orderType === ORDER_TYPES.SINGLE){
        try{
            results.push(processPaymentSuccess(confirmedOfferId,webhookEvent))
        }catch(err){
            console.log('error while processing', err)
        }
    }else{
        if(!subOfferIDs){
            //should not happen
            throw new Error('Missing sub offers - cannot proceed')
        }
        for(let offerId of subOfferIDs){
            console.log('Process success for offerId',offerId)
            try {
                results.push(await processPaymentSuccess(offerId, webhookEvent));
            }catch(err){
                console.log('error while processing', err)
            }
        }
    }
    console.log('Results', results)
}

/**
 * * Perform necessary steps after receiving information that payment failed
 * 1 - update payment status in DB (FAILED)
 * @param confirmedOfferId
 * @param webhookEvent
 */
async function processPaymentFailure(confirmedOfferId, webhookEvent) {
    logger.info("Update payment status, status:%s, confirmedOfferId:%s", PAYMENT_STATUSES.FAILED, confirmedOfferId);
    return updatePaymentStatus(confirmedOfferId, PAYMENT_STATUSES.FAILED, {}, "Webhook event:" + webhookEvent.type, {webhookEvent});
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
    logger.debug("Update payment status, status:%s, confirmedOfferId:%s", PAYMENT_STATUSES.PAID, confirmedOfferId);

    // Extract relevant details from Stripe
    let paymentDetails = retrievePaymentDetailsFromWebhook(webhookEvent);

    // Update the Payment Status in DB
    await updatePaymentStatus(confirmedOfferId, PAYMENT_STATUSES.PAID, paymentDetails, "Webhook event:" + webhookEvent.type, {webhookEvent});
    let confirmation;
    // Once payment status is updated, proceed to fulfillment
    try {
        // Send the fulfill request
        logger.debug("Webhook event:%s", JSON.stringify(webhookEvent));
        confirmation = await fulfillOrder(confirmedOfferId, webhookEvent);
    } catch (fulfillmentError) {
        logger.error(`Failed to fulfill order: ${getErrorMessage(fulfillmentError)}`);
        // await updateOrderStatus(confirmedOfferId, ORDER_STATUSES.FAILED, `Failed to fulfill the order due to error`, getErrorMessage(fulfillmentError));
    }
    // On confirmation handle it
    logger.info("Booking confirmation:%s", JSON.stringify(confirmation));
    if (confirmation && confirmation.isDuplicate) {
        logger.info("It's a duplicate - will ignore it");
    } else if (confirmation) {
        // Update the order status
        await updateOrderStatus(confirmedOfferId, ORDER_STATUSES.FULFILLED, "Fulfilled after successful payment", confirmation)
        // When status is updated, send the email confirmation
        try {
            await sendBookingConfirmations(confirmation);
        } catch (error) {
            logger.error(`Failed to send email confirmations: ${getErrorMessage(error)}`);
        }
    }
    return confirmation;
}

const getErrorMessage = (error) => {
    let message;
    if (error.response && error.response.data && error.response.data.message) {
        message = `Supplier: ${error.response.data.message}`;
    } else {
        message = error.message;
    }
    return message;
}

const retrievePaymentDetailsFromWebhook = (webhookEvent) => {
    const chargeDetails = webhookEvent.data.object;
    let paymentDetails;
    try {
        paymentDetails = {
            card: {
                brand: chargeDetails.payment_method_details.card.brand,
                last4: chargeDetails.payment_method_details.card.last4,
            },
            receipt: {
                url: chargeDetails.receipt_url,
            },
            status: {
                type: chargeDetails.outcome.type,
                network: chargeDetails.outcome.network_status,
                message: chargeDetails.outcome.seller_message,
            }
        }
    } catch (error) {
        logger.warn('Can not retrieve payment details: ', error);
    }
    return paymentDetails;
}


/**
 * Order fulfillment
 * @param confirmedOfferId
 * @param intentId
 * @returns {Promise<any>}
 */
async function fulfillOrder(confirmedOfferId, webhookEvent) {
    logger.debug("Starting fulfilment process for confirmedOfferId:%s", confirmedOfferId);

    // Retrieve offer details
    logger.debug("#1 Retrieve offerDetails from DB");
    let document =  await findConfirmedOffer(confirmedOfferId)

    if (!document) {
        logger.error(`Offer not found, confirmedOfferId=${confirmedOfferId}`);
        throw new Error(`Could not find offer ${confirmedOfferId} in the database`);
    }
    //retrieve endpoint details (url, jwt) for this offer
    let offerMetadata = await getOfferMetadata(confirmedOfferId);
    if (!offerMetadata) {
        logger.error(`Offer metadata not found, confirmedOfferId=${confirmedOfferId}`);
        throw new Error(`Could not find offer ${confirmedOfferId} metadata in the database`);
    }

    // Check if fulfillment is already processed or in progress
    if (document && (
        (document.order_status === ORDER_STATUSES.FULFILLED) ||
        (document.order_status === ORDER_STATUSES.FULFILLING))) {
        return {...document.confirmation, isDuplicate: true};
    }

    // Proceed to next steps of fulfillment
    // Update the status to fulfilling
    await updateOrderStatus(confirmedOfferId, ORDER_STATUSES.FULFILLING, `Order creation started`, {})
    // Start fulfillment process
    // Retrieve offer details
    let passengers = document.passengers;
    let offerId = document.confirmedOffer.offerId;
    let offer = document.confirmedOffer.offer;
    let price = document.confirmedOffer.price;

    // Request a guarantee to Simard
    let guarantee;
    try {
        guarantee = await createGuarantee(price.public, price.currency, offerMetadata.id)

    }catch(error){
        logger.error("Guarantee could not be created, simard error:%s", error);
        //to cancel payment
        await cancelPaymentAndUpdatePaymentStatus(confirmedOfferId, webhookEvent, `Payment cancelled due to guarantee error`);

        // Update order status
        await updateOrderStatus(confirmedOfferId, ORDER_STATUSES.FAILED, `Could not create guarantee[${error}]`, {simardError: error});
        throw error;
    }
    // Proceed to next steps with guarantee
    logger.info("Guarantee created, guaranteeId:%s", guarantee.guaranteeId);

    // Create the order
    let orderRequest = prepareRequest(offerId, guarantee.guaranteeId, passengers);
    let confirmation;
    try {
        confirmation = await createWithOffer(orderRequest, offerMetadata);
        logger.info("Order created");
        // Handle the order creation success

        // Handle the error creation error
    } catch (error) {
        // Override Error with supplier message
        if (error.response && error.response.data && error.response.data.message) {
            error.message = `Supplier: ${error.response.data.message}`;
        }
        logger.error("Failure in response from /createWithOffer: %s, will try to cancel the payment", error.message);
        //if fulfilment fails - try to cancel payment
        await cancelPaymentAndUpdatePaymentStatus(confirmedOfferId, webhookEvent, `Payment cancelled due to fulfillment error`);
        // Update order status
        await updateOrderStatus(confirmedOfferId, ORDER_STATUSES.FAILED, `Order creation failed[${error}]`, {request: orderRequest});

        throw error;
    }
    return confirmation;
}

// Prepare the order creation request
function prepareRequest(offerId, guaranteeId, passengers) {
    return {
        offerId: offerId,
        guaranteeId: guaranteeId,
        passengers: createPassengers(passengers),
    }
}

function createPassengers(passengers) {
    let passengersRequest = {};
    for (let i = 0; i < passengers.length; i++) {
        let pax = passengers[i];
        let record = {
            type: pax.type,
            civility: pax.civility,
            lastnames: [pax.lastName],
            firstnames: [pax.firstName],
            gender: (pax.civility === 'MR' ? 'Male' : 'Female'),
            birthdate: pax.birthdate,
            contactInformation: [
                pax.phone,
                pax.email
            ]
        }
        passengersRequest[pax.id] = record;
    }
    return passengersRequest;
}


module.exports = decorate(webhookController);


