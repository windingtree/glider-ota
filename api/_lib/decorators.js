const {ensureSessionIdCookie} = require('./cookie-manager');
const {createLogger} = require('./logger');
const {v4} = require('uuid');

const createNamespace = require('continuation-local-storage').createNamespace;
const session = createNamespace('ota');


// log REST calls to a separate logger
const restlogger = createLogger('rest-logger');

/**
 * Adds request/response logging (each request/response can be logged)
 * @param Function (to be wrapped) with the following signature: fn(request,response)
 * @returns {Function}
 */
function restLoggerDecorator(fn) {
    const requestLogger = (req) => {
        restlogger.debug("RQ body %s", JSON.stringify(req.body))
        restlogger.debug("RQ headers %s", JSON.stringify(req.headers))
    }

    const responseLogger = (res) => {
        // restlogger.debug("RS body %s", JSON.stringify(res.body);
        // restlogger.debug("RS status %s", JSON.stringify(res.status()));
    }
    return async function (req, res) {
        requestLogger(req);
        await fn(req, res);
        responseLogger(res);
    }
}

/**
 * add sessionID cookie, decorate Request object with sessionID and session storage class
 * @param Function (to be wrapped) with the following signature: fn(request,response)
 * @returns {Function}
 */
function sessionDecorator(fn) {
    return async function (req, res) {
        let sessionId = ensureSessionIdCookie(req, res);
        req.sessionID=sessionId;
        await fn(req, res);
    }
}

/**
 * @param Function (to be wrapped) with the following signature: fn(request,response)
 * @returns {Function}
 */
function exceptionInterceptorDecorator(fn) {
    return async function (req, res) {
        try {
            await fn(req, res);
        } catch (err) {
            restlogger.error("Exception occurred while processing request %s, error:%s", req.url, err.message, err)
            res.status(500).send(`Failure: ${err.message}`);
        }
    }
}




function clsDecorator(fn) {
    return async function (req, res) {
        session.run(() => {
            session.set('correlationID', v4());
            fn(req, res);
        })
    };
};


/**
 * Adds necessary decorators to the callback function.
 * It currently adds logging and session cookie decorators
 * @param Function (to be wrapped) with the following signature: fn(request,response)
 * @returns {Function}
 */
function decorate(fn){
    let wrapper = clsDecorator(fn);             //decorate with correlationID
    wrapper = sessionDecorator(wrapper);        //add sessionID cookie
    wrapper = restLoggerDecorator(wrapper);     //log request/response
    wrapper = exceptionInterceptorDecorator(wrapper);   //capture any uncaught exceptions and log it
    return wrapper;
}
module.exports={
    decorate
}