const {createLogger} = require('./logger');
const addDays = require("date-fns/addDays")
const axios = require('axios').default;
const {SIMARD_CONFIG,GLIDER_CONFIG} = require('./config');
const logger = createLogger('simard-api');

/**
 * Creates guarantee in Simar for a given amount of money.
 * Guarantee is needed to fulfill an order
 * @param amount
 * @param currency
 * @returns {Promise<any>} response from /balances/guarantees Simard API
 */
function createGuarantee(amount, currency) {
    return new Promise(function(resolve, reject) {
        logger.debug("Creating guarantee for %s %s",amount,currency);
        let depositExpiration=addDays(new Date(),SIMARD_CONFIG.DEPOSIT_EXPIRY_DAYS)
        let request = {
            "currency": currency,
            "amount": amount,
            "creditorOrgId": GLIDER_CONFIG.ORGID,
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

const createCryptoDeposit = (transactionHash, quoteId) => new Promise((resolve, reject) => {
    logger.debug('Creating deposit for crypto payment made with transaction %s', transactionHash);
    const request = {
        instrument: 'blockchain',
        chain: 'ethereum',
        transactionHash,
        quoteId
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

const createCryptoGuarantee = (amount, currency, transactionHash) => new Promise((resolve, reject) => {
    logger.debug("Creating guarantee for %s %s",amount,currency);
    const depositExpiration = addDays(new Date(), SIMARD_CONFIG.DEPOSIT_EXPIRY_DAYS)
    const request = {
        currency,
        amount,
        creditorOrgId: GLIDER_CONFIG.ORGID,
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



function createHeaders(token) {
    return {
        'Authorization': 'Bearer ' + token,
        'accept': 'application/json',
        'Content-Type': 'application/json'
    }
}

const createQuote = async (sourceCurrency, targetCurrency, targetAmount) => {
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



module.exports = {
    createQuote,
    createCryptoDeposit,
    createGuarantee,
    createCryptoGuarantee,
    simulateDeposit
}

