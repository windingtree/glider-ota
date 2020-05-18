import OfferUtils from '../../src/utils/offer-utils';
var _ = require('lodash')
const sampleSearchResults = require('../test_data/sample_response_unprocessed')
const sampleOfferIdAF_0012="c74624e5-83a3-44f9-8624-e583a3b40012";

var assert = require('assert');
describe('offer-utils', function () {
    describe('#getOffer()', function () {
        it('should return an offer if it exists or null if it does not exist', function () {
            console.log("OfferUtils",OfferUtils.getCheapestOffer({}))
            // console.log("getCheapestOffer",getCheapestOffer)
            // getCheapestOffer('ss')

        })
    })
});
