const { ShoppingCart, CART_ITEMKEYS } = require('../_lib/shopping-cart');
const { SessionStorage } = require('../_lib/session-storage');
const { sendErrorResponse, ERRORS } = require("../_lib/rest-utils");
const logger = require('../_lib/logger').createLogger('/cart1');
const { decorate } = require('../_lib/decorators');

/**
 * @module endpoint /cart/cart
 */


/**
 * /cart/cart endpoint handler
 *
 * <p/>This is a generic endpoint to add/remove/retrieve items from shopping cart.
 * <br/>More specialized endpoints exist to store specific type of items in cart:
 * <ul>
 *     <li>/cart/accommodation to add/remove/retrieve hotel stays to/from cart
 *     <li>/cart/offer to add/remove/retrieve flight offers to/from cart
 *     <li>/cart/passengers to add/remove/retrieve passengers to/from cart
 *     <li>/cart/seats to add/remove/retrieve seats to/from cart
 * </ul>
 *
 * @async
 */
const cartController = async (req, res) => {
    let sessionID = req.sessionID;
    let shoppingCart = new ShoppingCart(sessionID);
    let method = req.method;
    let cartItemKey=req.body.key;
    if(method === 'POST') {
        let cart =  await shoppingCart.addItemToCart(cartItemKey,req.body.item,0);
        res.json(cart)
    }
    else if(method === 'GET') {
        let key = req.query.key;
        if(key !== undefined){
            logger.debug("Retrieve item from cart[%s]",key)
            let record = await shoppingCart.getItemFromCart(key);
            res.json(record);
        }else{
            logger.debug("Retrieve entire cart",key)
            let cart = await shoppingCart.getCart();
            res.json(cart);
        }
    }
    else if(method === 'DELETE') {
        await shoppingCart.removeItemFromCart(cartItemKey);
        res.json({result:"OK"})
    }else{
        logger.warn("Unsupported method:%s",req.method);
        sendErrorResponse(res,405,ERRORS.INVALID_METHOD,"Unsupported request method");
        return;
    }

}


module.exports = decorate(cartController);

