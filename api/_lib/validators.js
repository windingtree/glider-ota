const Ajv = require('ajv');
const schema = require('./schemas/backend-api-schema.json');
const wtschema = require('./schemas/wt-aggregator.json');
const {GliderError} = require('./rest-utils');


/**
 * Validates if a request made to /offers/search is valid and also adds missing properties which have their default values specified in swagger definition.
 * @param payload
 * @return true if payload is valid, false otherwise
 */
const validateSearchCriteriaPayload = (payload) => {
    return _validate(payload, '#/components/schemas/SearchCriteria');
};


const _validate = (payload, schemaRef) => {
    let ajv = new Ajv({useDefaults: true, coerceTypes: true});
    ajv.addSchema(schema, 'swagger.json');
    ajv.addSchema(wtschema, 'wt-aggregator.yaml');
    let result = ajv.validate({$ref: 'swagger.json' + schemaRef}, payload);

    if (!result) {
        // console.log('invalid, original payload:', JSON.stringify(payload));
        let error = ajv.errors[0];
        let message = `Validation error. Property:[${error.dataPath}], problem:[${error.message}]`;
        throw new GliderError(message, 400);
    } else {
        // console.log('valid payload:', JSON.stringify(payload));
    }
    return payload;
};


/**
 * Validates if a request made to /cart/offer is valid.
 * @param payload
 * @return true if payload is valid, false otherwise
 */
const validateCartOfferPayload = (payload) => {
    return _validate(payload, '#/components/schemas/CartItemOffer');
};

/**
 * Validates if a request made to /cart/passengers is valid.
 * @param payload
 * @return true if payload is valid, false otherwise
 */
const validateCartPassengersPayload = (payload) => {
    return _validate(payload, '#/components/schemas/CartItemPassengers');
};
/**
 * Validates if a request made to /checkout is valid.
 * @param payload
 * @return true if payload is valid, false otherwise
 */
const validateCheckoutPayload = (payload) => {
    return _validate(payload, '#/components/schemas/CheckoutParameters');
};


module.exports = {
    validateSearchCriteriaPayload: validateSearchCriteriaPayload,
    validateCartOfferPayload: validateCartOfferPayload,
    validateCartPassengersPayload: validateCartPassengersPayload,
    validateCheckoutPayload: validateCheckoutPayload
};
