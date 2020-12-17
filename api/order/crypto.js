const Web3 = require('web3');
const { decorate } = require('../_lib/decorators');
const { createLogger } = require('../_lib/logger');
const { sendBookingConfirmations } = require('../_lib/email-confirmations');
const { createWithOffer } = require('../_lib/glider-api');
const {getOfferMetadata} = require('../_lib/model/offerMetadata');
const {
    createCryptoDeposit,
    createCryptoGuarantee
} = require('../_lib/simard-api');
const {
    GLIDER_CONFIG,
    CRYPTO_CONFIG
} = require('../_lib/config');
const {
    updateOrderStatus,
    updatePaymentStatus,
    findConfirmedOffer,
    ORDER_STATUSES,
    PAYMENT_STATUSES,
    ORDER_TYPES
} = require('../_lib/mongo-dao');
const {
    PaymentManagerContract,
    addresses: { PaymentManager: PAYMENT_MANAGER }
} = require('@windingtree/payment-manager');
const logger = createLogger('/crypto');

const cancelPaymentAndUpdatePaymentStatus = async (confirmedOfferId, tx, errorMessage) => {
    try {
        // await cancelPayment(tx); // cryptoRefund ???

        logger.info('Payment cancelled successfully')
        await updatePaymentStatus(
            confirmedOfferId,
            PAYMENT_STATUSES.CANCELLED,
            {
                tx
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
                tx
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

const fulfillOrder = async (confirmedOfferId, tx, quote) => {
    logger.debug('Starting fulfillment process for confirmedOfferId:%s and transactionHash:%s', confirmedOfferId, tx.hash);

    let document = await findConfirmedOffer(confirmedOfferId);

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
    let settlement;
    try {
        settlement = await createCryptoDeposit(tx.hash, quote);
        logger.info('Deposit created, settlement:%s', settlement.settlementId);
    } catch (error) {
        logger.error('Deposit error:%s', error);
        throw error;
    }

    // Update the status to fulfilling
    await updateOrderStatus(
        confirmedOfferId,
        ORDER_STATUSES.FULFILLING,
        'Order creation started',
        settlement
    );

    let passengers = document.passengers;
    let offerId = document.confirmedOffer.offerId;
    // let offer = document.confirmedOffer.offer;
    let price = document.confirmedOffer.price;

    // Request a guarantee to Simard
    let guarantee;
    try {
        guarantee = await createCryptoGuarantee(price.public, price.currency, tx.hash, offerMetadata.id);
        logger.info('Guarantee created, guaranteeId:%s', guarantee.guaranteeId);
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

    // Create the order
    let orderRequest = {
        offerId,
        guaranteeId: guarantee.guaranteeId,
        passengers: createPassengers(passengers),
    };
    let confirmation;
    try {
        // Handle the order creation success
        confirmation = await createWithOffer(orderRequest, offerMetadata);
        logger.info('Order created:', confirmation);
    } catch (error) {
        // Override Error with Glider message
        if (error.response && error.response.data && error.response.data.message) {
            error.message = `Glider B2B: ${error.response.data.message}`;
        }
        logger.error("Failure in response from /createWithOffer: %s, will try to cancel the payment", error.message);
        //if fulfillment fails - try to cancel payment
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

const processCryptoOrderMulti = async (
    confirmedOfferId,
    {
        tx,
        receipt,
        payment,
        quoteId
    }
) => {

    let masterOffer = await findConfirmedOffer(confirmedOfferId)
    let {orderType, masterOrderId, subOfferIDs} = masterOffer;
    let results = []
    if(orderType === ORDER_TYPES.SINGLE){
        try{
            results.push(await processCryptoOrder(confirmedOfferId,{tx,receipt,payment,quoteId}))
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
                results.push(await processCryptoOrder(offerId,{tx,receipt,payment,quoteId}));
            }catch(err){
                console.log('error while processing', err)
            }
        }
    }
    console.log('Results', results)
}

const processCryptoOrder = async (
    confirmedOfferId,
    {
        tx,
        receipt,
        payment,
        quoteId
    }
) => {
    logger.debug(`Update payment status, status:%s, confirmedOfferId:%s, transactionHash:%s`, PAYMENT_STATUSES.PAID, confirmedOfferId, tx.hash);

    // Update the Payment Status in DB
    await updatePaymentStatus(
        confirmedOfferId,// offerId
        PAYMENT_STATUSES.PAID, // payment_status
        {// payment_details
            tx,
            receipt,
            payment,
            quoteId
        },
        `Crypto payment`,// comment
        receipt// transaction_details
    );

    let confirmation;

    try {
        confirmation = await fulfillOrder(confirmedOfferId, tx, quoteId);
    } catch (error) {
        logger.error(`Failed to fulfill order:`, error);
        throw error;
    }

    // Confirmation handle
    logger.info('Booking confirmation:', confirmation);

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

const toAddress = address => String(address).toLowerCase();

const validatePaymentTransaction = async (confirmedOfferId, transactionHash) => {
    const document = await findConfirmedOffer(confirmedOfferId);

    if (!document) {
        logger.error(`Offer not found, confirmedOfferId=${confirmedOfferId}`);
        throw new Error(`Could not find offer ${confirmedOfferId} in the database`);
    }

    const web3 = new Web3(CRYPTO_CONFIG.INFURA_ENDPOINT);

    const tx = await web3.eth.getTransaction(transactionHash);
    logger.info('Transaction:', tx);

    const pmAddress = toAddress(PAYMENT_MANAGER[CRYPTO_CONFIG.DEFAULT_NETWORK]);

    if (toAddress(tx.to) !== pmAddress) {
        logger.error(`Unknown PaymentManager`, tx.to);
        throw new Error(`Unknown PaymentManager ${tx.to}`);
    }

    const receipt = await web3.eth.getTransactionReceipt(transactionHash);
    logger.info('TransactionReceipt:', receipt);

    const paidEventInputs = PaymentManagerContract.abi
        .filter(e => e.type === 'event' && e.name === 'Paid')[0].inputs;
    const paidEventTopic = web3.utils.soliditySha3(
        `Paid(${paidEventInputs.map(i => i.type).join(',')})`
    );
    const event = receipt.logs.filter(
        e => (
            toAddress(e.address) === pmAddress &&
            e.topics.includes(paidEventTopic)
        )
    )[0];

    if (!event) {
        logger.error(`Could not find "Paid" event in the transaction`, receipt);
        throw new Error(`Could not find "Paid" event in the transaction ${transactionHash}`);
    }

    const decodedEvent = web3.eth.abi.decodeLog(
        paidEventInputs,
        event.data,
        event.topics
    );
    const pm = new web3.eth.Contract(PaymentManagerContract.abi, pmAddress);
    const payment = await pm.methods.payments(decodedEvent.index).call();

    if (toAddress(payment.merchant) !== toAddress(GLIDER_CONFIG.ORGID)) {
        logger.error(`Payment has wrong merchant`, payment.merchant);
        throw new Error(`Payment has wrong merchant ${payment.merchant}`);
    }

    if (payment.attachment !== confirmedOfferId) {
        logger.error(`Payment has wrong confirmed offerId`, payment.attachment);
        throw new Error(`Payment has wrong confirmed offerId ${payment.attachment}`);
    }

    const amount = web3.utils.fromWei(payment.amountOut, 'picoether');// USDC uses picoether: 1000000
    const {
        currency
    } = document.confirmedOffer.price;
    const exchangeQuote = document.exchangeQuote;
    const offerCurrency = String(currency).toLowerCase();

    if (exchangeQuote && amount !== String(exchangeQuote.sourceAmount)) {
        logger.error(`Payment amount has a wrong value: %s`, payment.amountOut);
        throw new Error(`Payment amount has a wrong value ${payment.amountOut}`);
    } else if ((!exchangeQuote || !exchangeQuote.quoteId) && offerCurrency !== 'usd') {
        logger.error(`The offer not enabled for payment with crypto: %s`, confirmedOfferId);
        throw new Error(`The offer not enabled for payment with crypto ${confirmedOfferId}`);
    }

    return {
        tx,
        receipt,
        payment,
        quoteId: exchangeQuote ? exchangeQuote.quoteId : undefined
    };
};

const cryptoOrderController = async (request, response) => {
    const {
        confirmedOfferId,
        transactionHash
    } = request.body;

    const {
        tx,
        receipt,
        payment,
        quoteId
    } = await validatePaymentTransaction(confirmedOfferId, transactionHash);

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
        const confirmation = await processCryptoOrderMulti(
            confirmedOfferId,
            {
                tx,
                receipt,
                payment,
                quoteId
            }
        );
        logger.info('Confirmation:', confirmation)

        sendSuccessResponseAndFinish({
            ...confirmation
        });
    } catch (error) {
        logger.error('Error:', error);
        sendErrorResponseAndFinish(500, `Crypto order error: ${error.message}`);
    }
};
module.exports = decorate(cryptoOrderController);
