const { ShoppingCart, CART_ITEMKEYS } = require('./_lib/shopping-cart');
const { seatmap } = require('./_lib/glider-api');
const { decorate } = require('./_lib/decorators');

// Controller for the seatmap request
const seatmapController = async (req, res) => {
    // Check the method
    if(req.method !== 'GET') {
        return res.status(405).json({message: "Method not Allowed"})
    }

    // Check the session
    const sessionID = req.sessionID;
    if(!sessionID) {
        return res.status(400).json({message: "No Session"})
    }

    // Get the offer IDs
    const shoppingCart = new ShoppingCart(sessionID);
    const offer = await shoppingCart.getItemFromCart(CART_ITEMKEYS.OFFER);
    if(!offer || !offer.offerId) {
        return res.status(404).json({message: "No offerId in Shopping Cart"})
    }

    // Get the seatmap using the offer ID
    const seatmapResult = await seatmap(offer.offerId);
    return res.status(200).json(seatmapResult);
}

module.exports = decorate(seatmapController);