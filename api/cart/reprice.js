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
    let finalUmbrellaOffer;
    let grandTotalPrice=0;
    try{
        let confirmedTransportationOffer;
        if(transportationOffer){
            confirmedTransportationOffer = await repriceTransportationOffer(transportationOffer, seatOptions)
            confirmedTransportationOffer.offer.price = await shoppingCart.estimatePriceInUserPreferredCurrency(confirmedTransportationOffer.offer.price);
            subOfferIDs.push(confirmedTransportationOffer.offerId); //store ID of confirmed flight offer in a list
            finalUmbrellaOffer=confirmedTransportationOffer;
            // subTotalPrices.push(confirmedTransportationOffer.offer.price);
            grandTotalPrice+=Number(confirmedTransportationOffer.offer.price.public);
        }

        if(accommodationOffer){
            //for accomodation offer we should already have it in user pref currency but just in case it is not, try to convert
            accommodationOffer.price = await shoppingCart.estimatePriceInUserPreferredCurrency(accommodationOffer.price);
            accommodationOffer
            subOfferIDs.push(accommodationOffer.offerId); //store ID of hotel offer in a list too
            if(!finalUmbrellaOffer)
                finalUmbrellaOffer=accommodationOffer;
            // subTotalPrices.push(accommodationOffer.offer.price);
            grandTotalPrice+=Number(accommodationOffer.offer.price.public);
        }
        finalUmbrellaOffer.subOfferIDs=subOfferIDs;

        let userCurrency = await shoppingCart.getUserPreference(CART_USER_PREFERENCES_KEYS.CURRENCY);
        finalUmbrellaOffer.offer.price.currency=userCurrency;
        finalUmbrellaOffer.offer.price.public=grandTotalPrice;

        await shoppingCart.addItemToCart(CART_ITEMKEYS.CONFIRMED_OFFER,finalUmbrellaOffer);
        res.json(finalUmbrellaOffer);
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
    let confirmedTransportationOffer = await reprice(transportationOffer.offerId, seatOptions,offerMetadata);


    return confirmedTransportationOffer;
}


module.exports = decorate(offerRepriceController);

