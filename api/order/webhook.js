const {validateWebhook} = require('../_lib/stripe-api');
const {decorate} = require('../_lib/decorators');
const {createLogger} = require('../_lib/logger');
const {getRawBodyFromRequest} = require('../_lib/rest-utils');
const {createWithOffer} = require('../_lib/glider-api');
const {createGuarantee, simulateDeposit} = require('../_lib/simard-api');
const {STRIPE_CONFIG} = require('../_lib/config');
const {sendErrorResponse, ERRORS} = require("../_lib/rest-utils")
const _ = require('lodash');
const {
    updateOrderStatus,
    updatePaymentStatus,
    findConfirmedOffer,
    ORDER_STATUSES,
    PAYMENT_STATUSES
} = require('../_lib/mongo-dao');
const logger = createLogger("/webhook");
const EventEmitter = require('events');
const GliderWebhookEmitter = new EventEmitter();
const GLIDER_EVENT_PAYMENT_STATUS_UPDATED = 'paymentStatusUpdated';

/**
 * /webhook call handler
 * This is invoked by Stripe after a given event related to a payment occurs.
 */
const webhookController = (request, response ) => {
    // Define if webhook is acknowledged
    let isWebhookAcknowledged = false;

    // Define a function to handle the reject
    const handleReject = (code, message) => {
        if(!isWebhookAcknowledged) {
            response.status(code).send(message);
        } else {
            response.end(JSON.stringify({
                received: true,
                fulfilled: false,
                message: message,
            }));
        }
    }

    // Define a function to handle the webhook ack
    const handleAck = () => {
        if(!isWebhookAcknowledged) {
            response.writeHead(200, {'Content-Type': 'application/json'})
            //response.json({received: true});
            logger.info("/webhook acknowledged");
            isWebhookAcknowledged = true;
        }
    }

    // Get the raw request
    // We can not rely on request.body here 
    // as the JSON payload from Stripe can not be reconstructed in a reliable way
    getRawBodyFromRequest(request)
    .then(rawBody => {
        // Extract the event and signature
        let event;
        let stripeSignature = request.headers['stripe-signature'];

        // Validate the signature
        try {
            event = validateWebhook(rawBody, stripeSignature);
        }

        // Signature verification fails
        catch(error) {
            // Log an error
            logger.error("Webhook signature verification failed %s", error.message);

            // If signature bypassed, fallback
            if(STRIPE_CONFIG.BYPASS_WEBHOOK_SIGNATURE_CHECK) {
                logger.info("Signature check bypassed");
                event = JSON.parse(rawBody);
            }
            
            // If process not bypassed, stop processing immediatly
            else {
                handleReject(400, `Webhook signature verification failed: ${error.message}`);
            }   
        }

        // Process the event
        if(event) {
            // Register to DB Payment update and ack at this point
            GliderWebhookEmitter.on(GLIDER_EVENT_PAYMENT_STATUS_UPDATED, offerId => {
                if(offerId === getConfirmedOfferId(event)) {
                    setImmediate(() => {
                        handleAck();
                    });
                }
            });

            // Process the webhook
            processWebhookEvent(event)
            .then((confirmation) => {
                // Answer to webhook if not yet done
                setImmediate(() => {
                    handleAck();
                    response.end(JSON.stringify({
                        received: true,
                        fulfilled: (confirmation !== undefined && confirmation.isDuplicate ? undefined : true),
                        isDuplicate: (confirmation !== undefined && confirmation.isDuplicate===true),
                        orderId: confirmation && confirmation.orderId,
                    }));
                });
                
                logger.info("/webhook processsing success");
            })
            .catch(error => {
                logger.error("/webhook error:%s", error);
                handleReject(500, `Webhook processing error: ${error.message}`);
            })
            
        }
    })
    .catch(error => {
        logger.error("/webhook error:%s", error);
        handleReject(500, `Webhook processing error: ${error.message}`);
    })

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
    //logger.debug("Webhook event:%s", JSON.stringify(event));
    let confirmedOfferId = getConfirmedOfferId(event);
    logger.debug("Confirmed offerID:%s", confirmedOfferId);

    // Handle the event
    switch (event.type) {
        case 'payment_intent.payment_failed':
            logger.debug('Payment failed!')
            return processPaymentFailure(confirmedOfferId, event)

        case 'payment_intent.succeeded':
            logger.debug('Payment was successful!')
            return processPaymentSuccess(confirmedOfferId, event);
        
        case 'payment_method.attached':
            //const paymentMethod = event.data.object;
            logger.debug('PaymentMethod was attached to a Customer!')
            return Promise.resolve();

        // Handle other event types
        default:
            // Unexpected event type
            logger.warn("Unhandled event type: [%d], ignoring this webhook", event.type);
            return Promise.resolve();
            // throw new Error(`Unhandled event type: ${event.type}`)
    }

}


/**
 * * Perform necessary steps after receiving information that payment failed
 * 1 - update payment status in DB (FAILED)
 * @param confirmedOfferId
 * @param webhookEvent
 */
function processPaymentFailure(confirmedOfferId, webhookEvent) {
    logger.info("Update payment status, status:%s, confirmedOfferId:%s", PAYMENT_STATUSES.FAILED, confirmedOfferId);    
    return updatePaymentStatus(
        confirmedOfferId,
        PAYMENT_STATUSES.FAILED,
        {},
        "Webhook event:" + webhookEvent.type,
        {webhookEvent}
    );
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
function processPaymentSuccess(confirmedOfferId, webhookEvent) {
    return new Promise(function(resolve, reject) {
        logger.info("Update payment status, status:%s, confirmedOfferId:%s", PAYMENT_STATUSES.PAID, confirmedOfferId);
        
        // Extract relevant details from Stripe
        let paymentDetails;
        try {
            const chargeDetails = webhookEvent.data.object.charges.data[0];
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
        }
        catch(error) {
            logger.warn('Can not retrieve payment details: ', error);
        }

        // Update the Payment Status in DB
        updatePaymentStatus(
            confirmedOfferId,
            PAYMENT_STATUSES.PAID,
            paymentDetails,
            "Webhook event:" + webhookEvent.type,
            {webhookEvent}
        )

        // Once payment status is updated, proceed to fulfillment
        .then(() => {
            // Emit the event to acknowledge websocket
            GliderWebhookEmitter.emit(GLIDER_EVENT_PAYMENT_STATUS_UPDATED, confirmedOfferId);

            // Send the fulfill request
            fulfillOrder(confirmedOfferId)

            // On confirmaton handle it
            .then(confirmation => {
                //logger.info("Response from fulfillment", confirmation);
                if(confirmation && confirmation.isDuplicate) {
                    resolve(confirmation);
                }
                else if(confirmation) {
                    // Update the order status
                    updateOrderStatus(
                        confirmedOfferId,
                        ORDER_STATUSES.FULFILLED,
                        "Fulfilled after successful payment",
                        confirmation,
                    )

                    // When status is updated, send the email confirmation
                    .then(() => {
                        sendConfirmation(confirmedOfferId, confirmation)
                        .then(() => {
                            resolve({...confirmation, order_status:ORDER_STATUSES.FULFILLED});
                        })
                        .catch(error => {
                            logger.error(`Failed to send email confirmation: ${error.message}`);
                            reject(error);
                        });
                    })

                    // In case of issue to send the email, abort
                    .catch(error => {
                        logger.error("Failed to send email confirmation");
                        reject(error);
                    });
                }

                else {
                    logger.error("Confirmation was empty");
                    reject(confirmation);
                }
            })

            // Handle the fulfillment error 
            .catch(error => {
                let message;
                if(error.response && error.response.data && error.response.data.message) {
                    message = `Glider: ${error.response.data.message}`;
                } else {
                    message = error.message;
                }
                logger.error(`Failed to fulfill order: ${message}`);
                reject(error);
            });
        })

        // Handle the error while updating DB
        .catch(error => {
            logger.error(`Failed to update DB Status: ${error.message}`);
            reject(error);
        });
    });
}

/**
 * Order fulfillment
 * @param confirmedOfferId
 * @returns {Promise<any>}
 */
function fulfillOrder(confirmedOfferId) {
    return new Promise(function(resolve, reject) {
        logger.debug("Starting fulfilment process for confirmedOfferId:%s", confirmedOfferId);
    
        // Retrieve offer details
        logger.debug("#1 Retrieve offerDetails from DB");
        findConfirmedOffer(confirmedOfferId)

        // Process the retrieved offer
        .then(document => {

            // Check if fulfillment is already processed or in progress
            if(document && (
                (document.order_status === ORDER_STATUSES.FULFILLED) || 
                (document.order_status === ORDER_STATUSES.FULFILLING)))
            {
                resolve({...document.confirmation, isDuplicate: true});
            }

            // Proceed to next steps of fulfillment
            else {
                // Update the status to fulfilling
                updateOrderStatus(
                    confirmedOfferId,
                    ORDER_STATUSES.FULFILLING,
                    `Order creation started`,
                    {}
                )
                
                // Start fulfillment process
                .then(() => {
                    // Retrieve offer details
                    let passengers = document.passengers;
                    let offerId = document.confirmedOffer.offerId;
                    let offer = document.confirmedOffer.offer;
                    let price = offer.price;
        
                    // Request a guarantee to Simard
                    createGuarantee(price.public, price.currency)
        
                    // Proceed to next steps with guarantee
                    .then(guarantee => {
                        logger.debug("#4 guarantee created, guaranteeId:%s", guarantee.guaranteeId);
        
                        // Create the order
                        let orderRequest = prepareRequest(offerId, guarantee.guaranteeId, passengers);
                        createOrder(orderRequest)
        
                        // Handle the order creation success
                        .then(confirmation => {
                            resolve(confirmation);
                        })
        
                        // Handle the error creation error
                        .catch(error => {
                            // Override Error with Glider message
                            if(error.response && error.response.data && error.response.data.message) {
                                error.message = `Glider B2B: ${error.response.data.message}`;
                            }
                            logger.error("Failure in response from /createWithOffer: %s", error.message);
    
                            // Update order status
                            updateOrderStatus(
                                confirmedOfferId,
                                ORDER_STATUSES.FAILED,
                                `Order creation failed[${error}]`,
                                {request:orderRequest})
                            
                            // Once order is updated, reject the error
                            .then(() => {
                                reject(error);
                            })
        
                            // If even the DB update fails, return the error
                            .catch(updateError => {
                                logger.error("Failed to update DB when processing error:%s", updateError.message);
                                reject(error);
                            });
                        });
                        
                    })
        
                    // Handle the guarantee creation error
                    .catch(error => {
                        logger.error("Could not create guarantee: %s", error);
                        reject(error);
                    });
                })
                .catch(updateError => {
                    logger.error("Failed to update order status to fulfilling: %s", updateError.message);
                    reject(updateError);
                });

            }
        })

        // Handle the error when offer can not be retrieved
        .catch(error => {
            logger.error("Could not find the offer: %s", error);
            reject(error);
        });

    });
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

// Create the order
function createOrder(orderRequest) {
    return createWithOffer(orderRequest)
}


/**
 * Send confirmation email
 * @Param orderId
 * @param confirmation
 * @returns {Promise<any>}
 */
function sendConfirmation(orderId, confirmation) {
    //TODO
    logger.info("Send confirmation email ")
    return Promise.resolve();
}

module.exports = decorate(webhookController);


