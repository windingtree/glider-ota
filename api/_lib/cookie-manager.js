const cookie = require('cookie');
const {v4} = require('uuid');
const {createLogger} = require('./logger');
const logger = createLogger('session-storage');
const SESSION_ID_COOKIE = "wt-ota-session-id";

/**
 * Returns sessionID (from request cookie) if it already exists or generates new sessionID in case it did not exist
 * This ensures that with the first time request, we will also have sessionID and send that to the client.
 * @param req
 * @param res
 * @returns sessionID
 */
function ensureSessionIdCookie(req, res) {
    let sessionID = getSessionID(req);
    if (sessionID === undefined) {
        sessionID = generateSessionId();
        logger.debug("Session cookie not existing or empty sessiinID - generating new sessionID:%s",sessionID)
    }
    setCookie(res, SESSION_ID_COOKIE, sessionID);
    return sessionID;
}

function getCookie(req, name) {
    return req.cookies[name];
}

/**
 * Adds cookie in a response headers
 * @param res
 * @param name
 * @param value
 * @param maxAge
 */
function setCookie(res, name, value, maxAge) {
    let options = {
        path:'/',
        httpOnly: true,
        Secure: true
    };
    if (maxAge !== undefined)
        options['maxAge'] = maxAge;

    res.setHeader('Set-Cookie', cookie.serialize(name, value, options));
}


/**
 * Returns sessionID.
 * Contrary to {@link ensureSessionIdCookie}, it does not set generate new sessionID in case request didn't have sessionID cookie.
 * @param req
 * @returns sessionID
 */
function getSessionID(req) {
    return getCookie(req, SESSION_ID_COOKIE);
}


function generateSessionId() {
    return v4();
}

module.exports = {
    getCookie, setCookie, ensureSessionIdCookie, getSessionID
}
