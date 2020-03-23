const {createWithOffer} = require('./_lib/glider-api');
const {createLogger} = require('./_lib/logger')
const {decorate} = require('./_lib/decorators');
const {SessionStorage} = require('./_lib/session-storage');
const logger = createLogger('/createWithOffer')


/**
 * /createWithOffer controller
 * This basically forwards a call to Glider
 * Response is stored in session storage for later retrieval in case client decides to pay
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
const createWithOfferController = async (req, res) => {
    let sessionID=req.sessionID;
    let order = await createWithOffer(req.body);
    storeOrderInSession(sessionID, order);
    res.json(order);
}

function storeOrderInSession(sessionID, order) {
    logger.debug("Store order in session - sessionID:%s",sessionID);
    let sessionStorage = new SessionStorage(sessionID)
    sessionStorage.storeOrder(order);
}

module.exports = decorate(createWithOfferController);

