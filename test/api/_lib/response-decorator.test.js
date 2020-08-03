const dotenv = require('dotenv')
dotenv.config({path: '.env'})
const sample_response = require('../../test_data/sample_flights_response')
const {enrichAirportCodesWithAirportDetails,enrichOperatingCarrierWithAirlineNames,replaceUTCTimeWithLocalAirportTime, convertSearchCriteriaDatesToUTC} = require('../../../api/_lib/response-decorator');
const assert = require('assert');
const _ = require('lodash');
const { utcToZonedTime,zonedTimeToUtc } = require('date-fns-tz');
describe('response-decorator', function () {
    describe('#enrichAirportCodesWithAirportDetails()', function () {
        it('should add origin and destination airport details to the response (to results.itineraries.segments', async ()=>{
            let segments = _.get(sample_response,'itineraries.segments',[]);
            let seg1 = segments["NW737YSSN6-SEG1"];
            assert.equal(seg1.origin.iataCode,"YYZ");
            assert.equal(seg1.origin.airport_name, undefined);
            assert.equal(seg1.origin.city_name, undefined);

            assert.equal(seg1.destination.iataCode,"YUL");
            assert.equal(seg1.destination.airport_name, undefined);
            assert.equal(seg1.destination.city_name, undefined);

            enrichAirportCodesWithAirportDetails(sample_response);
            assert.equal(seg1.origin.city_name, "Toronto");
            assert.equal(seg1.origin.airport_name, "Lester B. Pearson Intl");

            assert.equal(seg1.destination.city_name, "Montreal");
            assert.equal(seg1.destination.airport_name, "Pierre E.Trudeau Intl");
        });
    });


    describe('#enrichOperatingCarrierWithAirlineNames()', function () {
        it('should add origin and destination airport details to the response (to results.itineraries.segments', async ()=>{
            let segments = _.get(sample_response,'itineraries.segments',[]);
            let seg1 = segments["NW737YSSN6-SEG1"];
            assert.equal(seg1.operator.iataCode,"KV");
            assert.equal(seg1.operator.airline_name, undefined);

            enrichOperatingCarrierWithAirlineNames(sample_response);

            assert.equal(seg1.operator.iataCode,"KV");
            assert.equal(seg1.operator.airline_name, "Sky Regional Airlines");
        });
    });

    describe('#replaceUTCTimeWithLocalAirportTime()', function () {
        it('should convert UTC time (for departure and arrival time) ',async ()=> {

            let segments = _.get(sample_response,'itineraries.segments',[]);
            let seg1 = segments["NW737YSSN6-SEG1"];

            assert.equal(seg1.departureTimeUtc,undefined);
            assert.equal(seg1.departureTime,"2020-05-21T04:30:00.000Z");

            assert.equal(seg1.arrivalTimeUtc,undefined);
            assert.equal(seg1.arrivalTime,"2020-05-21T05:45:00.000Z");
            replaceUTCTimeWithLocalAirportTime(sample_response);
            assert.equal(seg1.departureTimeUtc,"2020-05-21T04:30:00.000Z");
            assert.equal(seg1.departureTime,"2020-05-20T22:30:00.000Z");

            assert.equal(seg1.arrivalTimeUtc,"2020-05-21T05:45:00.000Z");
            assert.equal(seg1.arrivalTime,"2020-05-20T23:45:00.000Z");
        });
    });

});


