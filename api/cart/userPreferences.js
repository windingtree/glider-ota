const {ShoppingCart, CART_USER_PREFERENCES_KEYS} = require('../_lib/shopping-cart');
const {sendErrorResponse, ERRORS} = require("../_lib/rest-utils")
const logger = require('../_lib/logger').createLogger('/cart1')
const {decorate} = require('../_lib/decorators');
const {validateCartUserPreferencesPayload} = require('../_lib/validators')

const shoppingCartController = async (req, res) => {
    let sessionID = req.sessionID;
    let shoppingCart = new ShoppingCart(sessionID);
    let method = req.method;

    // Handle creation of user preferences
    if(method === 'POST') {
        //validate if payload is OK
        validateCartUserPreferencesPayload(req.body);

        // Set currency
        let currency = req.body.currency;
        if(currency !== undefined) {
            await shoppingCart.setUserPreference(CART_USER_PREFERENCES_KEYS.CURRENCY, currency);
        }

        // Set payment method
        let paymentMethod = req.body.paymentMethod;
        if(paymentMethod !== undefined) {
            await shoppingCart.setUserPreference(CART_USER_PREFERENCES_KEYS.PAYMENT_METHOD, paymentMethod);
        }
        
        res.json({result:"OK"})
    }
    else if(method === 'GET') {
        let currency = await shoppingCart.getUserPreference(CART_USER_PREFERENCES_KEYS.CURRENCY);
        let paymentMethod = await shoppingCart.getUserPreference(CART_USER_PREFERENCES_KEYS.PAYMENT_METHOD);
        res.json({currency: currency, paymentMethod: paymentMethod});
    }
    else if(method === 'DELETE') {
        await shoppingCart.unsetUserPreference(CART_USER_PREFERENCES_KEYS.CURRENCY)
        await shoppingCart.unsetUserPreference(CART_USER_PREFERENCES_KEYS.PAYMENT_METHOD)
        res.json({result:"OK"})
    }else{
        logger.warn("Unsupported method:%s",req.method);
        sendErrorResponse(res,400,ERRORS.INVALID_METHOD,"Unsupported request method");
        return;
    }

}


module.exports = decorate(shoppingCartController);

