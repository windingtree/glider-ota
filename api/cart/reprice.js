const {reprice} = require('../_lib/glider-api');
const {createLogger} = require('../_lib/logger')
const {decorate} = require('../_lib/decorators');
const {ShoppingCart, CART_ITEMKEYS, CART_USER_PREFERENCES_KEYS} = require('../_lib/shopping-cart');
const {sendErrorResponse, ERRORS} = require("../_lib/rest-utils")
const {getOfferMetadata} = require("../_lib/model/offerMetadata")
const logger = createLogger('/offerSummary')
const {v4} = require('uuid');
const {SessionStorage} = require('../_lib/session-storage');

/**
 * /cart/reprice controller
 * This call should be made to re-price all items from the cart and get a final, binding price
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
const offerRepriceController = async (req, res) => {
    let sessionID = req.sessionID;
    let shoppingCart = new ShoppingCart(sessionID);
    let userPreferredPaymentMethod = req.body.paymentMethod;
    let userPreferredCurrency = req.body.currency;

    if(userPreferredCurrency){
        await shoppingCart.setUserPreference(CART_USER_PREFERENCES_KEYS.CURRENCY,userPreferredCurrency)
    }
    if(userPreferredPaymentMethod){
        await shoppingCart.setUserPreference(CART_USER_PREFERENCES_KEYS.PAYMENT_METHOD,userPreferredPaymentMethod)
    }

    let cart = await shoppingCart.getCart();        //retrieve entire cart, with all items and prices
    let transportationOfferItem = cart.items[CART_ITEMKEYS.TRANSPORTATION_OFFER];
    let seatOptions = cart.items[CART_ITEMKEYS.SEATS];
    let accommodationOfferItem = cart.items[CART_ITEMKEYS.ACCOMMODATION_OFFER];


    if (transportationOfferItem == null && accommodationOfferItem == null) {
        logger.warn("No flight offer nor hotel offer in cart - nothing to reprice.");
        sendErrorResponse(res, 400, ERRORS.INVALID_INPUT, "Cannot find valid offer in the shopping cart");
        return;
    }

    const masterOffer = {
        suboffers: [],
        totalPrice: null,
        offerId: `${v4()}-master`
    }
    let subOffers = [];
    try {
        //check what are the sub offers (e.g. flights, hotels, maybe insurances) that need to be combined into the final offer
        //if some offers require repricing - do it here (e.g. flight repricing)
        if (transportationOfferItem) {
            const {
                offerId: unConfirmedOfferId,
                offer: unConfirmedOffer,
                itineraries: flightItineraries,
                isOfferConfirmed
            } = transportationOfferItem.item;

            //check if flight offer, by any chance, is already confirmed?
            //it may happen if the user hit refresh or e.g. changed payment method (and already called /reprice previously)
            if(isOfferConfirmed === true){
                //if that was the case, there is no need to reprice flights again

            }else {

                //flights need to be repriced - call repricing API to get new confirmed price (and potentially new offerID)
                let repriceResponse = await repriceTransportationOffer(transportationOfferItem.item, seatOptions);
                const {offerId: confirmedOfferId, offer: confirmedOffer} = repriceResponse;
                //destructure response from repricing API
                const {price: confirmedPrice, pricedItems, disclosures, terms, options} = confirmedOffer;

                //since we need to display terms&conditions in UI - we need to copy part of reprice response to the master offer (it may also be needed at a later stage, e.g. confirmation email)
                Object.assign(masterOffer, {
                    pricedItems, disclosures, terms, options
                })
                //we need to replace existing transportation item in shopping cart (in order to recalculate price and quotes)
                transportationOfferItem = shoppingCart.createCartItem(confirmedOfferId, confirmedOffer, confirmedPrice);
                //itineraries should remain the same between unconfirmed and confirmed cart item
                //it would be difficult to re-generate itineraries as it's done using search results (see /api/cart/cartv2) and new offerID cannot be found in search results (as it's a new offerID)

                Object.assign(transportationOfferItem, {
                    itineraries: flightItineraries,
                    isOfferConfirmed:true   //this is to avoid repricing again
                })
                //finally add new item to the cart (and replace unconfirmed transportation offer)
                cart = await shoppingCart.addItemToCart(CART_ITEMKEYS.TRANSPORTATION_OFFER, transportationOfferItem, confirmedPrice)
            }
            // masterOffer.suboffers.push(cart.items[CART_ITEMKEYS.TRANSPORTATION_OFFER]);
        }
        if (accommodationOfferItem) {
            // masterOffer.suboffers.push(cart.items[CART_ITEMKEYS.ACCOMMODATION_OFFER]);
        }

        cart.totalPrice.public=10;
        masterOffer.totalPrice = cart.totalPrice;

        masterOffer.cartItems = cart.items;
        masterOffer.paymentMethod = cart.userPreferences.paymentMethod;

        const sessionStorage = new SessionStorage(sessionID);
        sessionStorage.storeConfirmedOfferInSession(masterOffer);

        res.json(masterOffer);
    } catch (error) {
        logger.error("Got error while call to /offers/price, error:%s", error.message, error)
        sendErrorResponse(res, 500, ERRORS.INTERNAL_SERVER_ERROR);
    }
}

const repriceTransportationOffer = async (transportationOffer, seatOptions) => {
    //here it can be either single offerID or a list (comma separated, if we combined out and return one ways)
    let offerIDs = transportationOffer.offerId.split(',');
    //even if we have multiple offerIDs, assumption is that they all come from the same provider
    //therefore we just need to take first offerID and find metadata
    let offerId = offerIDs[0];

    let offerMetadata = await getOfferMetadata(offerId);
    if (!offerMetadata) {
        logger.error(`Offer metadata not found, offerId=${transportationOffer.offerId}`);
        throw new Error(`Offer metadata not found, offerId=${transportationOffer.offerId}`);
    }
    let confirmedTransportationOffer
    try {
        confirmedTransportationOffer = await reprice(transportationOffer.offerId, seatOptions, offerMetadata);
    } catch (err) {
        console.error(err)
        //REMOVE THIS - it's for testing only
        console.error('Repricing failed - ignore for now')
        confirmedTransportationOffer = transportationOffer;
    }

    return confirmedTransportationOffer;
}


module.exports = decorate(offerRepriceController);

