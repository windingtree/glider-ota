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
    let offer = await shoppingCart.getItemFromCart(CART_ITEMKEYS.OFFER);
    let seatOptions = await shoppingCart.getItemFromCart(CART_ITEMKEYS.SEATS);

    if (offer == null || offer.offerId === undefined) {
        logger.warn("Cannot find offer or offerID in shopping cart, cannot re-price it");
        sendErrorResponse(res,400,ERRORS.INVALID_INPUT,"Cannot find offer in the shopping cart");
        return;
    }
    try{

        let offerMetadata = await getOfferMetadata(offer.offerId);
        if (!offerMetadata) {
            logger.error(`Offer metadata not found, offerId=${offer.offerId}`);
            throw new Error(`Offer metadata not found, offerId=${offer.offerId}`);
        }

        let confirmedOffer = await reprice(offer.offerId, seatOptions,offerMetadata);
        await shoppingCart.addItemToCart(CART_ITEMKEYS.CONFIRMED_OFFER,confirmedOffer);
        res.json(confirmedOffer);
    }catch(error){
        logger.error("Got error while call to /offers/price, error:%s",error.message,error)
        sendErrorResponse(res,500,ERRORS.INTERNAL_SERVER_ERROR);
    }
}


module.exports = decorate(offerRepriceController);

