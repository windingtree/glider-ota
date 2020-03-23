const redis = require('async-redis');
const {createLogger} = require('./logger');
const {REDIS_CONFIG} = require('../../config');

const logger = createLogger('session-storage');

const KEYS = {
    OFFERS: 'OFFERS',
    ORDER: 'ORDER'
}


const client = redis.createClient({
    port: REDIS_CONFIG.REDIS_PORT,
    host: REDIS_CONFIG.REDIS_HOST,
    password: REDIS_CONFIG.REDIS_PASSWORD,
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
    logger.info("Shutting down redis connections gracefully")
    client.quit();
});


client.on('error', function (err) {
    logger.error("Redis client event=error, message=%s", err)
});

client.on('ready', function (param) {
    logger.info("Redis client event=ready")
});

client.on('connect', function (param) {
    logger.info("Redis client event=connect")
});

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
        if(str == undefined || str.length == 0)
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
    storeInSession(key, value) {
        this.assertNotEmpty("key",key);
        key = this._createKey(key);
        let ttl=REDIS_CONFIG.SESSION_TTL_IN_SECS;
        logger.debug("Storing in session key:[%s], ttl: %s", key, ttl)
        client.multi().set(key, value).expire(key, ttl).exec(function (err, replies) {
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
        return client.get(key);
    }


    /**
     * Stores order in a session
     * @param order
     */
    storeOrder(order) {
        this.storeInSession(KEYS.ORDER, JSON.stringify(order));
    }

    /**
     * Retrieve order from session
     * @param orderId
     * @returns {Promise<*>}
     */
    retrieveOrder(orderId) {
        let key = KEYS.ORDER;
        let retFromSession = this.retrieveFromSession(key);
        return retFromSession.then(data=> {
            return JSON.parse(data);
        })
    }


    _printKeys(match) {
        let results = [];
        client.keys(match).then(key => {
            console.log("All keys:", key," length:");
        })
        return results;
    }

}

module.exports = {
    SessionStorage, client
}


