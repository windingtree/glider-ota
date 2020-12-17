const {getHotelSearchResults,getFlightSearchResults} = require("../_lib/cache");
const {
    createPaymentIntent,
    convertPriceToMinorUnits,
    convertPriceToMajorUnits,
    PAYMENT_TYPES
} = require('../_lib/stripe-api');
const {createLogger} = require('../_lib/logger')
const {ShoppingCart,CART_ITEMKEYS} = require('../_lib/shopping-cart');
const {decorate} = require('../_lib/decorators');
const {storeConfirmedOffer, ORDER_TYPES} = require('../_lib/mongo-dao');
const logger = createLogger('/checkout')
const {sendErrorResponse,ERRORS} = require("../_lib/rest-utils")
const {validateCheckoutPayload} = require('../_lib/validators')
const {
    createQuoteAsync
} = require('../_lib/simard-api');

const checkoutCard = async (req, res) => {
    let payload = req.body;
    let confirmedOfferId=payload.confirmedOfferId;
    let sessionID=req.sessionID;
    try{
        const {exchangeQuote, confirmedOffer} = await processCheckout(sessionID,confirmedOfferId);

        // let price = confirmedOffer.offer.price;
        const {targetAmount, targetCurrency} = exchangeQuote;
        let priceInBaseUnits = convertPriceToMinorUnits(targetAmount, targetCurrency);
        logger.debug("Will create payment intent, sessionID:%s, confirmedOfferId:%s, amount %s %s", sessionID, confirmedOfferId, targetCurrency, targetAmount)
        let intent = await createPaymentIntent(PAYMENT_TYPES.CARD, priceInBaseUnits, targetCurrency, confirmedOffer.offerId);
        logger.debug("Intent received from stripe",intent);
        return {
            client_secret:intent.client_secret,
            amount:convertPriceToMajorUnits(intent.amount,intent.currency),
            currency: intent.currency
        };
    }catch(err){
            logger.warn("Cannot find requested confirmedOffer in session storage, SessionID: %s", sessionID)
            sendErrorResponse(res,400,ERRORS.INVALID_INPUT,`Cannot find offer`,req.body);
            return;
    }

};


const processCheckout = async (sessionID, confirmedOfferId) => {

    let shoppingCart = new ShoppingCart(sessionID);
    let passengers = await shoppingCart.getItemFromCart(CART_ITEMKEYS.PASSENGERS);
    let confirmedOffer = await shoppingCart.getItemFromCart(CART_ITEMKEYS.CONFIRMED_OFFER)

    if (confirmedOffer == null) {
        logger.warn("Cannot find requested confirmedOffer in session storage, SessionID: %s", sessionID)
        sendErrorResponse(
            res,
            400,
            ERRORS.INVALID_INPUT,
            `The offer ${confirmedOfferId} not found or expired`,
            req.body
        );
        return;
    }
    if (confirmedOffer.offerId !== confirmedOfferId) {
        logger.warn("Requested offerId was found in session storage but its offerId(%s) does not match with requested confirmedOfferId(%s)", confirmedOffer.offerId, confirmedOfferId, confirmedOffer)
        sendErrorResponse(res,400,ERRORS.INVALID_INPUT,"Invalid offer retrieved",req.body);
        return;
    }
    let exchangeQuote = await getExchangeQuote(confirmedOffer);

    //SINGLE-single order(e.g. only flight or only hotel
    //MASTER-order that consists of other suborders (e.g. hotel+flight)
    //check if we have a master order (order with sub orders for e.g. flights or hotels)
    let subOfferIDs = confirmedOffer.subOfferIDs;   //if so - this would have a list of sub offers that need to be paid and fulfilled
    let childOfferIDs=[];
    if(subOfferIDs && Array.isArray(subOfferIDs) && subOfferIDs.length>0){
        //in case of a master order, we need to create sub-orders separately
        // await storeConfirmedOffer(confirmedOffer, passengers, exchangeQuote, ORDER_TYPES.MASTER, subOfferIDs);
        //store results in redis (for cache purpose)
        let hotelSearchResults = await getHotelSearchResults(sessionID)
        let flightSearchResults = await getFlightSearchResults(sessionID)
        confirmedOfferId = `${confirmedOfferId}-master`;
        for(let subOfferId of subOfferIDs){
            let originalSubOffer;
            let searchPassengers;
            if(hotelSearchResults && hotelSearchResults.offers[subOfferId]){
                //offer found in hotel results
                originalSubOffer =  hotelSearchResults.offers[subOfferId];
                searchPassengers = hotelSearchResults.passengers;
            }
            if(flightSearchResults && flightSearchResults.offers[subOfferId]){
                //offer found in flight results
                originalSubOffer =  flightSearchResults.offers[subOfferId];
                searchPassengers = flightSearchResults.passengers;
            }
            if(!originalSubOffer){
                console.log(`sub offer ${subOfferId} not found in cached search results`);
            }else{
                console.log(`sub offer ${subOfferId} found in cached search results`);
                originalSubOffer.offerId=subOfferId;
                childOfferIDs.push(originalSubOffer.offerId)
                let paxDetails = rewritePassengers(passengers,searchPassengers);
                //store child offer
                await storeConfirmedOffer(originalSubOffer, paxDetails, null, ORDER_TYPES.SINGLE, [], confirmedOfferId);
            }
        }
        confirmedOffer.offerId = confirmedOfferId;      //IMPORTANT - master offer ID changes to avoid confict with one of child offers
        //store master offer
        await storeConfirmedOffer(confirmedOffer, passengers, exchangeQuote, ORDER_TYPES.MASTER, childOfferIDs);
    }else{
        console.log('Master offerID',confirmedOffer.offerId)
        await storeConfirmedOffer(confirmedOffer, passengers, exchangeQuote, ORDER_TYPES.SINGLE, []);
    }
    return {confirmedOffer, exchangeQuote};
}

const findPax = (paxType, list) =>{
    for(let pax of list){
        if(!pax.used && pax.type === paxType){
            pax.used=true;
            return pax;
        }
    }
    return null;
}
const rewritePassengers = (userProvided, searchPassengers) => {
    let results = [];
    let userData = JSON.parse(JSON.stringify(userProvided));
    let searchPaxList=[]
    Object.keys(searchPassengers).forEach(paxID => {
        let {pax,count, type}=searchPassengers[paxID];
        count=count||1
        for(let i=0;i<count;i++)
            searchPaxList.push({
                id:paxID,
                type:type
            })
    });

    let webPaxList=[]

    Object.keys(userData).forEach(paxID => {
        let rec=userData[paxID];
        webPaxList.push(rec)
    });

    for(let pax of searchPaxList){
        //find pax in web details
        let webPax = findPax(pax.type, webPaxList);
        if(!webPax)
            throw new Error(`One of users from search criteria not found in data from web, paxID:${pax.id}`);
        let record = {
            id:pax.id,
            "type": pax.type,
            "civility": webPax.civility,
            "lastnames": [webPax.lastName],
            "firstnames": [webPax.firstName],
            "gender": webPax.civility === 'MR' ? 'Male' : 'Female',
            "birthdate": webPax.birthdate.substring(0,10),
            "contactInformation": [
                webPax.phone,
                webPax.email
            ]
        }
        results.push(record)
    }
    return results;
}

const getExchangeQuote = async (confirmedOffer) => {
    const {
        public: publicPrice,
        currency
    } = confirmedOffer.offer.price;
    let amount = publicPrice;
    let exchangeQuote;

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

        exchangeQuote = {
            quoteId,
            rate,
            sourceAmount,
            sourceCurrency,
            targetAmount,
            targetCurrency
        };
    } else {

        // conversion disabled
        exchangeQuote = {
            quoteId: null,
            rate: 1,
            sourceAmount: publicPrice,
            sourceCurrency: 'USD',
            targetAmount: publicPrice,
            targetCurrency: 'USD'
        };
    }
    return exchangeQuote;
}

const convertCurrencyToUSD = async (currency, amount) => {
    return createQuoteAsync('USD', currency, amount);
};

const checkoutCrypto = async (req, res) => {
    const payload = req.body;
    const confirmedOfferId = payload.confirmedOfferId;
    logger.debug("confirmedOffer:", confirmedOfferId);

    const sessionID=req.sessionID;

    try{
        const {exchangeQuote, confirmedOffer} = await processCheckout(sessionID,confirmedOfferId);
        let amount = exchangeQuote.sourceAmount;
        return {
            offer: confirmedOffer,
            amount
        };
    }catch(err){
        logger.warn("Cannot find requested confirmedOffer in session storage, SessionID: %s", sessionID)
        sendErrorResponse(res,400,ERRORS.INVALID_INPUT,`Cannot find offer`,req.body);
        return;
    }
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
