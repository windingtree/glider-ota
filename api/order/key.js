const {getPublicKey} = require('../_lib/stripe-api');
const {decorate} = require('../_lib/decorators');
/**
 * @module endpoint /order/key
 */

/**
 * /order/key endpoint handler
 * <br/>This is required by stripe API to retrieve stripe "PUBLISHABLE_KEY"
 *
 */
module.exports = decorate((req, response) => {
    response.json(
        getPublicKey()
    )
});



