const {validateCartOfferPayload, validateSearchCriteriaPayload, validateCartPassengersPayload, validateCheckoutPayload} = require('../../../api/_lib/validators');
const GliderError = require('../../../api/_lib/rest-utils');
const assert = require('assert');

describe('/api/searchOffers payload validator', () => {
  let payloads = require('./sample_payloads/searchOffers.json');
  describe('valid payload', () => {
    payloads.valid.forEach(payload => {
      it('should pass validation on valid payload', () => {
        let validPayload = validateSearchCriteriaPayload(payload);
        assert.deepEqual(validPayload, payload);
      });
    });
  });


  describe('invalid payload', () => {
    payloads.invalid.forEach(payload => {
      it('should fail validation on invalid payload', () => {
        assert.throws(() => validateSearchCriteriaPayload(payload), /Validation error/);
      });
    });
  });
});

describe('/api/cart/offer payload validator', () => {
  let payloads = require('./sample_payloads/cartOffer.json');
  describe('valid payload', () => {
    payloads.valid.forEach(payload => {
      it('should pass validation on valid payload', () => {
        let validPayload = validateCartOfferPayload(payload);
        assert.deepEqual(validPayload, payload);
      });
    });
  });


  describe('invalid payload', () => {
    payloads.invalid.forEach(payload => {
      it('should fail validation on invalid payload', () => {
        assert.throws(() => validateCartOfferPayload(payload), /Validation error/);
      });
    });
  });
});

describe('/api/cart/passengers payload validator', () => {
  let payloads = require('./sample_payloads/cartPassengers.json');
  describe('valid payload', () => {
    payloads.valid.forEach(payload => {
      it('should pass validation on valid payload', () => {
        let validPayload = validateCartPassengersPayload(payload);
        assert.deepEqual(validPayload, payload);
      });
    });
  });


  describe('invalid payload', () => {
    payloads.invalid.forEach(payload => {
      it('should fail validation on invalid payload', () => {
        assert.throws(() => validateCartPassengersPayload(payload), /Validation error/);
      });
    });
  });
});
describe('/api/checkout payload validator', () => {
  let payloads = require('./sample_payloads/checkout.json');
  describe('valid payload', () => {
    payloads.valid.forEach(payload => {
      it('should pass validation on valid payload', () => {
        let validPayload = validateCheckoutPayload(payload);
        assert.deepEqual(validPayload, payload);
      });
    });
  });


  describe('invalid payload', () => {
    payloads.invalid.forEach(payload => {
      it('should fail validation on invalid payload', () => {
        assert.throws(() => validateCheckoutPayload(payload), /Validation error/);
      });
    });
  });
});

