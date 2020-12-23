const {storeFlightSearchResults} = require("../_lib/cache");
const {storeHotelSearchResults} = require("../_lib/cache");
const {ShoppingCart} = require('../_lib/shopping-cart');
const {sendErrorResponse, ERRORS} = require("../_lib/rest-utils")
const {decorate} = require('../_lib/decorators');

const controller = async (req, res) => {
    let method = req.method;
    if (method === 'DELETE') {
        let sessionID = req.sessionID;
        let shoppingCart = new ShoppingCart(sessionID);
        //remove all items from cart
        await shoppingCart.emptyCart();

        //delete previous search results
        await storeHotelSearchResults(sessionID,{});
        await storeFlightSearchResults(sessionID,{});
    } else {
        sendErrorResponse(res, 400, ERRORS.INVALID_INPUT, "Unknown operation");
        return;
    }

    res.json({result:"OK"})
}


module.exports = decorate(controller);

