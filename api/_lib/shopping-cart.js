const {createLogger} = require('./logger');
const logger = createLogger('session-storage');
const {SessionStorage} = require('./session-storage');
const {assertParameterNotEmpty} = require('./utils')
const _ = require('lodash');
const { createQuoteAsync } = require('./simard-api');

// Possible items in the cart
const CART_ITEMKEYS = {
    OFFER : 'offer',
    PASSENGERS : 'passengers',
    SEATS : 'seats',
    ANCILLARIES : 'ancillaries',
    CONFIRMED_OFFER : 'confirmed-offer',
    TRANSPORTATION_OFFER : 'TRANSPORTATION_OFFER',
    ACCOMMODATION_OFFER : 'ACCOMMODATION_OFFER',
    INSURANCE_OFFER : 'insurance_offer'
};

// Possible cart preferences
const CART_USER_PREFERENCES_KEYS = {
    CURRENCY : 'currency',
};


/**
 * ShoppingCart supports server side storage of the shopping process.
 * Items can be added or removed from/to the cart.
 *
 */

const SESSION_STORAGE_KEY='shopping cart';

class ShoppingCart {

    constructor(sessionID) {
        assertParameterNotEmpty("sessionID",sessionID);
        logger.debug("Shopping cart created for sessionID:%s",sessionID);
        this.sessionID = sessionID;
        this.sessionStorage = new SessionStorage(sessionID);
    }

    /**
     * Upsert (add or replace) offer in the shopping cart.
     * Multiple items can be added to the shopping cart (e.g.  flights, hotelresults, passenger details, ancillaries).
     * cartKey parameter is supposed to identify what type of element is added to the cart.
     * If item with a given key is added for the first time, it will be normally added and can be later retrieved.
     * If item with a same key is added again, previously stored item is replaced with a new one.
     *
     * @param cartKey identifies what type of item is added to the cart (e.g. flight, seat selection, hotel)
     * @param item value which will be associated in the cart with a cartKey
     * @param price total price for added elements
     * @returns {Promise<*>} Cart contents after operation
     */
    async addItemToCart(cartKey, item, price = undefined ) {
        assertParameterNotEmpty("cartKey",cartKey);
        let record = {
            item: item,
            price: price, // public & currency in supplier currency
            quote: undefined, // will be set if user currency is different than supplier
        }
        let cart = await this.sessionStorage.retrieveFromSession(SESSION_STORAGE_KEY);
        if (cart === null) {
            cart = this._initializeCartRecord();
        }
        cart.items[cartKey] = record;
        cart = await this._updateTotalPrice(cart);
        await this.sessionStorage.storeInSession(SESSION_STORAGE_KEY,cart);
        return cart;
    }

    /**
     * Returns shopping cart content.
     * Object: {
     *     totalPrice,
     *     items:{}
     * }
     * @returns {Promise<*>} Cart contents after operation
     */
    async getCart(){
        let cart = await this.sessionStorage.retrieveFromSession(SESSION_STORAGE_KEY);
        if (cart === null) {
            cart = this._initializeCartRecord();
        }
        return cart;
    }

    /**
     * Removes item from cart
     * @param cartKey
     * @returns {Promise<*>} Cart contents after operation
     */
    async removeItemFromCart(cartKey){
        let cart = await this.getCart();
        if (cart.items[cartKey] !== undefined) {
            delete cart.items[cartKey];
        }
        cart = await this._updateTotalPrice(cart);
        await this.sessionStorage.storeInSession(SESSION_STORAGE_KEY,cart);
        return cart;
    }

    /**
     * Retrieves item from cart
     * @param cartKey
     * @returns {Promise<*>} Cart contents after operation
     */
    async getItemFromCart(cartKey){
        let cart = await this.getCart();
        let record = cart.items[cartKey];
        if(record == null)
            return null;
        return record.item;
    }

    /**
     * Retrieves a preference from the cart
     * @param userPreferenceKey
     * @returns {Promise<*>} Cart contents after operation
     */
    async getUserPreference(userPreferenceKey){
        let cart = await this.getCart();
        let record = cart.userPreferences[userPreferenceKey];
        if(record == null)
            return null;
        return record.item;
    }

   /**
     * Set a preference from the cart
     * @param userPreferenceKey
     * @param value The value to set
     * @returns {Promise<*>} Cart contents after operation
     */
    async setUserPreference(userPreferenceKey, value){
        let cart = await this.getCart();
        cart.userPreferences[userPreferenceKey] = value;
        cart = await this._updateTotalPrice(cart);
        await this.sessionStorage.storeInSession(SESSION_STORAGE_KEY,cart);
        return cart;
    }

   /**
     * Unset a preference from the cart
     * @param userPreferenceKey
     * @returns {Promise<*>} Cart contents after operation
     */
    async unsetUserPreference(userPreferenceKey){
        let defaultValue = undefined;
        if(userPreferenceKey === CART_USER_PREFERENCES_KEYS.CURRENCY) {
            defaultValue = 'USD'
        }
        return this.setUserPreference(userPreferenceKey, defaultValue);
    }


    // Update the total price in the cart
    async _updateTotalPrice(cart) {
        logger.debug("Updating Cart total price");

        // Update the currency to the user preference
        cart.totalPrice.currency = cart.userPreferences.currency;

        // Reset total price
        cart.totalPrice.public = 0;
        

        // Walk through each item in the cart
        for(let i=0; i<Object.keys(cart.items).length; i++) {
            let itemKey = Object.keys(cart.items)[i];
            let record = cart.items[itemKey];

            logger.debug(`_updateTotalPrice: Processing ${itemKey} | ${JSON.stringify(record.price)}`);
            if(record.price) {
                let itemPrice = 0;

                // If currencies are the same price is already calculated
                if(record.price.currency === cart.totalPrice.currency) {
                    logger.debug(`_updateTotalPrice: Same currency, no quoting`);
                    itemPrice = record.price.public;
                }

                // Otherwise quote the currency exchange
                else {
                    logger.debug(`_updateTotalPrice: Different currency, quoting | ${JSON.stringify(record)}`);

                    // Create a quote if not already quoted
                    if((record.quote === undefined) || (record.quote.currency !== cart.totalPrice.currency)) {
                        logger.debug(`_updateTotalPrice: Quote does not exist, creating`);
                        let quote = await createQuoteAsync(cart.totalPrice.currency, record.price.currency, record.price.public);
                        logger.debug(`_updateTotalPrice: Quote created: ${JSON.stringify(quote)}`);
                        cart.items[itemKey].quote = {
                            currency: quote.sourceCurrency,
                            amount: Number(quote.sourceAmount),
                            quoteId: quote.quoteId,
                        };
                    }

                    // Update the price
                    itemPrice = record.quote.amount;
                }

                // Increment total
                cart.totalPrice.public += itemPrice;
            }


        }

        return cart;
    }

    _initializeCartRecord(){
        return {
            totalPrice: {
                public: 0,
                currency: 'USD'
            },
            items: {},
            userPreferences: {
                currency: 'USD',
            },
        }
    }
}

module.exports = {
    ShoppingCart,
    CART_ITEMKEYS,
    CART_USER_PREFERENCES_KEYS,
}


