const {decorate} = require('./_lib/decorators');
const {createLogger} = require('./_lib/logger');
const {findOrder} = require('./_lib/mongo-dao');
const logger = createLogger("/verifyPayment");
const DEV_MODE=false;

/**
 * /verify payment call handler
 * This is to check a status (payment and fulfullment status) of an order provided as a parameter
 * @param request
 * @param response
 * @returns {Promise<void>}
 */
const verifyPaymentController = async (req,res)=>{
    let orderId = req.body.orderId;
        logger.debug("/verifyPayment, orderId:%s",orderId);
    if (orderId === undefined) {
        logger.warn("Missing orderId");
        res.json({error: "Error | Missing orderId"});
        res.status(500)
        return;
    }

    if(DEV_MODE) {
        res.json({
            payment_status:'order.payment_status',
            order_status:'order.order_status',
            confirmation:'order.confirmation'
        });
        return;
    }

        let order = await findOrder(orderId);
    if (order === undefined) {
        logger.warn("Cannot find order, orderId:%s", orderId);
        res.json({error: "Cannot find order"});
        res.status(500)
        return;
    }else{
        logger.debug("Found order, orderId:%s", orderId, order);
    }

        let ret= {
            payment_status:order.payment_status,
            order_status:order.order_status,
            confirmation:order.confirmation,
            order:order
        };
        res.json(ret);
        res.status(200)
};

module.exports = decorate(verifyPaymentController);


