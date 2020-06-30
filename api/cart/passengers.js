const {ShoppingCart,CART_ITEMKEYS} = require('../_lib/shopping-cart');
const {SessionStorage} = require('../_lib/session-storage');
const {sendErrorResponse,ERRORS} = require("../_lib/rest-utils")
const logger = require('../_lib/logger').createLogger('/cart1')
const {decorate} = require('../_lib/decorators');

const shoppingCartController = async (req, res) => {
    let sessionID = req.sessionID;
    let shoppingCart = new ShoppingCart(sessionID);
    let method = req.method;
    let cartItemKey=CART_ITEMKEYS.PASSENGERS;
    if(method === 'POST') {
        let passengers = req.body.passengers;
        if(!validatePassengers(res,passengers))
            return;
        let cart =  await shoppingCart.addItemToCart(cartItemKey,passengers,0);
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

function validatePassengers(res, passengers){
    if(passengers===undefined || passengers.length==0)
        return sendValidationErrorResponse(res,"passengers","empty or missing");
    for(let i=0;i<passengers.length;i++){
        let pax=passengers[i];
        let paxId=pax.id;
        if(isNullOrEmpty(paxId))
            return sendValidationErrorResponse(res,"id","empty or missing",undefined);
        if(isNullOrEmpty(pax.type))
            return sendValidationErrorResponse(res,"type","empty or missing",paxId);
        if(isNullOrEmpty(pax.civility))
            return sendValidationErrorResponse(res,"civility","empty or missing",paxId);
        if(isNullOrEmpty(pax.lastName))
            return sendValidationErrorResponse(res,"lastName","empty or missing",paxId);
        if(isNullOrEmpty(pax.firstName))
            return sendValidationErrorResponse(res,"firstName","empty or missing",paxId);
        // if(isNullOrEmpty(pax.gender))
        //     return sendValidationErrorResponse(res,"gender","empty or missing",paxId);
        if(isNullOrEmpty(pax.birthdate))//TODO add date validation
            return sendValidationErrorResponse(res,"birthdate","empty or missing",paxId);
        if(isNullOrEmpty(pax.phone))//TODO add phone number validation
            return sendValidationErrorResponse(res,"phone","empty or missing",paxId);
        if(isNullOrEmpty(pax.email))//TODO add email validation
            return sendValidationErrorResponse(res,"email","empty or missing",paxId);
    }
    return true;
}

function isNullOrEmpty(str){
    return (str === undefined || str=='')
}

function sendValidationErrorResponse(res, fieldName, validationMessage, paxId){
    sendErrorResponse(res,400,ERRORS.VALIDATION_ERROR,validationMessage,{fieldName:fieldName, id:paxId});
    return false;
};


module.exports = decorate(shoppingCartController);

