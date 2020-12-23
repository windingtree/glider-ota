const {createLogger} = require('./logger');
const logger = createLogger('session-storage');
const {SessionStorage} = require('./session-storage');
const {assertParameterNotEmpty} = require('./utils')
const _ = require('lodash');
const { createQuoteAsync, getRateAsync } = require('./simard-api');

// Possible items in the cart
const CART_ITEMKEYS = {
    OFFER : 'offer',
    PASSENGERS : 'passengers',
    SEATS : 'seats',
    ANCILLARIES : 'ancillaries',
    // CONFIRMED_OFFER : 'confirmed-offer',
    TRANSPORTATION_OFFER : 'TRANSPORTATION_OFFER',
    ACCOMMODATION_OFFER : 'ACCOMMODATION_OFFER',
    INSURANCE_OFFER : 'INSURANCE_OFFER',
};

// Possible cart preferences
const CART_USER_PREFERENCES_KEYS = {
    CURRENCY : 'currency',
    PAYMENT_METHOD: 'paymentMethod',
};

// Possible fees per payment method
const OPC_FEES = {
    'card':   0.05,
    'crypto': 0.02,
    'lif':    0.01,
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
        this.exchangeRates = {};
        this._cart = undefined;
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
        if(this._cart === undefined) {
            this._cart = await this.sessionStorage.retrieveFromSession(SESSION_STORAGE_KEY);
        }
        if(this._cart === null) {
            this._cart = this._initializeCartRecord();
        }
        return this._cart;
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
        let cart = await this.getCart();
        cart.items[cartKey] = record;
        this._cart = await this._updateTotalPrice(cart);
        await this.sessionStorage.storeInSession(SESSION_STORAGE_KEY,this._cart);
        return this._cart;
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
            this._cart = await this._updateTotalPrice(cart);
            await this.sessionStorage.storeInSession(SESSION_STORAGE_KEY,this._cart);
        }

        return this._cart;
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
        return cart.userPreferences[userPreferenceKey];
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
        this._cart = await this._updateTotalPrice(cart);
        await this.sessionStorage.storeInSession(SESSION_STORAGE_KEY,this._cart);
        return this._cart;
    }

   /**
     * Unset a preference from the cart
     * @param userPreferenceKey
     * @returns {Promise<*>} Cart contents after operation
     */
    async unsetUserPreference(userPreferenceKey){
        let defaultValue = undefined;
        if(userPreferenceKey === CART_USER_PREFERENCES_KEYS.CURRENCY) {
            defaultValue = 'USD';
        }
        if(userPreferenceKey === CART_USER_PREFERENCES_KEYS.PAYMENT_METHOD) {
            defaultValue = 'card';
        }
        return this.setUserPreference(userPreferenceKey, defaultValue);
    }

    async getOpcIncreaseFactor() {
        let cart = await this.getCart();
        let paymentMethod = cart.userPreferences.paymentMethod;
        return(1.0 + OPC_FEES[paymentMethod]);
    }



    // Convert a price record to the user preferred currency
    async estimatePriceInUserPreferredCurrency(offerPrice) {
        // Retrieve user's preferred currency
        let userCurrency = await this.getUserPreference(CART_USER_PREFERENCES_KEYS.CURRENCY);
        let paymentMethodFeeIncrease = await this.getOpcIncreaseFactor();

        // If the supplier price is already in the user currency return it
        if(offerPrice.currency === userCurrency) {
            return {
                currency: userCurrency,
                public: Number(offerPrice.public * paymentMethodFeeIncrease).toFixed(2),
                isEstimated: false,
            }
        }

        // Retrieve the exchange rate
        let rateKey = `${userCurrency}${offerPrice.currency}`;
        let exchangeRate = this.exchangeRates[rateKey];
        if(exchangeRate === undefined) {
            let rateResponse = await getRateAsync(offerPrice.currency, userCurrency);
            exchangeRate = Number(rateResponse.rate);
            this.exchangeRates[rateKey] = exchangeRate;
        }

          // Update offer price and currency
        return {
            currency: userCurrency,
            public: Number(offerPrice.public * exchangeRate * paymentMethodFeeIncrease).toFixed(2),
            isEstimated: true,
        }
    }

    // Update the total price in the cart
    async _updateTotalPrice(cart) {
        //logger.debug("Updating Cart total price");

        // Update the currency to the user preference
        cart.totalPrice.currency = cart.userPreferences.currency;
        let paymentMethodFeeIncrease = await this.getOpcIncreaseFactor();

        // Reset total price
        cart.totalPrice.public = 0;


        // Walk through each item in the cart
        for(let i=0; i<Object.keys(cart.items).length; i++) {
            let itemKey = Object.keys(cart.items)[i];
            let record = cart.items[itemKey];

            //logger.debug(`_updateTotalPrice: Processing ${itemKey} | ${JSON.stringify(record.price)}`);
            if(record.price) {
                let itemPrice = 0;

                // If currencies are the same price is already calculated
                if(record.price.currency === cart.totalPrice.currency) {
                    //logger.debug(`_updateTotalPrice: Same currency, no quoting`);
                    itemPrice = record.price.public;
                }

                // Otherwise quote the currency exchange
                else {
                    logger.debug(`_updateTotalPrice: Different currency, quoting | ${JSON.stringify(record)}`);

                    // Create a quote if not already quoted
                    if((record.quote === undefined) || (record.quote.currency !== cart.totalPrice.currency)) {
                        //logger.debug(`_updateTotalPrice: Quote does not exist, creating`);
                        let quote = await createQuoteAsync(cart.totalPrice.currency, record.price.currency, record.price.public);
                        //logger.debug(`_updateTotalPrice: Quote created: ${JSON.stringify(quote)}`);
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
                cart.totalPrice.public += (itemPrice * paymentMethodFeeIncrease);
            }
        }
        cart.totalPrice.public = cart.totalPrice.public.toFixed(2);    //round to two digits
        return cart;
    }

    _initializeCartRecord(){
        return {
            totalPrice: {
                public: 0,
                currency: 'USD',
            },
            items: {},
            userPreferences: {
                currency: 'USD',
                paymentMethod: 'card',
            },
        }
    }

    /**
     * Create a basic cart item object with required properties.
     * Client may add additional items (e.g. hotel details, flight details) but at least common structure should be kept (offerId, offer, price are required at later stages)
     * @param offerId
     * @param offer
     * @param price
     * @returns {{offer, price, offerId}}
     */
    createCartItem(offerId, offer, price){
        return {
            offerId:offerId,
            offer:offer,
            price:price
        }
    }


}

module.exports = {
    ShoppingCart,
    CART_ITEMKEYS,
    CART_USER_PREFERENCES_KEYS,
}


