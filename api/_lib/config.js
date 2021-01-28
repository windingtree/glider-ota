const path = require('path');

const profiles = require('@windingtree/config-profiles');
const activeProfile = process.env.ACTIVE_PROFILE || 'staging';
profiles.init({
    baseFolder: path.join(process.cwd(),'api/profiles'),
        dbUrl: profiles.getEnvironmentEntry(activeProfile, 'MONGO_URL'),
        encryptionDetails: profiles.getEnvironmentEntry(activeProfile, 'PROFILE_SECRET')
    }
)


// Get an an environment variable
const getConfigKey = (key, defaultValue) => {
    return profiles.getEnvOrProfileEntry(key, defaultValue);
};
module.exports.getConfigKey = getConfigKey;

const GLIDER_BASEURL = getConfigKey('GLIDER_BASEURL');

const GLIDER_CONFIG =
    {
        BASE_URL:GLIDER_BASEURL,
        // GLIDER_TOKEN: getConfigKey('GLIDER_JWT'),
        ORGID: getConfigKey('GLIDER_ORGID'),
        GLIDER_FIXED_USAGE:(getConfigKey('GLIDER_FIXED_USAGE',"yes")==="yes"),
    };

const ROOMS_BASEURL = getConfigKey('ROOMS_BASEURL');
const ROOMS_CONFIG =
    {
        BASE_URL:ROOMS_BASEURL,
        ENABLE_ROOMS_SEARCH: (getConfigKey('ENABLE_ROOMS_SEARCH',"yes")==="yes"),
        ROOMS_ORGID: getConfigKey('ROOMS_ORGID'),
        // ROOMS_TOKEN: getConfigKey('ROOMS_TOKEN'),
    };

const ORGID = {
    OTA_ORGID: getConfigKey('OTA_ORGID'),
    OTA_PRIVATE_KEY: getConfigKey('OTA_PRIVATE_KEY'),
    OTA_PRIVATE_KEY_ID: getConfigKey('OTA_PRIVATE_KEY_ID','webserver'),
    P2P_GRAPH_URL:getConfigKey('P2P_GRAPH_URL','https://api.thegraph.com/subgraphs/name/windingtree/orgid-subgraph-ropsten'),
    P2P_ENABLE_DISCOVERY:(getConfigKey('P2P_ENABLE_DISCOVERY',"no")==="yes")
}

const SIMARD_BASEURL = getConfigKey('SIMARD_BASEURL');

const SIMARD_CONFIG =
    {
        SIMARD_TOKEN: getConfigKey('SIMARD_JWT'),
        DEPOSITS_URL: SIMARD_BASEURL + "/balances/deposits",
        GUARANTEES_URL: SIMARD_BASEURL + "/balances/guarantees",
        CREATE_WITH_OFFER_URL: SIMARD_BASEURL + "/orders/createWithOffer",
        SIMULATE_DEPOSIT_URL: SIMARD_BASEURL + "/balances/simulateDeposit",
        ORGID: getConfigKey('SIMARD_ORGID', "0x5e6994f76764ceb42c476a2505065a6170178a24c03d81c9f372563830001171"),
        DEPOSIT_EXPIRY_DAYS: 14,
        QUOTE_URL: `${SIMARD_BASEURL}/quotes`,
        SWAP_URL: `${SIMARD_BASEURL}/balances/swap`,
        RATE_URL: `${SIMARD_BASEURL}/rates`,
    };


const REDIS_CONFIG =
    {
        REDIS_PORT: getConfigKey('REDIS_PORT',14563),
        REDIS_HOST: getConfigKey('REDIS_HOST'),
        REDIS_PASSWORD: getConfigKey('REDIS_PASSWORD'),
        SESSION_TTL_IN_SECS: 60 * 60,
    };

const MONGO_CONFIG =
    {
        URL: getConfigKey('MONGO_URL'),
        DBNAME: getConfigKey('MONGO_DBNAME'),
    };

const STRIPE_CONFIG =
    {
        PUBLISHABLE_KEY: getConfigKey('STRIPE_PUBLISHABLE_KEY'),
        SECRET_KEY: getConfigKey('STRIPE_SECRET_KEY'),
        WEBHOOK_SECRET: getConfigKey('STRIPE_WEBHOOK_SECRET'),
        BYPASS_WEBHOOK_SIGNATURE_CHECK: (getConfigKey('STRIPE_BYPASS_WEBHOOK_SIGNATURE_CHECK',"no") === "yes")
    };
const ELASTIC_CONFIG =
    {
        URL: getConfigKey('ELASTIC_URL'),
    };

const GENERIC_CONFIG =
    {
        ENVIRONMENT: activeProfile,
        ENABLE_HEALHCHECK: (getConfigKey('HEALTHCHECK_ENABLE','no') === "yes"),
        DEVELOPMENT_MODE: (getConfigKey('DEVELOPMENT_MODE','no') === "yes")
    };
const SENDGRID_CONFIG =
    {
        SENDGRID_API_KEY: getConfigKey('SENDGRID_API_KEY'),
        FROM_EMAIL_ADDR: getConfigKey('SENDGRID_FROM_EMAIL_ADDR', 'noreply@glider.travel'),
        TEMPLATE_ID: getConfigKey('SENDGRID_TEMPLATE_ID','d-199fb2f410334d1296b0176e0435c4a7'),
    };

const CRYPTO_CONFIG = {
    DEFAULT_NETWORK: getConfigKey('DEFAULT_NETWORK'),
    INFURA_ENDPOINT: getConfigKey('INFURA_ENDPOINT'),
    PRICING_DEVELOPMENT_MODE: getConfigKey('PRICING_DEVELOPMENT_MODE') === "yes"    //if yes, prices for crypto payment will be divided by 10 to minimize usage of coins
};

module.exports = {
    GLIDER_CONFIG,
    SIMARD_CONFIG,
    REDIS_CONFIG,
    MONGO_CONFIG,
    STRIPE_CONFIG,
    ELASTIC_CONFIG,
    ORGID,
    GENERIC_CONFIG,
    SENDGRID_CONFIG,
    CRYPTO_CONFIG,
    ROOMS_CONFIG
};


