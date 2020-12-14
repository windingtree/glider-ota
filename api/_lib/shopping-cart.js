const {createLogger} = require('./logger');
const logger = createLogger('session-storage');
const {SessionStorage} = require('./session-storage');
const {assertParameterNotEmpty} = require('./utils')
const _ = require('lodash');

// Possible items in the cart
const CART_ITEMKEYS = {
    OFFER : 'offer',
    PASSENGERS : 'passengers',
    SEATS : 'seats',
    ANCILLARIES : 'ancillaries',
    CONFIRMED_OFFER : 'confirmed-offer',
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
    async addItemToCart(cartKey, item, price = 0 ) {
        assertParameterNotEmpty("cartKey",cartKey);
        let record = {
            item: item,
            price: price
        }
        let cart = await this.sessionStorage.retrieveFromSession(SESSION_STORAGE_KEY);
        if (cart === null) {
            cart = this._initializeCartRecord();
        }
        cart.items[cartKey] = record;
        this._calculateTotalPrice(cart);
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
        this._calculateTotalPrice(cart);
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
        await this.sessionStorage.storeInSession(SESSION_STORAGE_KEY,cart);
        return cart;
    }

   /**
     * Unset a preference from the cart
     * @param userPreferenceKey
     * @returns {Promise<*>} Cart contents after operation
     */
    async unsetUserPreference(userPreferenceKey){
        return this.setUserPreference(userPreferenceKey, undefined)
    }


    _calculateTotalPrice(cart){
        cart.totalPrice = 0;
        _.each(cart.items, (record, key)=>{
            cart.totalPrice+=record.price;
        });
    }

    _initializeCartRecord(){
        return {
            totalPrice: 0,
            items: {},
            userPreferences: {},
        }
    }
}

module.exports = {
    ShoppingCart,
    CART_ITEMKEYS,
    CART_USER_PREFERENCES_KEYS,
}


