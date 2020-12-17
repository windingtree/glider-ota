const {CART_USER_PREFERENCES_KEYS} = require("../_lib/shopping-cart");
const {reprice} = require('../_lib/glider-api');
const {createLogger} = require('../_lib/logger')
const {decorate} = require('../_lib/decorators');
const {ShoppingCart,CART_ITEMKEYS} = require('../_lib/shopping-cart');
const {sendErrorResponse,ERRORS} = require("../_lib/rest-utils")
const {getOfferMetadata} = require("../_lib/model/offerMetadata")
const logger = createLogger('/offerSummary')

/**
 * /cart/reprice controller
 * This call should be made to re-price all items from the cart and get a final, binding price
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
const offerRepriceController = async (req, res) => {
    let sessionID=req.sessionID;
    let shoppingCart = new ShoppingCart(sessionID);
    let transportationOffer = await shoppingCart.getItemFromCart(CART_ITEMKEYS.TRANSPORTATION_OFFER);
    let seatOptions = await shoppingCart.getItemFromCart(CART_ITEMKEYS.SEATS);
    let accommodationOffer = await shoppingCart.getItemFromCart(CART_ITEMKEYS.ACCOMMODATION_OFFER);

    if (transportationOffer == null && accommodationOffer == null) {
        logger.warn("No flight offer nor hotel offer in cart - nothing to reprice.");
        sendErrorResponse(res,400,ERRORS.INVALID_INPUT,"Cannot find valid offer in the shopping cart");
        return;
    }
    let subOfferIDs = [];
    let subTotalPrices = [];
    let finalMasterOffer;       //Master offer - may hold sub orders (flights, hotels, insurance)
    let grandTotalPrice=0;      //total price to be paid for an entire(master) order
    try{
        let confirmedTransportationOffer;
        if(transportationOffer){
            confirmedTransportationOffer = await repriceTransportationOffer(transportationOffer, seatOptions)
            confirmedTransportationOffer.offer.price = await shoppingCart.estimatePriceInUserPreferredCurrency(confirmedTransportationOffer.offer.price);

            subOfferIDs.push(confirmedTransportationOffer.offerId); //store ID of confirmed flight offer in a list
            finalMasterOffer=confirmedTransportationOffer;
            // confirmedTransportationOffer.offer.price.public=1;
            grandTotalPrice+=Number(confirmedTransportationOffer.offer.price.public);
        }

        if(accommodationOffer){
            //for accommodation offer we should already have it in user pref currency but just in case it is not, try to convert
            accommodationOffer.price = await shoppingCart.estimatePriceInUserPreferredCurrency(accommodationOffer.price);

            subOfferIDs.push(accommodationOffer.offerId); //store ID of hotel offer in a list too
            if(!finalMasterOffer)
                finalMasterOffer=accommodationOffer;
            // accommodationOffer.offer.price.public=1;
            // subTotalPrices.push(accommodationOffer.offer.price);
            grandTotalPrice+=Number(accommodationOffer.offer.price.public);
        }
        finalMasterOffer.subOfferIDs=subOfferIDs;

        let userCurrency = await shoppingCart.getUserPreference(CART_USER_PREFERENCES_KEYS.CURRENCY);
        let totalPrice = {
            currency:userCurrency,
            public: grandTotalPrice
        }
        finalMasterOffer.offer.price=totalPrice;
        finalMasterOffer.price=totalPrice;
        await shoppingCart.addItemToCart(CART_ITEMKEYS.CONFIRMED_OFFER,finalMasterOffer);
        res.json(finalMasterOffer);
    }catch(error){
        logger.error("Got error while call to /offers/price, error:%s",error.message,error)
        sendErrorResponse(res,500,ERRORS.INTERNAL_SERVER_ERROR);
    }
}

const repriceTransportationOffer = async (transportationOffer, seatOptions) =>{
    let offerMetadata = await getOfferMetadata(transportationOffer.offerId);
    if (!offerMetadata) {
        logger.error(`Offer metadata not found, offerId=${transportationOffer.offerId}`);
        throw new Error(`Offer metadata not found, offerId=${transportationOffer.offerId}`);
    }
    let confirmedTransportationOffer
    try {
        confirmedTransportationOffer = await reprice(transportationOffer.offerId, seatOptions, offerMetadata);
    }catch(err){
        //REMOVE THIS - it's for testing only
        console.error('Repricing failed - ignore for now')
        confirmedTransportationOffer=transportationOffer;
    }

    return confirmedTransportationOffer;
}


module.exports = decorate(offerRepriceController);

