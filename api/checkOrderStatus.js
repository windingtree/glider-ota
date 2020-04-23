const {createLogger} = require('./_lib/logger')
const {decorate} = require('./_lib/decorators');
const {findOrder} = require('./_lib/mongo-dao');
const logger = createLogger('/checkoutUrl')
const DEV_MODE=true;

const checkOrderStatusController = async (req, res) => {
    //TODO add additional check (e.g. sessionID vs orderID)
    logger.info("Checking order status, orderId:%s", orderId)
    let orderId=req.body.orderId;
    if (orderId === undefined) {
        logger.warn("Missing orderId");
        res.json({error: "Error | Missing orderId"});
        res.status(500)
        return;
    }

    if(DEV_MODE) {
        res.json({
            orderId: orderId,
            status: 'confirmed',
            bookingConfirmation: 'ABCDEF',
            ticketNumber: '0123123123123'
        });
        return;
    }

    logger.debug("Retrieving order %s from a database", orderId)
    let order = await findOrder(orderId);
    if (order === undefined) {
        logger.warn("Cannot find order, orderId:%s", orderId);
        res.json({error: "Cannot find order"});
        res.status(500)
        return;
    }


    logger.debug("Order found")
    res.json({error:'missing check'})

}



module.exports = decorate(checkOrderStatusController);
