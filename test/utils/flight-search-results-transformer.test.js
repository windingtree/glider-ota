const {extendResponse} = require('../../src/utils/flight-search-results-transformer');
var _ = require('lodash')


var assert = require('assert');
describe('flight-search-results-transformer', function () {
    describe('#extendResponse()', function () {
        it('should return -1 when the value is not present', function () {
            const sample = require('./sample_response_unprocessed')
            const responseConverted = extendResponse(sample);
            // console.log(responseConverted)
        });
    });


});