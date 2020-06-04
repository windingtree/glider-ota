import {
    FlightSearchResultsFilterHelper
} from '../../src/utils/flight-search-results-filter-helper';

var assert = require('assert');


const sample = require('../test_data/sample_response_unprocessed');
const helper = new FlightSearchResultsFilterHelper(sample);
const sampleOfferIdAF_0012 = "c74624e5-83a3-44f9-8624-e583a3b40012";


describe('Filters', function () {

    describe('#layover duration filter', function () {
        it('should return true if layover duration is within min/max range and false otherwise', function () {
            let mockSegmentArrival1pm = {
                departureTime: "2020-06-01T12:00:00.000Z",
                arrivalTime: "2020-06-01T13:00:00.000Z"
            };
            let mockSegmentDeparture3pm = {
                departureTime: "2020-06-01T15:00:00.000Z",
                arrivalTime: "2020-06-01T18:00:00.000Z"
            };
            let mockSegmentDeparture5pm = {
                departureTime: "2020-06-01T17:00:00.000Z",
                arrivalTime: "2020-06-01T22:00:00.000Z"
            };
            let mockItinDirect = [
                {segments: [mockSegmentArrival1pm]}
            ];
            let mockItinConnecting_120mins = [
                {segments: [mockSegmentArrival1pm, mockSegmentDeparture3pm]}
            ];
            let mockItinConnecting_240mins = [
                {segments: [mockSegmentArrival1pm, mockSegmentDeparture5pm]}
            ];
            let filter119_121 = {min: 119, max: 121};
            assert.equal(helper.checkLayoverDurationFilter(filter119_121, mockItinDirect), false)
            assert.equal(helper.checkLayoverDurationFilter(filter119_121, mockItinConnecting_120mins), true)
            assert.equal(helper.checkLayoverDurationFilter(filter119_121, mockItinConnecting_240mins), false)

            let filter_121 = {max: 121}; //this should pass if layover duration is up to 2hrs, false otherwise
            assert.equal(helper.checkLayoverDurationFilter(filter_121, mockItinDirect), true)
            assert.equal(helper.checkLayoverDurationFilter(filter_121, mockItinConnecting_120mins), true)
            assert.equal(helper.checkLayoverDurationFilter(filter_121, mockItinConnecting_240mins), false)

            let filter_1 = {min: 1}; //this should pass if layover duration is more than 1 min
            assert.equal(helper.checkLayoverDurationFilter(filter_1, mockItinDirect), false)
            assert.equal(helper.checkLayoverDurationFilter(filter_1, mockItinConnecting_120mins), true)
            assert.equal(helper.checkLayoverDurationFilter(filter_1, mockItinConnecting_240mins), true)

        });
    });

    describe('#price filter', function () {
        it('should return true if offer price is between range and false otherwise', function () {
            let mockOffer = {
                price: {
                    public: 100
                }
            }
            assert.equal(helper.checkPriceFilter({min: 99, max: 101}, mockOffer), true)
            assert.equal(helper.checkPriceFilter({min: 100, max: 100}, mockOffer), true)
            assert.equal(helper.checkPriceFilter({min: 101, max: 101}, mockOffer), false)
            assert.equal(helper.checkPriceFilter({max: 101}, mockOffer), true)
            assert.equal(helper.checkPriceFilter({max: 99}, mockOffer), false)
            assert.equal(helper.checkPriceFilter({min: 99}, mockOffer), true)
            assert.equal(helper.checkPriceFilter({min: 101}, mockOffer), false)
        });
    });

    describe('#airline filter', function () {
        it('should return true if all segments carriers pass criteria', function () {
            let mockSegmentAC = {operator: {iataCode: "AC"}};
            let mockSegmentAF = {operator: {iataCode: "AF"}};
            let mockSegmentSN = {operator: {iataCode: "SN"}};
            let mockItinAC_AF = [
                {segments: [mockSegmentAC, mockSegmentAF]},
                {segments: [mockSegmentAC]}
            ];
            let mockItinAC_AF_SN = [
                {segments: [mockSegmentAC]},
                {segments: [mockSegmentAF]},
                {segments: [mockSegmentSN]}
            ];
            let mockItinAC = [
                {segments: [mockSegmentAC]},
                {segments: [mockSegmentAC]}
            ];
            let mockItinSN = [
                {segments: [mockSegmentSN]}
            ];

            let filter_AC_AF = {'AC': true, 'AF': true};
            assert.equal(helper.checkAirlineFilter(filter_AC_AF, mockItinAC_AF_SN), false);   //should not false
            assert.equal(helper.checkAirlineFilter(filter_AC_AF, mockItinAC_AF), true);   //should pass
            assert.equal(helper.checkAirlineFilter(filter_AC_AF, mockItinAC), true);   //should pass
            assert.equal(helper.checkAirlineFilter(filter_AC_AF, mockItinSN), false);   //should fail as SN is the only operating carrier

            let filter_ALL = {'ALL': true};
            assert.equal(helper.checkAirlineFilter(filter_ALL, mockItinAC_AF), true);
            assert.equal(helper.checkAirlineFilter(filter_ALL, mockItinAC), true);
            assert.equal(helper.checkAirlineFilter(filter_ALL, mockItinSN), true);

            let filter_empty = {};
            assert.equal(helper.checkAirlineFilter(filter_empty, mockItinAC_AF), false);
            assert.equal(helper.checkAirlineFilter(filter_empty, mockItinAC), false);
            assert.equal(helper.checkAirlineFilter(filter_empty, mockItinSN), false);
        });
    });

    describe('#max stops filter', function () {
        it('should return true if all segments carriers pass criteria', function () {
            let mockSegment = {};
            let mockItinDirect = [
                {segments: [mockSegment]},
                {segments: [mockSegment]}
            ];
            let mockItinWith1Stop = [
                {segments: [mockSegment, mockSegment]}
            ];
            let mockItinWith2Stops = [
                {segments: [mockSegment, mockSegment, mockSegment]}
            ];
            let mockItinWith3Stops = [
                {segments: [mockSegment, mockSegment, mockSegment, mockSegment]}
            ];
            let mockItinWith1_and_3Stops = [
                {segments: [mockSegment, mockSegment]},
                {segments: [mockSegment, mockSegment, mockSegment, mockSegment]}
            ];

            let filter_1 = {1: true};
            assert.equal(helper.checkMaxStopsFilter(filter_1, mockItinDirect), false);
            assert.equal(helper.checkMaxStopsFilter(filter_1, mockItinWith1Stop), true);
            assert.equal(helper.checkMaxStopsFilter(filter_1, mockItinWith2Stops), false);
            assert.equal(helper.checkMaxStopsFilter(filter_1, mockItinWith3Stops), false);
            assert.equal(helper.checkMaxStopsFilter(filter_1, mockItinWith1_and_3Stops), false);

            let filter_1_3 = {1: true, 2: false, 3: true};
            assert.equal(helper.checkMaxStopsFilter(filter_1_3, mockItinDirect), false);
            assert.equal(helper.checkMaxStopsFilter(filter_1_3, mockItinWith1Stop), true);
            assert.equal(helper.checkMaxStopsFilter(filter_1_3, mockItinWith2Stops), false);
            assert.equal(helper.checkMaxStopsFilter(filter_1_3, mockItinWith3Stops), true);

            let filter_all = {'ALL': true};
            assert.equal(helper.checkMaxStopsFilter(filter_all, mockItinDirect), true);
            assert.equal(helper.checkMaxStopsFilter(filter_all, mockItinWith1Stop), true);
            assert.equal(helper.checkMaxStopsFilter(filter_all, mockItinWith2Stops), true);
            assert.equal(helper.checkMaxStopsFilter(filter_all, mockItinWith3Stops), true);

        });
    });
    describe('#baggage filter', function () {
        it('should return true if offer baggage allowance matches with filter', function () {
            let filter_1bag = {'1': true};
            let filter_2bag = {'2': true};
            let offerId="0a8f5b47-5388-41f9-a382-2d08f7999e42";
            let offer = sample.offers[offerId]
            offer.offerId = offerId;
            assert.equal(helper.checkBaggageFilter(filter_1bag, offer), false)
            assert.equal(helper.checkBaggageFilter(filter_2bag, offer), true)
        });
    });


});

