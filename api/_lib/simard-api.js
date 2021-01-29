const {createLogger} = require('./logger');
const addDays = require("date-fns/addDays")
const axios = require('axios').default;
const {SIMARD_CONFIG} = require('./config');
const logger = createLogger('simard-api');

/**
 * Helper to create HTTP Headers
 */
function createHeaders(token) {
    return {
        'Authorization': 'Bearer ' + token,
        'accept': 'application/json',
        'Content-Type': 'application/json'
    }
}

/**
 * Creates guarantee in Simard for a given amount of money.
 * Guarantee is needed to fulfill an order
 * @param amount
 * @param currency
 * @returns {Promise<any>} response from /balances/guarantees Simard API
 */
function createGuarantee(amount, currency, creditorOrgId) {
    return new Promise(function(resolve, reject) {
        logger.debug("Creating guarantee for %s %s",amount,currency);
        let depositExpiration=addDays(new Date(),SIMARD_CONFIG.DEPOSIT_EXPIRY_DAYS)
        let request = {
            "currency": currency,
            "amount": amount,
            "creditorOrgId": creditorOrgId,
            "expiration": depositExpiration.toISOString()
        };
        axios({
            method: 'post',
            url: SIMARD_CONFIG.GUARANTEES_URL,
            data: request,
            headers: createHeaders(SIMARD_CONFIG.SIMARD_TOKEN)
        })

        .then(response => {
            logger.debug("Guarantee created",response.data);
            resolve(response.data);
        })

        .catch(error => {
            logger.error("Guarantee creation failed", error);
            reject(error);
        });

    });
}

const createCryptoDeposit = (transactionHash, quote) => new Promise((resolve, reject) => {
    logger.debug('Creating deposit for crypto payment made with transaction %s', transactionHash);
    const request = {
        instrument: 'blockchain',
        chain: 'ethereum',
        transactionHash,
        quoteId: quote ? quote.quoteId : undefined
    };
    axios({
        method: 'post',
        url: SIMARD_CONFIG.DEPOSITS_URL,
        data: request,
        headers: createHeaders(SIMARD_CONFIG.SIMARD_TOKEN)
    })

    .then(response => {
        logger.debug("Deposit created",response.data);
        resolve(response.data);
    })

    .catch(error => {
        logger.error("Deposit creation failed", error);
        reject(error);
    });
});

const createCryptoGuarantee = (amount, currency, transactionHash, creditorOrgId) => new Promise((resolve, reject) => {
    logger.debug("Creating guarantee for %s %s",amount,currency);
    const depositExpiration = addDays(new Date(), SIMARD_CONFIG.DEPOSIT_EXPIRY_DAYS)
    const request = {
        currency,
        amount,
        creditorOrgId: creditorOrgId,
        expiration: depositExpiration.toISOString(),
        funding: {
            type: 'blockchain',
            chain: 'ethereum',
            transactionHash
        }
    };
    axios({
        method: 'post',
        url: SIMARD_CONFIG.GUARANTEES_URL,
        data: request,
        headers: createHeaders(SIMARD_CONFIG.SIMARD_TOKEN)
    })

    .then(response => {
        logger.debug("Guarantee created",response.data);
        resolve(response.data);
    })

    .catch(error => {
        logger.error("Guarantee creation failed", error);
        reject(error);
    });

});

// Simulate a deposit - TEST ONLY
function simulateDeposit(amount, currency) {
    return new Promise(function(resolve, reject) {
        logger.debug("Simulate deposit for %s %s",amount,currency);
        let request = {
            "currency": currency,
            "amount": amount
        };
        axios({
            method: 'post',
            url: SIMARD_CONFIG.SIMULATE_DEPOSIT_URL,
            data: request,
            headers: createHeaders(SIMARD_CONFIG.SIMARD_TOKEN)
        })

        .then(response => {
            logger.debug("Deposit created",response.data);
            resolve(response.data);
        })

        .catch(error => {
            logger.error("Guarantee creation failed", error);
            reject(error);
        });
    });
}


/**
 * Swap balances between currencies
 * @param quotes A list of quoteId created using the quote API
 * @returns {Promise<any>} response from /balances/swap Simard API
 */
function balanceSwap(quotes) {
    return new Promise(function(resolve, reject) {
        axios({
            method: 'post',
            url: SIMARD_CONFIG.SWAP_URL,
            data: {quotes: quotes},
            headers: createHeaders(SIMARD_CONFIG.SIMARD_TOKEN)
        })

        .then(response => {
            logger.debug("Swap completed", response.data);
            resolve(response.data);
        })

        .catch(error => {
            logger.error("Swap failed", error);
            reject(error);
        });

    });
}

/* Create a confirmed quote with Simard Pay */
const createQuoteAsync = async (sourceCurrency, targetCurrency, targetAmount) => {
    const quoteUrl = SIMARD_CONFIG.QUOTE_URL;
    const response = await axios({
        method: 'post',
        url: quoteUrl,
        data: {
            sourceCurrency,
            targetCurrency,
            targetAmount
        },
        headers: createHeaders(SIMARD_CONFIG.SIMARD_TOKEN)
    });
    return response.data;
};

/* Get informative rate with Simard Pay */
const getRateAsync = async (sourceCurrency, targetCurrency) => {
    const rateUrl = SIMARD_CONFIG.RATE_URL;
    const response = await axios({
        method: 'get',
        url: rateUrl,
        params: {
            source: sourceCurrency,
            target: targetCurrency,
        },
        headers: createHeaders(SIMARD_CONFIG.SIMARD_TOKEN)
    });
    return response.data;
};


module.exports = {
    createCryptoDeposit,
    createGuarantee,
    createCryptoGuarantee,
    simulateDeposit,
    balanceSwap,
    createQuoteAsync,
    getRateAsync,
}

