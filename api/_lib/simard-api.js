const {createLogger} = require('./logger');
const addDays = require("date-fns/addDays")
const axios = require('axios').default;
const {SIMARD_CONFIG,GLIDER_CONFIG} = require('../../config');
const logger = createLogger('simard-api');


/**
 * Creates guarantee in Simar for a given amount of money.
 * Guarantee is needed to fulfill an order
 * @param amount
 * @param currency
 * @returns {Promise<any>} response from /balances/guarantees Simard API
 */
async function createGuarantee(amount, currency) {
    logger.debug("Creating guarantee for %s %s",amount,currency);
    let depositExpiration=addDays(new Date(),SIMARD_CONFIG.DEPOSIT_EXPIRY_DAYS)
    let request = {
        "currency": currency,
        "amount": amount,
        "creditorOrgId": GLIDER_CONFIG.ORGID,
        "expiration": depositExpiration.toISOString()
    };
    let response = await axios({
        method: 'post',
        url: SIMARD_CONFIG.GUARANTEES_URL,
        data: request,
        headers: createHeaders(SIMARD_CONFIG.SIMARD_TOKEN)
    });
    return response.data;
}


function createHeaders(token) {
    return {
        'Authorization': 'Bearer ' + token,
        'accept': 'application/json',
        'Content-Type': 'application/json'
    }
}



module.exports = {
   createGuarantee
}

