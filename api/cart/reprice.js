const {reprice} = require('../_lib/glider-api');
const {createLogger} = require('../_lib/logger')
const {decorate} = require('../_lib/decorators');
const {ShoppingCart,CART_ITEMKEYS} = require('../_lib/shopping-cart');
const {sendErrorResponse,ERRORS} = require("../_lib/rest-utils")
const logger = createLogger('/offerSummary')

/**
 * /cart/reprice controller
 * This call should be made to re-price all items from the cart and get a final, binding price
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
const offerRepriceController = async (req, res) => {
    console.debug("#1/reprice called")
    logger.debug("#1/reprice called")
    let sessionID=req.sessionID;
    let shoppingCart = new ShoppingCart(sessionID);
    let offer = await shoppingCart.getItemFromCart(CART_ITEMKEYS.OFFER);
    console.debug("#2/reprice - offer retrieved")
    logger.debug("#2/reprice  - offer retrieved")

    if (offer == null || offer.offerId === undefined) {
        logger.warn("Cannot find offer or offerID in shopping cart, cannot re-price it");
        sendErrorResponse(res,400,ERRORS.INVALID_INPUT,"Cannot find offer in the shopping cart");
        return;
    }
    try{
        console.debug("#3/reprice - offer will be repriced")
        logger.debug("#3/reprice  - offer will be repriced")

        let confirmedOffer = await reprice(offer.offerId);
        console.debug("#4/reprice - offer was repriced")
        logger.debug("#4/reprice  - offer was repriced")
        await shoppingCart.addItemToCart(CART_ITEMKEYS.CONFIRMED_OFFER,confirmedOffer);
        console.debug("#5/reprice - confirmedOffer was added to the cart")
        logger.debug("#5/reprice  - confirmedOffer was added to the cart")

        res.json(confirmedOffer);
    }catch(error){
        logger.error("Got error while call to /offers/price, error:%s",error.message,error)
        sendErrorResponse(res,500,ERRORS.INTERNAL_SERVER_ERROR);
    }
}


module.exports = decorate(offerRepriceController);

