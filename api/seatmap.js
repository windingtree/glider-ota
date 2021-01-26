const { ShoppingCart, CART_ITEMKEYS } = require('./_lib/shopping-cart');
const { seatmap } = require('./_lib/glider-api');
const { decorate } = require('./_lib/decorators');
const { getOfferMetadata } = require('./_lib/models/offerMetadata');

// Controller for the seatmap request
const seatmapController = async (req, res) => {
    // Check the method
    if(req.method !== 'GET') {
        return res.status(405).json({error: {code: 405, message: "Method not Allowed"}});
    }

    // Check the session
    const sessionID = req.sessionID;
    if(!sessionID) {
        return res.status(400).json({error: {code: 400, message: "No Session"}});
    }

    // Get the offer IDs
    const shoppingCart = new ShoppingCart(sessionID);
    const offer = await shoppingCart.getItemFromCart(CART_ITEMKEYS.OFFER);
    if(!offer || !offer.offerId) {
        return res.status(400).json({error: {code: 400, message: "No offerId in Shopping Cart"}});
    }
    let offerMetadata = await getOfferMetadata(offer.offerId);
    if (!offerMetadata) {
        return res.status(500).json({error: {code: 500, message: `Offer metadata not found, offerId=${offer.offerId}`}});
    }

    // Get the seatmap using the offer ID
    try {
        const seatmapResult = await seatmap(offer.offerId, offerMetadata);
        return res.status(200).json(seatmapResult);
    } catch (error) {
        switch(error.response && error.response.status) {
            case undefined:
                return res.status(500).json({error: {code: 500, message: `Could not connect to Glider B2B`}});
            case 404:
                return res.status(404).json({error: {code: 404, message: `No seatmap available`}});
            case 400:
                return res.status(400).json({error: {code: 400, message: `Invalid pre-conditions for the seatmap`}});
            default:
                return res.status(502).json({error: {code: 502, message: `Error ${error.response.status} received from Glider B2B`}});
        }
    }


}

module.exports = decorate(seatmapController);
