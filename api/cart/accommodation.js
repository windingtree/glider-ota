const {ShoppingCart,CART_ITEMKEYS} = require('../_lib/shopping-cart');
const {sendErrorResponse,ERRORS} = require("../_lib/rest-utils")
const logger = require('../_lib/logger').createLogger('/cart1')
const {decorate} = require('../_lib/decorators');


/**
 * @module endpoint /cart/accommodation
 */


/**
 *  /cart/accommodation endpoint handler
 *  <p/>This endpoint is used to add/remove/retrieve hotel accommodation to/from the shopping cart
 *  @async
 */

const cartAccommodationController = async (req, res) => {
    let sessionID = req.sessionID;
    let shoppingCart = new ShoppingCart(sessionID);
    let method = req.method;
    let cartItemKey=CART_ITEMKEYS.CONFIRMED_OFFER;

    //store item in cart
    if(method === 'POST') {
        let offer = req.body.offer;
        if(!validateOffer(res,offer))
            return;
        let cart =  await shoppingCart.addItemToCart(cartItemKey,offer,0);
        res.json({result:"OK"})
    }
    //retrieve contents of cart
    else if(method === 'GET') {
        let offer = await shoppingCart.getItemFromCart(cartItemKey);
        res.json(offer);
    }
    //delete item from cart
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

    return true;
}

function isNullOrEmpty(str){
    return (str === undefined || str=='')
}


function sendValidationErrorResponse(res, fieldName, validationMessage){
    sendErrorResponse(res,400,ERRORS.VALIDATION_ERROR,validationMessage,{fieldName:fieldName});
    return false;
}

module.exports = decorate(cartAccommodationController);

