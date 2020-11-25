const {ShoppingCart,CART_ITEMKEYS} = require('../_lib/shopping-cart');
const {sendErrorResponse,ERRORS} = require("../_lib/rest-utils")
const logger = require('../_lib/logger').createLogger('/cart1')
const {decorate} = require('../_lib/decorators');
const {validateCartOfferPayload} = require('../_lib/validators')

const shoppingCartController = async (req, res) => {
    let sessionID = req.sessionID;
    let shoppingCart = new ShoppingCart(sessionID);
    let method = req.method;
    let cartItemKey=CART_ITEMKEYS.OFFER;
    if(method === 'POST') {
        //validate if payload is OK
        validateCartOfferPayload(req.body);
        let offer = req.body.offer;
        // if(!validateOffer(res,offer))
        //     return;

        await shoppingCart.addItemToCart(cartItemKey,offer,0);
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



module.exports = decorate(shoppingCartController);

