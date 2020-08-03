const {ShoppingCart,CART_ITEMKEYS} = require('../_lib/shopping-cart');
const {SessionStorage} = require('../_lib/session-storage');
const {sendErrorResponse,ERRORS} = require("../_lib/rest-utils")
const logger = require('../_lib/logger').createLogger('/cart1')
const {decorate} = require('../_lib/decorators');


/**
 * @module endpoint /cart/offer
 */


/**
 *  /cart/offer endpoint handler
 *  <p/>This endpoint is used to add/remove/retrieve flight offer to/from the shopping cart
 *  @async
 */

const cartOfferController = async (req, res) => {
    let sessionID = req.sessionID;
    let shoppingCart = new ShoppingCart(sessionID);
    let method = req.method;
    let cartItemKey=CART_ITEMKEYS.OFFER;
    if(method === 'POST') {
        let offer = req.body.offer;
        if(!validateOffer(res,offer))
            return;
        let cart =  await shoppingCart.addItemToCart(cartItemKey,offer,0);
        res.json({result:"OK"})
    }
    else if(method === 'GET') {
        let offer = await shoppingCart.getItemFromCart(cartItemKey);
        res.json(offer);
    }
    else if(method === 'DELETE') {
        await shoppingCart.removeItemFromCart(cartItemKey);
        res.json({result:"OK"})
    }else{
        logger.warn("Unsupported method:%s",req.method);
        sendErrorResponse(res,400,ERRORS.INVALID_METHOD,"Unsupported request method");
        return;
    }

}

function validateOffer(res, offer){
    if(offer===undefined)
        return sendValidationErrorResponse(res,"offer","empty or missing");

    if(isNullOrEmpty(offer.offerId))
        return sendValidationErrorResponse(res,"offerId","empty or missing");

/*
    let offerItems=offer.offerItems;
    if(offerItems === undefined)
        return sendValidationErrorResponse(res,"offerItems","empty or missing");
*/

/*
    let pricePlansReferences=offer.pricePlansReferences;
    if(pricePlansReferences === undefined)
        return sendValidationErrorResponse(res,"pricePlansReferences","empty or missing");
*/
    return true;
}

function isNullOrEmpty(str){
    return (str === undefined || str=='')
}


function sendValidationErrorResponse(res, fieldName, validationMessage){
    sendErrorResponse(res,400,ERRORS.VALIDATION_ERROR,validationMessage,{fieldName:fieldName});
    return false;
}

module.exports = decorate(cartOfferController);

