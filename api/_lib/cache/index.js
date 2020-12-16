const logger = require('../logger').createLogger('cache');
const {SessionStorage} = require('../session-storage');

const CACHE_KEY_PREFIX = 'cache';
const CACHE_KEYS = {
    FLIGHT_SEARCH_RESULTS: 'flight-results',
    HOTEL_SEARCH_RESULTS: 'hotel-results',
}
const _createKey = (key) => {
    return `${CACHE_KEY_PREFIX} ${key}`
}

const _storeWithKey = async (sessionId, key, results) => {
    if (!sessionId || sessionId.length === 0)
        throw new Error('Invalid session ID');
    let sessionStorage = new SessionStorage(sessionId);
    try {
        let k = _createKey(key);
        await sessionStorage.storeInSession(k, results);
        // await sessionStorage.retrieveFromSession(k);
    } catch (err) {
        logger.error(`Failed to store cache, key:${key}, sessionId:${sessionId}`, err)
    }
}
const _getWithKey = async (sessionId, key) => {
    let sessionStorage = new SessionStorage(sessionId);
    try {
        return await sessionStorage.retrieveFromSession(_createKey(key));
    } catch (err) {
        logger.error(`Failed to retrieve cache, key:${key}, sessionId:${sessionId}`, err)
    }
}

const storeFlightSearchResults = async (sessionId, results) => {
    return await _storeWithKey(sessionId, CACHE_KEYS.FLIGHT_SEARCH_RESULTS, results);
}

const getFlightSearchResults = async (sessionId) => {
    return await _getWithKey(sessionId, CACHE_KEYS.FLIGHT_SEARCH_RESULTS);
}

const storeHotelSearchResults = async (sessionId, results) => {
    return await _storeWithKey(sessionId, CACHE_KEYS.HOTEL_SEARCH_RESULTS, results);
}
const getHotelSearchResults = async (sessionId) => {
    return await _getWithKey(sessionId, CACHE_KEYS.HOTEL_SEARCH_RESULTS);
}


module.exports = {
    getFlightSearchResults, getHotelSearchResults,
    storeFlightSearchResults, storeHotelSearchResults
}
