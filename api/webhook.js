const {validateWebhook} = require('./_lib/stripe-api');
const {decorate} = require('./_lib/decorators');
const {createLogger} = require('./_lib/logger');
const {getRawBodyFromRequest} = require('./_lib/rest-utils');
const {fulfill} = require('./_lib/glider-api');
const {createGuarantee} = require('./_lib/simard-api');
const _ = require('lodash');
const {updateOrderStatus,updatePaymentStatus,findOrder,ORDER_STATUSES,PAYMENT_STATUSES} = require('./_lib/mongo-dao');
const logger = createLogger("/webhook");


/**
 * /webhook call handler
 * This is invoked by Stripe after a given event related to a payment occurs.
 */
const _webhookController = async (request,response)=>{
        logger.debug("/webhook triggered")
        try {
            let stripeSignature = request.headers['stripe-signature'];
            let rawBody = await getRawBodyFromRequest(request);
            let event = validateWebhook(rawBody, stripeSignature);
            processWebhookEvent(event);
            response.json({received: true});
        } catch (error) {
            logger.error("/webhook error:%s", error);
            response.status(400).send(`Webhook processing error: ${error.message}`);
        }
}


const webhookController = async (request,response)=>{
    logger.debug("/webhook triggered")
    try {
        let stripeSignature = request.headers['stripe-signature'];
        let testmode = request.headers['wt-test'];
        if(testmode === 'test'){
            logger.debug("/webhook - debug mode ON")
            let event = request.body;
            processWebhookEvent(event);
        }else {
            let rawBody = await getRawBodyFromRequest(request);
            let event = validateWebhook(rawBody, stripeSignature);
            processWebhookEvent(event);
        }
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
function getOrderId(event){
    return event.data.object.metadata.orderId;
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
            processPaymentFailure(orderId,event);
            break;
        case 'payment_intent.succeeded':
            logger.debug('Payment was successful!')
            processPaymentSuccess(orderId,event);
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
 * @param orderId
 * @param webhookEvent
 */
function processPaymentFailure(orderId,webhookEvent){
    logger.info("Update payment status, status:%s, orderId:%s", PAYMENT_STATUSES.FAILED,orderId);
    updatePaymentStatus(orderId,PAYMENT_STATUSES.FAILED,"Webhook event:"+webhookEvent.type,{webhookEvent})
}


/**
 * Perform necessary steps after receiving confirmation that payment was successful
 * 1 - update payment status in DB (PAID)
 * 2 - fulfill an order
 * 3 - update order status in DB (FULFILLED)
 * 4 - notify customer (TODO)
 * @param orderId
 * @param webhookEvent
 * @returns {Promise<void>}
 */
async function processPaymentSuccess(orderId,webhookEvent) {
    logger.info("Update payment status, status:%s, orderId:%s", PAYMENT_STATUSES.PAID,orderId);
    updatePaymentStatus(orderId,PAYMENT_STATUSES.PAID,"Webhook event:"+webhookEvent.type,{webhookEvent});
    let confirmation = await fulfillment(orderId);
    logger.info("Update payment status, status:%s, orderId:%s", PAYMENT_STATUSES.PAID,orderId);
    updateOrderStatus(orderId,ORDER_STATUSES.FULFILLED,"Fulfilled after successful payment", confirmation);
    sendConfirmation(orderId,confirmation);
}

/**
 * Order fulfillment
 * @param orderId
 * @returns {Promise<any>}
 */
async function fulfillment(orderId){
    logger.debug("Starting fulfilment process for orderId:%s",orderId);
    logger.debug("#1 Retrieve order from DB");
    let orderDocument = await findOrder(orderId);
    logger.debug("#2 document retrieved %s",JSON.stringify(orderDocument));
    let order=orderDocument.order;
    let price = order.price;
    logger.debug("#3 creating guarantee");
    let guarantee = await createGuarantee(price.public,price.currency);
    logger.debug("#4 guarantee created");
    logger.debug("#5 fulfilling");
    let confirmation = await fulfill(orderId,order.orderItems,order.passengers,guarantee.guaranteeId);
    logger.debug("#6 fulfilled, %s",JSON.stringify(confirmation));
    return confirmation;
}

/**
 * Send confirmation email
 * @Param orderId
 * @param confirmation
 * @returns {Promise<any>}
 */
async function sendConfirmation(orderId,confirmation){
    //TODO
    logger.info("Send confirmation email ")
}


module.exports = decorate(webhookController);


