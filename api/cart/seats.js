const { ShoppingCart, CART_ITEMKEYS } = require('../_lib/shopping-cart');
const { SessionStorage } = require('../_lib/session-storage');
const { sendErrorResponse, ERRORS } = require("../_lib/rest-utils");
const logger = require('../_lib/logger').createLogger('/cart1');
const { decorate } = require('../_lib/decorators');

const seatRequestHandler = async (req, res) => {
    const shoppingCart = new ShoppingCart(req.sessionID);

    switch(req.method) {
        case 'POST': 
            // Retrieve and check the seats
            let seats = req.body;
            if(!seats && !Array.isArray(seats)) {
                res.status(400).json({message:"Seat request format is invalid"});
            } else {
                seats = seats.map(seat => {
                    let {code, passenger, seatNumber, segment} = seat;
                    if(!code) res.status(400).json({message:"Missing seat code"});
                    if(!passenger) res.status(400).json({message:"Missing seat passenger"});
                    if(!seatNumber) res.status(400).json({message:"Missing seat seatNumber"});
                    if(!segment) res.status(400).json({message:"Missing seat segment"});
                    return {code, passenger, seatNumber, segment};
                });
            }

            // Add items to cart
            shoppingCart.addItemToCart(CART_ITEMKEYS.SEATS, req.body, 0)
                .then(() => {
                    res.status(200).json({result:"OK"});
                })
                .catch(error => {
                    logger.error("Failed to add seats to cart: %s", error);
                    res.status(500).json({message:"Failed to add seats to shopping cart"});
                });
            break;
            
        default:
            logger.warn("Unsupported method:%s",req.method);
            res.status(405).json({message:"Method Not Supported"});
    }

}

module.exports = decorate(seatRequestHandler);