const redis = require('async-redis');
const {createLogger} = require('./logger');
const {REDIS_CONFIG} = require('./config');
const logger = createLogger('session-storage');

const KEYS = {
    OFFERS: 'OFFERS',
    ORDER: 'ORDER',
    CONFIRMED_OFFER: 'CONFIRMED_OFFER',
}

// Hold the Redis Client with lazy loading
var _client;

// Access the client
const getClient = () => {

    // Lazy load the client
    if(!_client) {
        _client = redis.createClient({
            port: REDIS_CONFIG.REDIS_PORT,
            host: REDIS_CONFIG.REDIS_HOST,
            password: REDIS_CONFIG.REDIS_PASSWORD,
            retry_unfulfilled_commands: true,
            // enable_offline_queue:false,
            retry_strategy: function (options) {
                if (options.error && options.error.code === "ECONNREFUSED") {
                    // End reconnecting on a specific error and flush all commands with
                    // a individual error
                    let e = new Error("Redis server refused the connection")
                    logger.error("Redis connection error", e)
                    return e;
                }
                if (options.total_retry_time > 1000 * 60 * 60) {
                    // End reconnecting after a specific timeout and flush all commands
                    // with a individual error
                    let e = new Error("Retry time exhausted");
                    logger.error("Redis connection error", e)
                    return e;
                }
                if (options.attempt > 10) {
                    // End reconnecting with built in error
                    logger.error("Redis connection error - max attempts exhausted")
                    return undefined;
                }
                // reconnect after
                logger.warn("Redis connection error - reconnecting soon ...")
                return Math.min(options.attempt * 100, 3000);
            }
        });

        // Close connection to the Redis on exit
        process.on('exit', function () {
            logger.info("Shutting down redis connections gracefully");
            if(_client) {
                _client.end(true);
                _client = undefined;
            }
        });

        _client.on('end', function () {
            logger.debug("Redis client event=end");
        });

        _client.on('error', function (err) {
            logger.debug("Redis client event=error, message=%s", err);
        });

        _client.on('ready', function (param) {
            logger.debug("Redis client event=ready");
        });

        _client.on('connect', function (param) {
            logger.debug("Redis client event=connect");
        });
    }

    return _client;

};



/**
 * Helper class to deal with storing session data on a server side.
 * Data is stored in Redis database, using temporary keys (short TTL, configured with REDIS_CONFIG.SESSION_TTL_IN_SECS)
 * Session is maintained with the client using cookie
 */
class SessionStorage {
    constructor(sessionID) {
        this.assertNotEmpty("sessionID",sessionID);
        this.sessionID = sessionID
    }

    assertNotEmpty(str, paramName){
        if(str === undefined || str.length === 0)
            throw new Error(paramName+" cannot be empty");
    }

    getSessionID() {
        return this.sessionID;
    }


    _createKey(key) {
        this.assertNotEmpty("key",key);
        return this.getSessionID() + ':' + key;
    }


    /**
     * Store key+value pair in a session.
     * Value can be later on retrieved by providing a key
     * @param key
     * @param value
     */
    async storeInSession(key, value) {
        this.assertNotEmpty("key",key);
        key = this._createKey(key);
        let ttl=REDIS_CONFIG.SESSION_TTL_IN_SECS;
        value=JSON.stringify(value);
        logger.debug("storeInSession(%s) start",key)
        await getClient().multi().set(key, value).expire(key, ttl).exec(function (err, replies) {
            logger.debug("storeInSession(%s) completed",key)
            if(err){
                logger.error("Redis error %s",err);
            }
        });
    }


    /**
     * Retrieve value associated with a key from a session storage
     * @param key
     * {Promise<any>} value associated with a key
     */
    async retrieveFromSession(key) {
        this.assertNotEmpty("key",key);
        key = this._createKey(key);
        let value = await getClient().get(key);
        if(value!==null){
            value = JSON.parse(value)
        }
        logger.debug("retrieveFromSession(%s) completed",key,value)
        return value;
    }


    /**
     * Stores order in a session
     * @param order
     */
    storeOrder(order) {
        this.storeInSession(KEYS.ORDER, order);
    }

    /**
     * Retrieve order from session
     * @param orderId
     * @returns {Promise<*>}
     */
    retrieveOrder(orderId) {
        let key = KEYS.ORDER;
        return this.retrieveFromSession(key);
    }


    /**
     * Stores confirmed(re-priced) offer in a session
     * @param confirmedOffer
     */
    storeConfirmedOffer(confirmedOffer) {
        this.storeInSession(KEYS.CONFIRMED_OFFER, confirmedOffer);
    }

    /**
     * Retrieve confirmed(re-priced) offer from session storage
     * @param confirmedOfferId
     * @returns {Promise<*>}
     */
    retrieveConfirmedOffer(confirmedOfferId) {
        //todo check if offerID matches with the one in session
        let key = KEYS.CONFIRMED_OFFER;
        return this.retrieveFromSession(key);
/*
        return retFromSession.then(data=> {
            return JSON.parse(data);
        })
*/
    }




    _printKeys(match) {
        let results = [];
        getClient().keys(match).then(key => {
            console.log("All keys:", key," length:");
        })
        return results;
    }

}

const storeInRedis = async (key, value, ttl) => {
    await getClient().multi().set(key, value).expire(key, ttl).exec(function (err, replies) {
        if(err){
            logger.error("Redis error %s",err);
        }
    });
}
const retrieveFromRedis = async (key) => {
    return await getClient().get(key);
}


module.exports = {
    SessionStorage, getClient, storeInRedis, retrieveFromRedis
}


