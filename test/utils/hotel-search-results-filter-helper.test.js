import {HotelSearchResultsFilterHelper} from '../../src/utils/hotel-search-results-filter-helper';

var assert = require('assert');


const sample = require('../test_data/sample_response_hotels_simulator.json');
const helper = new HotelSearchResultsFilterHelper(sample);
const sampleHotelId="erevmax.07119";


describe('HotelSearchResultsFilterHelper', function () {

    describe('#generateSearchResults()', function () {
        it('should return list of hotels ordered by either duration or price', function () {
            let results = helper.generateSearchResults();
            console.log(JSON.stringify(results))
        });
    });

    describe('#getCheapestHotelOffer()', function () {
        it('should return find the cheapest offer for a given hotel among provided offers', function () {
            let cheapestHotelOffer = helper.getCheapestHotelOffer(sampleHotelId,sample.offers);
            console.log(JSON.stringify(cheapestHotelOffer))
            assert.equal(cheapestHotelOffer.price.public,590);
        });
    });

});
