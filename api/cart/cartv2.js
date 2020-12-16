import {FlightSearchResultsWrapper} from "../../src/utils/flight-search-results-wrapper";
import {HotelSearchResultsWrapper} from "../../src/utils/hotel-search-results-wrapper";

const {ShoppingCart,CART_ITEMKEYS} = require('../_lib/shopping-cart');
const {sendErrorResponse,ERRORS} = require("../_lib/rest-utils")
const {decorate} = require('../_lib/decorators');
const {getHotelSearchResults, getFlightSearchResults} = require('../_lib/cache');
const logger = require('../_lib/logger').createLogger('/cart1');

const shoppingCartController = async (req, res) => {
    let sessionID = req.sessionID;
    let method = req.method;

    if(method === 'POST') {
        //store item
        await genericCartPostController(req,res);
    }
    if(method === 'GET') {
        //get entire cart
        await genericCartGetController(req,res);
    }
    if(method === 'DELETE') {
        //delete item from cart
        //TODO
    }


}

const genericCartPostController = async (req,res) =>{
    let sessionID = req.sessionID;
    let shoppingCart = new ShoppingCart(sessionID);
    let type = req.body.type;
    let offerId = req.body.offerId;

    if((!type || type.length===0) || (!offerId || offerId.length===0)) {
        logger.warn("Invalid parameters for /cart/cartv2");
        sendErrorResponse(res, 400, ERRORS.INVALID_INPUT, "Invalid parameters");
        return;
    }

    let cartItemKey;    //key under which it will be stored in cart
    let cartItem;       //item contents


    type = type.toUpperCase();
    let data;
    switch(type){
        case CART_ITEMKEYS.TRANSPORTATION_OFFER:
            data = await getFlightSearchResults(sessionID);
            cartItem = await flightOfferCartItemCreator(offerId,data);
            break;
        case CART_ITEMKEYS.ACCOMMODATION_OFFER:
            data = await getHotelSearchResults(sessionID)
            cartItem = await hotelOfferCartItemCreator(offerId,data);
            break;
        case CART_ITEMKEYS.INSURANCE_OFFER:
            break;
        default:
            sendErrorResponse(res, 400, ERRORS.INVALID_INPUT, "Unknown item type");
            return;
    }

    if(!data){
        sendErrorResponse(res, 400, ERRORS.INVALID_INPUT, "Search results not found - most likely expired");
        return;
    }
    if(!cartItem){
        sendErrorResponse(res, 400, ERRORS.INTERNAL_SERVER_ERROR, "Cart item was not created");
        return;
    }
    //TODO add payload validation
    await shoppingCart.addItemToCart(type, cartItem, cartItem.price);
    
    // Override price with quoted price
    if(cartItem.quote !== undefined) {
        cartItem.price = {
            currency: cartItem.quote.currency,
            public: cartItem.quote.amount,
        }
    }

    res.json({result:"OK", item: cartItem})
}
const genericCartGetController = async (req,res,cartItemKey, cartItem, itemPrice) =>{
    // Retrieve cart
    let sessionID = req.sessionID;
    let shoppingCart = new ShoppingCart(sessionID);
    let cart = await shoppingCart.getCart();

    // Override prices with quoted prices
    let cartKeys = Object.keys(cart.items);
    for(let i=0; i<cartKeys.length; i++) {
        let itemKey = cartKeys[i];
        let quote = cart.items[itemKey].quote;
        if(quote !== undefined) {
            cart.items[itemKey].price = {
                currency: quote.currency,
                public: quote.amount,
            };
            delete(cart.items[itemKey].quote);
        } else {
            if(cart.items[itemKey].price) {
                delete(cart.items[itemKey].price.commission);
                delete(cart.items[itemKey].price.taxes);
            }
        }
    }

    res.json(cart);
}
const genericCartDeleteController = async (req,res,cartItemKey, cartItem, itemPrice) =>{
    //TODO
}

const flightOfferCartItemCreator = async (offerId, searchResults) => {
    let searchResultsWrapper = new FlightSearchResultsWrapper(searchResults)
    let itineraries = searchResultsWrapper.getOfferItineraries(offerId);
    let offer = searchResults.offers[offerId];
    let price = offer.price;
    let cartItem = {
        offerId:offerId,
        offer:offer,
        itineraries:itineraries,
        price:price
    }
    return cartItem;
}

const hotelOfferCartItemCreator = async (offerId, searchResults) => {
    let searchResultsWrapper = new HotelSearchResultsWrapper(searchResults);

    let offer = searchResults.offers[offerId];

    let planRefId = Object.keys(offer.pricePlansReferences)[0];
    let pricePlanRef = offer.pricePlansReferences[planRefId];
    let accommodation = pricePlanRef.accommodation;
    let roomType = pricePlanRef.roomType;
    let hotel = searchResultsWrapper.getAccommodation(accommodation);
    let room = hotel.roomTypes[roomType]
    let price = offer.price;
    let cartItem = {
        offerId:offerId,
        offer:offer,
        price:price,
        hotel:hotel,
        room:room
    }
    return cartItem;
}


module.exports = decorate(shoppingCartController);

