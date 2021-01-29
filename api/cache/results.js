const {getFlightSearchResults, getHotelSearchResults} = require('../_lib/cache');
const {sendErrorResponse, ERRORS} = require("../_lib/rest-utils");
const logger = require('../_lib/logger').createLogger('/cart1');
const {decorate} = require('../_lib/decorators');
const {ShoppingCart} = require('../_lib/shopping-cart');

const cachedResultsController = async (req, res) => {
    let sessionID = req.sessionID;
    const shoppingCart = new ShoppingCart(sessionID);

    let method = req.method;
    if (method !== 'GET') {
        logger.warn("Unsupported method:%s", req.method);
        sendErrorResponse(res, 400, ERRORS.INVALID_METHOD, "Unsupported request method");
        return;
    }
    let type = (req.query.type || '').toLowerCase();
    let data;
    try {
        if (type === 'flights') {
            data = await getFlightSearchResults(sessionID);
        } else if (type === 'hotels') {
            data = await getHotelSearchResults(sessionID);
        }
    } catch (err) {
        console.error(err)
        logger.warn("Failed to retrieve cached search results, sessionID:%s", sessionID);
        sendErrorResponse(res, 400, ERRORS.INTERNAL_SERVER_ERROR, "Could not retrieve cached results");
        return;
    }
    if (!data || !data.offers) {
        //no data cached - normal case if it's initial load
        res.json({})
        return;
    }

    // convert prices to user currency
    for(let i=0; i<Object.keys(data.offers).length; i++) {
        // Retrieve offer details
        let offerId = Object.keys(data.offers)[i];
        let convertedPrice = await shoppingCart.estimatePriceInUserPreferredCurrency(data.offers[offerId].price);
        data.offers[offerId].price = convertedPrice;
    }

    res.json({data: data})
}

module.exports = decorate(cachedResultsController);

