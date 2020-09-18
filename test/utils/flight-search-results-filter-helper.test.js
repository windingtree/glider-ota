import {
    FlightSearchResultsFilterHelper
} from '../../src/utils/flight-search-results-filter-helper';


const sample = require('../test_data/sample_response_unprocessed');
const helper = new FlightSearchResultsFilterHelper(sample);


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
