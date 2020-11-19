const Web3 = require('web3');
const { decorate } = require('../_lib/decorators');
const { createLogger } = require('../_lib/logger');
const { sendBookingConfirmations } = require('../_lib/email-confirmations');
const { createWithOffer } = require('../_lib/glider-api');
const { createCryptoGuarantee } = require('../_lib/simard-api');
const { CRYPTO_CONFIG } = require('../_lib/config');
const {
    updateOrderStatus,
    updatePaymentStatus,
    findConfirmedOffer,
    ORDER_STATUSES,
    PAYMENT_STATUSES
} = require('../_lib/mongo-dao');
const logger = createLogger('/crypto');

const cancelPaymentAndUpdatePaymentStatus = async (confirmedOfferId, tx, errorMessage) => {
    try {
        // await cancelPayment(tx); //???

        logger.info('Payment cancelled successfully')
        await updatePaymentStatus(
            confirmedOfferId,
            PAYMENT_STATUSES.CANCELLED,
            {
                transactionHash: tx.hash
            },
            errorMessage,
            {}
        );
    } catch (error) {
        logger.error('Failed to cancel payment!:', error);
        await updatePaymentStatus(
            confirmedOfferId,
            PAYMENT_STATUSES.UNKNOWN,
            {
                transactionHash: tx.hash
            },
            'Payment cancellation failed due to error',
            error && error.message ? error : 'Unknown error'
        );
    }
};

const createPassengers = passengers => {
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
};

const fulfillOrder = async (confirmedOfferId, tx) => {
    logger.debug('Starting fulfilment process for confirmedOfferId:%s and txHash:%s', confirmedOfferId, tx.hash);

    let document = await findConfirmedOffer(confirmedOfferId);

    if (!document) {
        logger.error(`Offer not found, confirmedOfferId=${confirmedOfferId}`);
        throw new Error(`Could not find offer ${confirmedOfferId} in the database`);
    }

    // Update the status to fulfilling
    await updateOrderStatus(
        confirmedOfferId,
        ORDER_STATUSES.FULFILLING,
        'Order creation started',
        {}
    );

    let passengers = document.passengers;
    let offerId = document.confirmedOffer.offerId;
    let offer = document.confirmedOffer.offer;
    let price = offer.price;

    // Request a guarantee to Simard
    let guarantee;
    try {
        guarantee = await createCryptoGuarantee(price.public, price.currency, tx.hash);
    } catch (error) {
        logger.error('Guarantee could not be created, simard error:%s', error);
        //to cancel payment
        await cancelPaymentAndUpdatePaymentStatus(
            confirmedOfferId,
            tx,
            'Payment cancelled due to guarantee error'
        );

        // Update order status
        await updateOrderStatus(
            confirmedOfferId,
            ORDER_STATUSES.FAILED,
            `Could not create guarantee[${error}]`,
            {
                simardError: error
            }
        );
        throw error;
    }

    // Proceed to next steps with guarantee
    logger.info("Guarantee created, guaranteeId:%s", guarantee.guaranteeId);

    // Create the order
    let orderRequest = {
        offerId,
        guaranteeId: guarantee.guaranteeId,
        passengers: createPassengers(passengers),
    };// prepareRequest(offerId, guarantee.guaranteeId, passengers);
    let confirmation;
    try {
        confirmation = await createWithOffer(orderRequest);
        logger.info("Order created");
        // Handle the order creation success

        // Handle the error creation error
    } catch (error) {
        // Override Error with Glider message
        if (error.response && error.response.data && error.response.data.message) {
            error.message = `Glider B2B: ${error.response.data.message}`;
        }
        logger.error("Failure in response from /createWithOffer: %s, will try to cancel the payment", error.message);
        //if fulfilment fails - try to cancel payment
        await cancelPaymentAndUpdatePaymentStatus(
            confirmedOfferId,
            tx,
            'Payment cancelled due to fulfillment error'
        );
        // Update order status
        await updateOrderStatus(
            confirmedOfferId,
            ORDER_STATUSES.FAILED,
            `Order creation failed[${error}]`,
            {
                request: orderRequest
            }
        );
        throw error;
    }

    return confirmation;
};

const processCryptoOrder = async (confirmedOfferId, tx) => {
    logger.debug(`Update payment status, status:%s, confirmedOfferId:%s`, PAYMENT_STATUSES.PAID, confirmedOfferId);

    // Update the Payment Status in DB
    await updatePaymentStatus(
        confirmedOfferId,// offerId
        PAYMENT_STATUSES.PAID, // payment_status
        {// payment_details
            transactionHash: tx.hash
        },
        `Crypto payment`,// comment
        tx// transaction_details
    );

    let confirmation;

    try {
        confirmation = await fulfillOrder(confirmedOfferId, tx.hash);
    } catch (error) {
        logger.error(`Failed to fulfill order:`, error);
    }

    // Confirmation handle
    logger.info('Booking confirmation:', JSON.stringify(confirmation));

    // Update the order status
    await updateOrderStatus(
        confirmedOfferId,
        ORDER_STATUSES.FULFILLED,
        'Fulfilled after successful payment',
        confirmation
    );

    try {
        await sendBookingConfirmations(confirmation);
    } catch (error) {
        logger.error('Failed to send email confirmations:', error);
    }

    return confirmation;
};

const cryptoOrderController = async (request, response) => {
    const {
        confirmedOfferId,
        transactionHash
    } = request.body;
    const web3 = new Web3(CRYPTO_CONFIG.INFURA_ENDPOINT);

    // Send error response
    const sendErrorResponseAndFinish = (code, message) => {
        logger.debug('Failure:', message);
        response.status(code).json({
            received: true,
            fulfilled: false,
            message: message,
        });
    }

    // Send success response
    const sendSuccessResponseAndFinish = body => {
        logger.debug('Success');
        response.status(200).json(body);
    }

    try {
        const tx = await web3.eth.getTransaction(transactionHash);
        logger.info('Transaction:', JSON.stringify(tx));

        const confirmation = await processCryptoOrder(confirmedOfferId, tx);
        logger.info('Confirmation:', JSON.stringify(confirmation))

        sendSuccessResponseAndFinish({
            ...confirmation
        });
    } catch (error) {
        logger.error('Error:', error);
        sendErrorResponseAndFinish(500, `Crypto order error: ${error.message}`);
    }
};
module.exports = decorate(cryptoOrderController);
