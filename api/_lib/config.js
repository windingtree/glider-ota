/**
 * Main configuration is maintained here
 * @module _lib/config
 */

/**
 * Detect what is the current environment
 * @returns {string} 'production' || 'staging' || 'develop'
 */

const determineEnviroment = () => {
    // If defined, use the Glider environment variable
    if(process.env.GLIDER_ENV) {
        return process.env.GLIDER_ENV;
    }

    // Otherwise use the Github branch provided by Vercel
    switch(process.env.VERCEL_GITHUB_COMMIT_REF || process.env.NOW_GITHUB_COMMIT_REF) {
        case 'master':
            return 'production';
        case 'develop':
        default:
            return 'staging';
    }
}
const environment = determineEnviroment();

/**
 * Get the value of an environment variable
 * @param key
 * @returns {string|undefined}
 */
const getConfigKey = (key) => {
    // Return environment specific variable if any
    const envKey = `${environment.toUpperCase()}_${key}`;
    if(process.env.hasOwnProperty(envKey)) {
      return process.env[envKey];
    }

    // Return variable key
    if(process.env.hasOwnProperty(key)) {
      return process.env[key];
    }

    // Config key does not exist
    return undefined;
};


const GLIDER_BASEURL = getConfigKey('GLIDER_BASEURL') || `https://${environment}.b2b.glider.travel/api/v1`;

/**
 * Glider related configuration
 *
 * @type {{ORGID: (string|undefined), SEARCH_OFFERS_URL: string, FULFILL_URL: string, SEATMAP_URL: string, CREATE_WITH_OFFER_URL: string, REPRICE_OFFER_URL: string, GLIDER_TOKEN: (string|undefined)}}
 */
const GLIDER_CONFIG =
    {
        GLIDER_TOKEN: getConfigKey('GLIDER_JWT'),           //JWT Token needed for Glider API (offers search, creating offers, fulfilment)
        SEARCH_OFFERS_URL: GLIDER_BASEURL + "/offers/search",
        CREATE_WITH_OFFER_URL: GLIDER_BASEURL + "/orders/createWithOffer",
        SEATMAP_URL: GLIDER_BASEURL + "/offers/{offerId}/seatmap",
        REPRICE_OFFER_URL: GLIDER_BASEURL + "/offers/{offerId}/price",
        FULFILL_URL: GLIDER_BASEURL + "/orders/{orderId}/fulfill",
        ORGID: getConfigKey('GLIDER_ORGID'),
    };


//Glider OTA OrgID
const ORGID = {
    OTA_ORGID: getConfigKey('OTA_ORGID'),
}

const SIMARD_BASEURL = getConfigKey('SIMARD_BASEURL') || `https://${environment}.api.simard.io/api/v1`;

/**
 * Simard related configuration
 * @type {{ORGID: (string|string), SIMARD_TOKEN: (string|undefined), GUARANTEES_URL: string, SIMULATE_DEPOSIT_URL: string, CREATE_WITH_OFFER_URL: string, DEPOSIT_EXPIRY_DAYS: number}}
 */
const SIMARD_CONFIG =
    {
        SIMARD_TOKEN: getConfigKey('SIMARD_JWT'),           //JWT Token needed for Simard API
        GUARANTEES_URL: SIMARD_BASEURL + "/balances/guarantees",
        CREATE_WITH_OFFER_URL: SIMARD_BASEURL + "/orders/createWithOffer",
        SIMULATE_DEPOSIT_URL: SIMARD_BASEURL + "/balances/simulateDeposit",
        ORGID: getConfigKey('SIMARD_ORGID') || "0x5e6994f76764ceb42c476a2505065a6170178a24c03d81c9f372563830001171",
        DEPOSIT_EXPIRY_DAYS:14,
    };

/**
 * Redis related configuration
 * @type {{REDIS_HOST: (string|undefined), REDIS_PORT: number, REDIS_PASSWORD: (string|undefined), SESSION_TTL_IN_SECS: number}}
 */
const REDIS_CONFIG =
    {
        REDIS_PORT: (getConfigKey('REDIS_PORT') && parseInt(getConfigKey('REDIS_PORT'))) || 14563,
        REDIS_HOST: getConfigKey('REDIS_HOST'),
        REDIS_PASSWORD: getConfigKey('REDIS_PASSWORD'),
        SESSION_TTL_IN_SECS: 60 * 60,           //how long session data is stored in redis
    };

/**
 * Mongo configuration
 * @type {{DBNAME: (string|undefined), URL: (string|undefined)}}
 */
const MONGO_CONFIG =
    {
        URL: getConfigKey('MONGO_URL'),
        DBNAME: getConfigKey('MONGO_DBNAME'),
    };

/**
 * Stripe related config
 * @type {{BYPASS_WEBHOOK_SIGNATURE_CHECK: boolean, WEBHOOK_SECRET: (string|undefined), PUBLISHABLE_KEY: (string|undefined), SECRET_KEY: (string|undefined)}}
 */
const STRIPE_CONFIG =
    {
        PUBLISHABLE_KEY: getConfigKey('STRIPE_PUBLISHABLE_KEY'),
        SECRET_KEY: getConfigKey('STRIPE_SECRET_KEY'),
        WEBHOOK_SECRET: getConfigKey('STRIPE_WEBHOOK_SECRET'),
        BYPASS_WEBHOOK_SIGNATURE_CHECK: (getConfigKey('STRIPE_BYPASS_WEBHOOK_SIGNATURE_CHECK') === "yes"),
    };

/**
 * Elastic access details
 * @type {{URL: (string|undefined)}}
 */
const ELASTIC_CONFIG =
    {
        URL: getConfigKey('ELASTIC_URL'),
    };


/**
 * Generic configuration is here
 * @type {{ENABLE_HEALHCHECK: boolean, ENVIRONMENT: string}}
 */
const GENERIC_CONFIG =
    {
        ENVIRONMENT: determineEnviroment(),
        ENABLE_HEALHCHECK:(getConfigKey('HEALTHCHECK_ENABLE') === "yes")
    };



module.exports = {
    GLIDER_CONFIG,
    SIMARD_CONFIG,
    REDIS_CONFIG,
    MONGO_CONFIG,
    STRIPE_CONFIG,
    ELASTIC_CONFIG,
    ORGID,
    GENERIC_CONFIG
};
