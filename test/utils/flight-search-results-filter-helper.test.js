import {
    FlightSearchResultsFilterHelper
} from '../../src/utils/flight-search-results-filter-helper';

var assert = require('assert');


const sample = require('../test_data/sample_response_unprocessed');
const helper = new FlightSearchResultsFilterHelper(sample);
const sampleOfferIdAF_0012 = "c74624e5-83a3-44f9-8624-e583a3b40012";


describe('FlightSearchResultsFilterHelper', function () {

    describe('#generateSearchResults()', function () {
        it('should return list of trips ordered by either duration or price', function () {
            let results = helper.generateSearchResults();
            console.log("Results size:", results.length)

            let filterState = [
                {key: "KL", selected: true}
            ]
            results = helper.generateSearchResults('PRICE',{airlines:filterState});
            console.log("Results size:", results.length)
            // console.log(JSON.stringify(results))
            //TODO - add assertions and sorting
        });
    });


});
