const {decorate} = require('./_lib/decorators');
const {createLogger} = require('./_lib/logger');
const {findOrder} = require('./_lib/mongo-dao');
const logger = createLogger("/verifyPayment");


/**
 * /verify payment call handler
 * This is to check a status (payment and fulfullment status) of an order provided as a parameter
 * @param request
 * @param response
 * @returns {Promise<void>}
 */
const verifyPaymentController = async (request,response)=>{
    let orderId = request.body.orderId;
        logger.debug("/verifyPayment, orderId:%s",orderId);
        let order = await findOrder(orderId);
        let ret= {
            payment_status:order.payment_status,
            order_status:order.order_status,
            confirmation:order.confirmation
        };
        response.json(ret);
};

module.exports = decorate(verifyPaymentController);


