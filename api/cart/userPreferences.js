const {ShoppingCart, CART_USER_PREFERENCES_KEYS} = require('../_lib/shopping-cart');
const {sendErrorResponse, ERRORS} = require("../_lib/rest-utils")
const logger = require('../_lib/logger').createLogger('/cart1')
const {decorate} = require('../_lib/decorators');
const {validateCartUserPreferencesPayload} = require('../_lib/validators')

const shoppingCartController = async (req, res) => {
    let sessionID = req.sessionID;
    let shoppingCart = new ShoppingCart(sessionID);
    let method = req.method;
    let cartUserPreferenceKey=CART_USER_PREFERENCES_KEYS.CURRENCY;

    // Handle creation of user preferences
    if(method === 'POST') {
        //validate if payload is OK
        validateCartUserPreferencesPayload(req.body);
        let currency = req.body.currency;
        await shoppingCart.setUserPreference(cartUserPreferenceKey, currency);
        res.json({result:"OK"})
    }
    else if(method === 'GET') {
        let currency = await shoppingCart.getUserPreference(cartUserPreferenceKey);        
        res.json({currency: currency});
    }
    else if(method === 'DELETE') {
        await shoppingCart.unsetUserPreference(cartUserPreferenceKey)
        res.json({result:"OK"})
    }else{
        logger.warn("Unsupported method:%s",req.method);
        sendErrorResponse(res,400,ERRORS.INVALID_METHOD,"Unsupported request method");
        return;
    }

}


module.exports = decorate(shoppingCartController);

