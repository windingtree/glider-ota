import {FlightSearchResultsWrapper} from '../../src/utils/flight-search-results-wrapper';
import {
    createAirlinePredicate, createMaxStopsPredicate,
    createPricePredicate,createLayoverDurationPredicate,
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
            let predicate = createAirlinePredicate({'KL': true});
            results = helper.generateSearchResults('PRICE',[{type:'trip',predicate:predicate}]);
            console.log("Results size:", results.length)

            console.log(JSON.stringify(results))
        });
    });

    describe('#predicates', function () {
        describe('#createLayoverDurationPredicate', function () {
            it('should return true if layover duration is within min/max range and false otherwise', function () {
                let mockSegmentArrival1pm = {departureTime: "2020-06-01T12:00:00.000Z", arrivalTime: "2020-06-01T13:00:00.000Z"};
                let mockSegmentDeparture3pm = {departureTime: "2020-06-01T15:00:00.000Z", arrivalTime: "2020-06-01T18:00:00.000Z"};
                let mockSegmentDeparture5pm = {departureTime: "2020-06-01T17:00:00.000Z", arrivalTime: "2020-06-01T22:00:00.000Z"};
                let mockItinDirect = [
                    {segments: [mockSegmentArrival1pm]}
                ];
                let mockItinConnecting_120mins = [
                    {segments: [mockSegmentArrival1pm,mockSegmentDeparture3pm]}
                ];
                let mockItinConnecting_240mins = [
                    {segments: [mockSegmentArrival1pm,mockSegmentDeparture5pm]}
                ];
                let predicate = createLayoverDurationPredicate({min: 119, max: 121}); //this should pass  if layover duration is 2hrs, false otherwise
                assert.equal(predicate(mockItinDirect), false)
                assert.equal(predicate(mockItinConnecting_120mins), true)
                assert.equal(predicate(mockItinConnecting_240mins), false)

                predicate = createLayoverDurationPredicate({max: 121}); //this should pass if layover duration is up to 2hrs, false otherwise
                assert.equal(predicate(mockItinDirect), true)
                assert.equal(predicate(mockItinConnecting_120mins), true)
                assert.equal(predicate(mockItinConnecting_240mins), false)

                predicate = createLayoverDurationPredicate({min: 1}); //this should pass if layover duration is more than 1 min
                assert.equal(predicate(mockItinDirect), false)
                assert.equal(predicate(mockItinConnecting_120mins), true)
                assert.equal(predicate(mockItinConnecting_240mins), true)

            });
        });

        describe('#createPricePredicate', function () {
            it('should return true if offer price is between range and false otherwise', function () {
                let mockOffer = {
                    price: {
                        public: 100
                    }
                }

                let predicate = createPricePredicate({min: 99, max: 101}); //this should pass
                assert.equal(predicate(mockOffer), true)
                predicate = createPricePredicate({min: 100, max: 100}); //this should pass too
                assert.equal(predicate(mockOffer), true)
                predicate = createPricePredicate({min: 101, max: 101});    //this should not pass
                assert.equal(predicate(mockOffer), false)
                predicate = createPricePredicate({max: 101});    //only max specified - this should pass
                assert.equal(predicate(mockOffer), true)
                predicate = createPricePredicate({max: 99});
                assert.equal(predicate(mockOffer), false)
                predicate = createPricePredicate({min: 99});    //only min specified - this should pass
                assert.equal(predicate(mockOffer), true)
                predicate = createPricePredicate({min: 101});    //only min specified - this should pass
                assert.equal(predicate(mockOffer), false)
            });
        });

        describe('#createPricePredicate', function () {
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


                let predicate = createAirlinePredicate({'AC': true, 'AF': true});  //predicate should pass if either AF or AC are operating carriers
                assert.equal(predicate(mockItinAC_AF_SN), false);   //should not false
                assert.equal(predicate(mockItinAC_AF), true);   //should pass
                assert.equal(predicate(mockItinAC), true);   //should pass
                assert.equal(predicate(mockItinSN), false);   //should fail as SN is the only operating carrier

                predicate = createAirlinePredicate({'ALL': true});  //predicate should pass on all
                assert.equal(predicate(mockItinAC_AF), true);
                assert.equal(predicate(mockItinAC), true);
                assert.equal(predicate(mockItinSN), true);

                predicate = createAirlinePredicate({});  //predicate should fail on all
                assert.equal(predicate(mockItinAC_AF), false);
                assert.equal(predicate(mockItinAC), false);
                assert.equal(predicate(mockItinSN), false);
            });
        });

        describe('#createMaxStopsPredicate', function () {
            it('should return true if all segments carriers pass criteria', function () {
                let mockSegment = {};
                let mockItinDirect = [
                    {segments: [mockSegment]},
                    {segments: [mockSegment]}
                ];
                let mockItinWith1Stop = [
                    {segments: [mockSegment,mockSegment]}
                ];
                let mockItinWith2Stops = [
                    {segments: [mockSegment,mockSegment,mockSegment]}
                ];
                let mockItinWith3Stops = [
                    {segments: [mockSegment,mockSegment,mockSegment,mockSegment]}
                ];


                let mockItinWith1_and_3Stops = [
                    {segments: [mockSegment,mockSegment]},
                    {segments: [mockSegment,mockSegment,mockSegment,mockSegment]}
                ];


                let predicate = createMaxStopsPredicate({1: true});  //predicate should pass if all itineraries have exactly 1 stop
                assert.equal(predicate(mockItinDirect), false);
                assert.equal(predicate(mockItinWith1Stop), true);
                assert.equal(predicate(mockItinWith2Stops), false);
                assert.equal(predicate(mockItinWith3Stops), false);
                assert.equal(predicate(mockItinWith1_and_3Stops), false);

                predicate = createMaxStopsPredicate({1: true,2:false,3:true});  //predicate should pass if all itineraries have exactly 1 stop or 3 stops
                assert.equal(predicate(mockItinDirect), false);
                assert.equal(predicate(mockItinWith1Stop), true);
                assert.equal(predicate(mockItinWith2Stops), false);
                assert.equal(predicate(mockItinWith3Stops), true);

                predicate = createMaxStopsPredicate({'ALL': true});  //predicate should always pass
                assert.equal(predicate(mockItinDirect), true);
                assert.equal(predicate(mockItinWith1Stop), true);
                assert.equal(predicate(mockItinWith2Stops), true);
                assert.equal(predicate(mockItinWith3Stops), true);

                predicate = createMaxStopsPredicate({'ALL': true});  //predicate should always fail
                assert.equal(predicate(mockItinDirect), true);
                assert.equal(predicate(mockItinWith1Stop), true);
                assert.equal(predicate(mockItinWith2Stops), true);
                assert.equal(predicate(mockItinWith3Stops), true);

            });
        });
    });


    describe('#filters', function () {
        it('should return list of trips ordered by either duration or price', function () {

        });
    });


});

/*

let a = [{
    "tripId": "FL6,FL8",
    "bestoffer": {
        "expiration": "2020-05-13T14:58:05.800Z",
        "offerItems": {"e07a2311-f937-4497-ba23-11f9373497fc": {"passengerReferences": "7C53D5D6"}},
        "pricePlansReferences": {"PC8": {"flights": ["FL6"]}, "PC5": {"flights": ["FL8"]}},
        "price": {"currency": "EUR", "public": "4740.92", "commission": "38.13", "taxes": "927.92"},
        "offerId": "c74624e5-83a3-44f9-8624-e583a3b40044"
    },
    "itineraries": [{
        "itinId": "FL6",
        "segments": [{
            "operator": {"operatorType": "airline", "iataCode": "KL", "flightNumber": "AF8377"},
            "origin": {"locationType": "airport", "iataCode": "YVR"},
            "destination": {"locationType": "airport", "iataCode": "AMS"},
            "departureTime": "2020-06-18T00:40:00.000Z",
            "arrivalTime": "2020-06-18T10:15:00.000Z",
            "segmentId": "SEG9"
        }, {
            "operator": {"operatorType": "airline", "iataCode": "KL", "flightNumber": "AF8239"},
            "origin": {"locationType": "airport", "iataCode": "AMS"},
            "destination": {"locationType": "airport", "iataCode": "CDG"},
            "departureTime": "2020-06-18T14:30:00.000Z",
            "arrivalTime": "2020-06-18T15:45:00.000Z",
            "segmentId": "SEG10"
        }],
        "filter_metadata": {"itinerary_duration": 905, "stops": 1, "operating_carriers": {"KL": "KL"}}
    }, {
        "itinId": "FL8",
        "segments": [{
            "operator": {"operatorType": "airline", "iataCode": "KL", "flightNumber": "AF8230"},
            "origin": {"locationType": "airport", "iataCode": "CDG"},
            "destination": {"locationType": "airport", "iataCode": "AMS"},
            "departureTime": "2020-06-24T08:15:00.000Z",
            "arrivalTime": "2020-06-24T09:35:00.000Z",
            "segmentId": "SEG13"
        }, {
            "operator": {"operatorType": "airline", "iataCode": "KL", "flightNumber": "AF8378"},
            "origin": {"locationType": "airport", "iataCode": "AMS"},
            "destination": {"locationType": "airport", "iataCode": "YVR"},
            "departureTime": "2020-06-24T13:20:00.000Z",
            "arrivalTime": "2020-06-24T23:10:00.000Z",
            "segmentId": "SEG12"
        }],
        "filter_metadata": {"itinerary_duration": 895, "stops": 1, "operating_carriers": {"KL": "KL"}}
    }]
}]
*/
