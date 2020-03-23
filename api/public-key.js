const {getPublicKey} = require('./_lib/stripe-api');
const {decorate} = require('./_lib/decorators');


/**
 * /public-key call handler
 * this is required by stripe API to retrieve stripe "PUBLISHABLE_KEY"
 *
 */
module.exports = decorate((req, response) => {
    response.json(
        getPublicKey()
    )
});



