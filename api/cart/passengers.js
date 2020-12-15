const {ShoppingCart,CART_ITEMKEYS} = require('../_lib/shopping-cart');
const {sendErrorResponse,ERRORS} = require("../_lib/rest-utils")
const logger = require('../_lib/logger').createLogger('/cart1')
const {decorate} = require('../_lib/decorators');
const {validateCartPassengersPayload} = require('../_lib/validators')

const shoppingCartController = async (req, res) => {
    let sessionID = req.sessionID;
    let shoppingCart = new ShoppingCart(sessionID);
    let method = req.method;
    let cartItemKey=CART_ITEMKEYS.PASSENGERS;
    if(method === 'POST') {
        //validate if payload is OK
        validateCartPassengersPayload(req.body);

        let passengers = req.body.passengers;
        // if(!validatePassengers(res,passengers))
        //     return;
        await shoppingCart.addItemToCart(cartItemKey, passengers);
        res.json({result:"OK"})
    }
    else if(method === 'GET') {
        let passengers = await shoppingCart.getItemFromCart(cartItemKey);
        if(passengers === null)
            passengers={};//don't return "null" - return empty response
        res.json(passengers);
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

