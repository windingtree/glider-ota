import {FlightSearchResultsWrapper} from "../../src/utils/flight-search-results-wrapper";
import {HotelSearchResultsWrapper} from "../../src/utils/hotel-search-results-wrapper";

const {ShoppingCart, CART_ITEMKEYS} = require('../_lib/shopping-cart');
const {sendErrorResponse, ERRORS} = require("../_lib/rest-utils")
const {decorate} = require('../_lib/decorators');
const {getHotelSearchResults, getFlightSearchResults} = require('../_lib/cache');
const logger = require('../_lib/logger').createLogger('/cart1');

const shoppingCartController = async (req, res) => {
    let method = req.method;

    if (method === 'POST') {
        //store item
        await genericCartPostController(req, res);
    }
    if (method === 'GET') {
        //get entire cart
        await genericCartGetController(req, res);
    }
    if (method === 'DELETE') {
        await genericCartDeleteController(req, res);
    }
}

const genericCartPostController = async (req, res) => {
    let sessionID = req.sessionID;
    let shoppingCart = new ShoppingCart(sessionID);
    let type = req.body.type;
    let offerId = req.body.offerId;

    if ((!type || type.length === 0) || (!offerId || offerId.length === 0)) {
        logger.warn("Invalid parameters for /cart/cartv2");
        sendErrorResponse(res, 400, ERRORS.INVALID_INPUT, "Invalid parameters");
        return;
    }

    let cartItem;       //item contents


    type = type.toUpperCase();
    let data;
    switch (type) {
        case CART_ITEMKEYS.TRANSPORTATION_OFFER:
            data = await getFlightSearchResults(sessionID);
            cartItem = await flightOfferCartItemCreator(shoppingCart, offerId, data);
            break;
        case CART_ITEMKEYS.ACCOMMODATION_OFFER:
            data = await getHotelSearchResults(sessionID)
            cartItem = await hotelOfferCartItemCreator(shoppingCart, offerId, data);
            break;
        case CART_ITEMKEYS.INSURANCE_OFFER:
            break;
        default:
            sendErrorResponse(res, 400, ERRORS.INVALID_INPUT, "Unknown item type");
            return;
    }

    if (!data) {
        sendErrorResponse(res, 400, ERRORS.INVALID_INPUT, "Search results not found - most likely expired");
        return;
    }
    if (!cartItem) {
        sendErrorResponse(res, 400, ERRORS.INTERNAL_SERVER_ERROR, "Cart item was not created");
        return;
    }
    //TODO add payload validation
    await shoppingCart.addItemToCart(type, cartItem, cartItem.price);

    // Override price with quoted price
    if (cartItem.quote !== undefined) {
        cartItem.price = {
            currency: cartItem.quote.currency,
            public: cartItem.quote.amount,
        }
    }

    res.json({result: "OK", item: cartItem})
}
const genericCartGetController = async (req, res, cartItemKey, cartItem, itemPrice) => {
    // Retrieve cart
    let sessionID = req.sessionID;
    let shoppingCart = new ShoppingCart(sessionID);
    let cart = await shoppingCart.getCart();
    let opcIncreaseFactor = await shoppingCart.getOpcIncreaseFactor();

    // Override prices with quoted prices
    let cartKeys = Object.keys(cart.items);
    for (let i = 0; i < cartKeys.length; i++) {
        let itemKey = cartKeys[i];
        let quote = cart.items[itemKey].quote;

        if (quote !== undefined) {
            cart.items[itemKey].price = {
                currency: quote.currency,
                public: Number(quote.amount * opcIncreaseFactor).toFixed(2),
            };
            delete (cart.items[itemKey].quote);
        } else {
            if (cart.items[itemKey].price) {
                delete (cart.items[itemKey].price.commission);
                delete (cart.items[itemKey].price.taxes);
                cart.items[itemKey].price.public = Number(cart.items[itemKey].price.public * opcIncreaseFactor).toFixed(2);
            }
        }
    }

    res.json(cart);
}
const genericCartDeleteController = async (req, res, cartItemKey, cartItem, itemPrice) => {
    let sessionID = req.sessionID;
    let shoppingCart = new ShoppingCart(sessionID);
    let {types, offerId} = req.body;


    if (offerId) {    //orderId parameter exists - delete from cart by orderId
        //delete specific orderID
        let cart = await shoppingCart.getCart();
        if (!cart || !cart.items || cart.items.length === 0) {
            res.json({result: "OK"})
            return;
        }
        for (let cartKey in cart.items) {
            let cartItem = cart.items[cartKey];
            const {item} = cartItem;
            if (item && item.offerId === offerId) {
                await shoppingCart.removeItemFromCart(cartKey);
            }
        }

    } else if (types) {
        if (!Array.isArray(types) || types.length === 0) {
            sendErrorResponse(res, 400, ERRORS.INVALID_INPUT, "TYPES parameter is expected to be a non-empty array");
            return;
        }

        //delete request item types
        for (let type of types) {
            type = type.toUpperCase();
            console.log('delete from cart:', type)
            await shoppingCart.removeItemFromCart(type);
        }

    } else {
        sendErrorResponse(res, 400, ERRORS.INVALID_INPUT, "Missing either TYPES or OFFERID parameters ");
        return;

    }
    res.json({result: "OK"})
}

const flightOfferCartItemCreator = async (shoppingCart, offerId, searchResults) => {
    let offerIds = offerId.split(',');
    let searchResultsWrapper = new FlightSearchResultsWrapper(searchResults)

    let itineraries;
    let offer;
    let price;
    //dirty hack to deal with combined out&returned - FIXME
    if (offerIds.length == 1) {
        itineraries = searchResultsWrapper.getOfferItineraries(offerId);
        offer = searchResults.offers[offerId];
        price = offer.price;
    } else if (offerIds.length == 2) {
        let outboundOfferId = offerIds[0];
        let inboundOfferId = offerIds[1];
        let outboundItineraries = searchResultsWrapper.getOfferItineraries(outboundOfferId);
        let inboundItineraries = searchResultsWrapper.getOfferItineraries(inboundOfferId);
        itineraries = [...outboundItineraries, ...inboundItineraries];
        offer = mergeRoundTripOffers(searchResults, outboundOfferId, inboundOfferId);
        price = offer.price;
    } else {
        throw new Error("Open jaw offers are not supported");
    }
    let genericCartItem = shoppingCart.createCartItem(offerId, offer, price);      //initialize cart item record with required properties
    let cartItem = Object.assign(genericCartItem, {
        itineraries: itineraries,
    });
    return cartItem;
}

const hotelOfferCartItemCreator = async (shoppingCart, offerId, searchResults) => {
    let searchResultsWrapper = new HotelSearchResultsWrapper(searchResults);

    let offer = searchResults.offers[offerId];

    let planRefId = Object.keys(offer.pricePlansReferences)[0];
    let pricePlanRef = offer.pricePlansReferences[planRefId];
    let accommodation = pricePlanRef.accommodation;
    let roomType = pricePlanRef.roomType;
    let hotel = searchResultsWrapper.getAccommodation(accommodation);
    let room = hotel.roomTypes[roomType]
    let price = offer.price;

    let genericCartItem = shoppingCart.createCartItem(offerId, offer, price);      //initialize cart item record with required properties
    //add additional details to a cart items
    let cartItem = Object.assign(genericCartItem, {
        hotel: hotel,
        room: room
    });
    return cartItem;
}


const mergeRoundTripOffers = (searchResults, outboundOfferId, inboundOfferId) => {

    // Retrieve details of both offers
    let outboundOffer = searchResults.offers[outboundOfferId];
    let inboundOffer = searchResults.offers[inboundOfferId];

    // Get the plan key, there is exactly one since it was filtered above
    let outboundPlanKey = Object.keys(outboundOffer.pricePlansReferences)[0];
    let inboundPlanKey = Object.keys(inboundOffer.pricePlansReferences)[0];

    let newPricePlansReferences = {};

    // If keys are the same, the flight list contains the two flights
    if (inboundPlanKey === outboundPlanKey) {
        newPricePlansReferences[outboundPlanKey] = {
            flights: [
                outboundOffer.pricePlansReferences[outboundPlanKey].flights[0],
                inboundOffer.pricePlansReferences[inboundPlanKey].flights[0],
            ]
        };
    }

    // Otherwise there is one key per pricePlan / flight
    else {
        newPricePlansReferences[outboundPlanKey] = outboundOffer.pricePlansReferences[outboundPlanKey];
        newPricePlansReferences[inboundPlanKey] = inboundOffer.pricePlansReferences[inboundPlanKey];
    }

    // Return the merged offer
    let mergedOffer = {
        expiration: Date(inboundOffer.expiration) < Date(outboundOffer.expiration) ? inboundOffer.expiration : outboundOffer.expiration,
        pricePlansReferences: newPricePlansReferences,
        price: {
            currency: inboundOffer.price.currency,
            public: Number(Number(inboundOffer.price.public) + Number(outboundOffer.price.public)).toFixed(2),
            taxes: Number(Number(inboundOffer.price.taxes) + Number(outboundOffer.price.taxes)).toFixed(2),
        }
    }


    return mergedOffer;
};

module.exports = decorate(shoppingCartController);

