import {
    decorateItineraryWithMetadata,
    SearchResultsWrapper,
    sortItinerariesInDepartureTimeAscendingOrder
} from '../../src/utils/flight-search-results-transformer';
import extendResponse from "../../src/utils/flight-search-results-transformer";
import {config} from "../../src/config/default";
import {uiEvent} from "../../src/utils/events";
const fs = require('fs');

var _ = require('lodash')
var assert = require('assert');



const sample = require('../test_data/sample_response_unprocessed');
const resultsWrapper = new SearchResultsWrapper(sample);
const sampleOfferIdAF_0012="c74624e5-83a3-44f9-8624-e583a3b40012";


describe('#extendResponse()', function () {
    it('should return merge out/ret offers and save a file', function () {
        let filename="yul_yyz_rt";
        const unmergedJSON = require("../test_data/"+filename)
        let sizeBefore=JSON.stringify(unmergedJSON).length;
        let start=Date.now();
        let mergedJSON = extendResponse(unmergedJSON);
        let end=Date.now();
        let sizeAfter=JSON.stringify(mergedJSON).length;
        console.log(`JSON size before:${sizeBefore}, JSON size after:${sizeAfter}, Merging time ${end-start}ms`);
        fs.createWriteStream('./'+filename+".extended").write(JSON.stringify(mergedJSON));
    });
});


describe('#sortItinerariesInDepartureTimeAscendingOrder()', function () {
    it('should sort itineraries in departure time order', function () {

        let itineraries = resultsWrapper.getOfferItineraries(sampleOfferIdAF_0012);
        //initially in this case itins are in correct order (correct order is FL5, FL2, reversed is FL2, FL5)
        let itinJune17=itineraries[0];
        let itinJune24=itineraries[1];
        assert.equal("FL5",itinJune17.itinId)
        assert.equal("FL2",itinJune24.itinId)

        //check if sort does not change anything in this case
        sortItinerariesInDepartureTimeAscendingOrder(itineraries);
        assert.equal("FL5",itineraries[0].itinId)
        assert.equal("FL2",itineraries[1].itinId)

        //now let's put them in wrong order
        itineraries = [itinJune24,itinJune17]
        assert.equal("FL2",itineraries[0].itinId)
        assert.equal("FL5",itineraries[1].itinId)

        //check if sort fixes the order now
        sortItinerariesInDepartureTimeAscendingOrder(itineraries);
        assert.equal("FL5",itineraries[0].itinId)
        assert.equal("FL2",itineraries[1].itinId)


    });
});
describe('#decorateItineraryWithMetadata()', function () {
    it('should calculate trip duration (minutes) and add it to metadata so that search filters can use this for filtering', function () {

        let itineraries = resultsWrapper.getOfferItineraries(sampleOfferIdAF_0012);
        decorateItineraryWithMetadata(itineraries[0]);
        decorateItineraryWithMetadata(itineraries[1]);
        //initially in this case itins are in correct order (correct order is FL5, FL2, reversed is FL2, FL5)
        let itin1=itineraries[0];   //departure = 2020-06-17T16:00:00.000Z, arrival = 2020-06-18T05:55:00.000Z
        let itin2=itineraries[1];   //departure = 2020-06-24T08:15:00.000Z, arrival = 2020-06-24T18:25:00.000Z

        assert.equal(itin1.metadata.itinerary_duration,835)
        assert.equal(itin2.metadata.itinerary_duration,610)

        assert.equal(itin1.metadata.stops,1);
        assert.equal(itin2.metadata.stops,0);

        assert.deepEqual(itin1.metadata.operating_carriers,{"WS": "WS", "AF": "AF"});
        assert.deepEqual(itin2.metadata.operating_carriers,{"AF": "AF"});
    });
});



describe('SearchResultsWrapper', function () {

    describe('#getOffer()', function () {
        it('should return an offer if it exists or null if it does not exist', function () {
            let offer = resultsWrapper.getOffer(sampleOfferIdAF_0012);
            let expected = {
                "expiration": "2020-05-13T14:58:05.800Z",
                "offerItems": {"e52f5198-9f37-4809-af51-989f37b809ba": {"passengerReferences": "7C53D5D6"}},
                "pricePlansReferences": {"PC19": {"flights": ["FL5"]}, "PC8": {"flights": ["FL2"]}},
                "price": {"currency": "EUR", "public": "4916.99", "commission": "39.97", "taxes": "919.99"},
                "offerId": "c74624e5-83a3-44f9-8624-e583a3b40012"
            }
            assert.notEqual(offer,undefined)
            assert.deepEqual(offer,expected)
            offer = resultsWrapper.getOffer('dummy-offer-id');
            assert.equal(offer,null)
        });
    });
    describe('#getOfferItineraries()', function () {
        it('should return an offer if it exists or null if it does not exist', function () {
            let itineraries = resultsWrapper.getOfferItineraries(sampleOfferIdAF_0012);
            assert.equal(itineraries.length,2)
            assert.equal(itineraries[0].itinId,'FL5')
            assert.equal(itineraries[1].itinId,'FL2')
        });
    });

    describe('#getOfferPricePlans()', function () {
        it('should return array of price plans, with pricePlanId property enriched', function () {
            let offer = resultsWrapper.getOfferPricePlans(sampleOfferIdAF_0012);
            assert.equal(offer.length,2)

            //check new properties
            assert.equal(offer[0].pricePlanId,'PC19')
            assert.equal(offer[1].pricePlanId,'PC8')

            assert.notEqual(offer,undefined)
            assert.deepEqual(offer[0],{ name: 'Business',amenities: [],checkedBaggages: { quantity: 2 },pricePlanId: 'PC19' })
        });
    });

    describe('#getItinerary()', function () {
        it('should return itinerary object(itinID and list of segments that belong to itinerary) with ID provided as a parameter (itinId property is enriched)', function () {
            let itinerary = resultsWrapper.getItinerary('FL5');

            //check if itinId was added
            assert.equal(itinerary.itinId,'FL5')
            console.log("Itinerary",JSON.stringify(itinerary))

            assert.equal(itinerary.segments.length,2)
            assert.deepEqual(itinerary, {
                "itinId": "FL5",
                "segments": [{
                    "operator": {"operatorType": "airline", "iataCode": "WS", "flightNumber": "AF6565"},
                    "origin": {"locationType": "airport", "iataCode": "YVR"},
                    "destination": {"locationType": "airport", "iataCode": "YYZ"},
                    "departureTime": "2020-06-17T16:00:00.000Z",
                    "arrivalTime": "2020-06-17T20:30:00.000Z",
                    "segmentId": "SEG7"
                }, {
                    "operator": {"operatorType": "airline", "iataCode": "AF", "flightNumber": "AF0351"},
                    "origin": {"locationType": "airport", "iataCode": "YYZ"},
                    "destination": {"locationType": "airport", "iataCode": "CDG"},
                    "departureTime": "2020-06-17T22:20:00.000Z",
                    "arrivalTime": "2020-06-18T05:55:00.000Z",
                    "segmentId": "SEG8"
                }]
            })
        });
    });

    describe('#findAlternativeOffers()', function () {
        it('should return an array all offers available in search results for a given itinerary', function () {
            let matchingOffers = resultsWrapper.findAlternativeOffers(sampleOfferIdAF_0012);
            assert.equal(matchingOffers.length,5);

            //cross check - make sure each offer returned by #findAvailableItineraryOffers() indeed contains exactly same itineraries as requested
            matchingOffers.forEach(offer=>{
                let itinIds = resultsWrapper._getOfferItinerariesIds(offer.offerId);
                itinIds.sort();
                assert.deepEqual(itinIds,[ 'FL2','FL5'])
            })
        });
    });

    describe('#generateTripFareFamilyMap()', function () {
        it('should return a list with mapping between itinID, offerID, pricePlanID and its price for all available price plans for a given itinerary', function () {
            let mapping = resultsWrapper.generateTripRatesData(sampleOfferIdAF_0012);
            let expected = [{"itinId":"FL5","pricePlanId":"PC2","offerId":"c74624e5-83a3-44f9-8624-e583a3b4000e","price":{"currency":"EUR","public":"650.39","commission":"1.81","taxes":"469.39"},"pricePlan":{"name":"Light","amenities":[],"checkedBaggages":{"quantity":0},"pricePlanId":"PC2"}},{"itinId":"FL2","pricePlanId":"PC3","offerId":"c74624e5-83a3-44f9-8624-e583a3b4000e","price":{"currency":"EUR","public":"650.39","commission":"1.81","taxes":"469.39"},"pricePlan":{"name":"Light","amenities":[],"checkedBaggages":{"quantity":0},"pricePlanId":"PC3"}},{"itinId":"FL5","pricePlanId":"PC23","offerId":"c74624e5-83a3-44f9-8624-e583a3b4000f","price":{"currency":"EUR","public":"1832.23","commission":"12.97","taxes":"535.23"},"pricePlan":{"name":"Premium Economy","amenities":[],"checkedBaggages":{"quantity":2},"pricePlanId":"PC23"}},{"itinId":"FL2","pricePlanId":"PC24","offerId":"c74624e5-83a3-44f9-8624-e583a3b4000f","price":{"currency":"EUR","public":"1832.23","commission":"12.97","taxes":"535.23"},"pricePlan":{"name":"Premium Economy","amenities":[],"checkedBaggages":{"quantity":2},"pricePlanId":"PC24"}},{"itinId":"FL5","pricePlanId":"PC19","offerId":"c74624e5-83a3-44f9-8624-e583a3b40010","price":{"currency":"EUR","public":"3328.83","commission":"26.29","taxes":"699.83"},"pricePlan":{"name":"Business","amenities":[],"checkedBaggages":{"quantity":2},"pricePlanId":"PC19"}},{"itinId":"FL2","pricePlanId":"PC24","offerId":"c74624e5-83a3-44f9-8624-e583a3b40010","price":{"currency":"EUR","public":"3328.83","commission":"26.29","taxes":"699.83"},"pricePlan":{"name":"Premium Economy","amenities":[],"checkedBaggages":{"quantity":2},"pricePlanId":"PC24"}},{"itinId":"FL5","pricePlanId":"PC23","offerId":"c74624e5-83a3-44f9-8624-e583a3b40011","price":{"currency":"EUR","public":"3419.39","commission":"26.64","taxes":"755.39"},"pricePlan":{"name":"Premium Economy","amenities":[],"checkedBaggages":{"quantity":2},"pricePlanId":"PC23"}},{"itinId":"FL2","pricePlanId":"PC8","offerId":"c74624e5-83a3-44f9-8624-e583a3b40011","price":{"currency":"EUR","public":"3419.39","commission":"26.64","taxes":"755.39"},"pricePlan":{"name":"Business","amenities":[],"checkedBaggages":{"quantity":2},"pricePlanId":"PC8"}},{"itinId":"FL5","pricePlanId":"PC19","offerId":"c74624e5-83a3-44f9-8624-e583a3b40012","price":{"currency":"EUR","public":"4916.99","commission":"39.97","taxes":"919.99"},"pricePlan":{"name":"Business","amenities":[],"checkedBaggages":{"quantity":2},"pricePlanId":"PC19"}},{"itinId":"FL2","pricePlanId":"PC8","offerId":"c74624e5-83a3-44f9-8624-e583a3b40012","price":{"currency":"EUR","public":"4916.99","commission":"39.97","taxes":"919.99"},"pricePlan":{"name":"Business","amenities":[],"checkedBaggages":{"quantity":2},"pricePlanId":"PC8"}}];
            assert.deepEqual(mapping,expected)
        });
    });


    describe('#generateTripFareFamilyMapAC()', function () {
        it('should return a list with mapping between itinID, offerID, pricePlanID and its price for all available price plans for a given itinerary', function () {
            const sampleFile = require('../test_data/air_canada_roundtrip');
            const rw = new SearchResultsWrapper(sample);
            let mapping = rw.generateTripRatesData("a6c7c1a6-56ba-41d1-92fe-18c325abad8a,7f4d2a46-32a1-4865-ba47-516c56e31e11");
            console.log(JSON.stringify(mapping))
        });
    });


    describe('#generateSearchResults()', function () {
        it('should return list of trips ordered by either duration or price', function () {
            const resultsWrapper = new SearchResultsWrapper(sample);
            let results = resultsWrapper.generateSearchResults('PRICE');
            assert.ok(results[0].minPrice <= results[1].minPrice)
            assert.ok(results[1].minPrice <= results[2].minPrice)

            results = resultsWrapper.generateSearchResults('DURATION');
            assert.ok(results[0].trip_duration <= results[1].trip_duration)
            assert.ok(results[1].trip_duration <= results[2].trip_duration)
        });
    });


});

[{
    "minPrice": "3145.83",
    "trip_duration": 1823,
    "tripId": "FL6,FL4",
    "offerId": "c74624e5-83a3-44f9-8624-e583a3b4002c"
}, {
    "minPrice": "1188.10",
    "trip_duration": 1285,
    "tripId": "U472IAXG82-OD1",
    "offerId": "1ac83b25-4bf2-4a5b-8d25-94614f8e54e8"
}, {
    "minPrice": "1192.36",
    "trip_duration": 970,
    "tripId": "N3P87978CC-OD3",
    "offerId": "251d3a73-4f77-45fa-960d-6793b83779b5"
}, {
    "minPrice": "1192.36",
    "trip_duration": 940,
    "tripId": "L7Y2YK4M4Q-OD4",
    "offerId": "7f7383a4-02ed-445c-b7ad-f471f7ad1f34"
}, {
    "minPrice": "1192.36",
    "trip_duration": 880,
    "tripId": "EM4HFYI6M7-OD5",
    "offerId": "b727c69b-d85e-415a-ae9d-1281b8c630c3"
}, {
    "minPrice": "1211.11",
    "trip_duration": 945,
    "tripId": "HUD4LX9AWY-OD6",
    "offerId": "39af7c43-6b61-4a95-ac8a-b1e24ba65abd"
}, {
    "minPrice": "1253.10",
    "trip_duration": 1720,
    "tripId": "HBHSBJCHIN-OD7",
    "offerId": "d8c3fc15-1e88-4ff7-931d-7cddb86610d8"
}, {
    "minPrice": "1253.10",
    "trip_duration": 1900,
    "tripId": "FMTI9PIVUR-OD8",
    "offerId": "32adf3c5-091f-4b2a-9695-6f56017c572b"
}, {
    "minPrice": "1253.10",
    "trip_duration": 1890,
    "tripId": "AG6YY5J3YU-OD9",
    "offerId": "6670bea3-e53a-439c-92f3-f896838e9ccf"
}, {
    "minPrice": "1485.47",
    "trip_duration": 900,
    "tripId": "UWJE9AZ056-OD10",
    "offerId": "be554efa-8225-4ab5-a5b4-59da00c25a5a"
}, {
    "minPrice": "1485.47",
    "trip_duration": 1140,
    "tripId": "H3CTFGFREN-OD11",
    "offerId": "3c57b0e9-b8d4-40cb-ab39-216337ba2998"
}, {
    "minPrice": "1485.47",
    "trip_duration": 750,
    "tripId": "VE73QGHS2Y-OD12",
    "offerId": "a5080937-43b7-4f55-b91a-3c8575af5d72"
}, {
    "minPrice": "1485.47",
    "trip_duration": 990,
    "tripId": "H1LHFNJ4HK-OD13",
    "offerId": "3598a372-dc2d-4a7a-bb97-283ed63e6651"
}, {
    "minPrice": "1023.05",
    "trip_duration": 825,
    "tripId": "H1RGPB1HM6-OD14",
    "offerId": "71b5beb2-dfb9-4efb-8a2b-de6bc137893f"
}, {
    "minPrice": "1023.05",
    "trip_duration": 1030,
    "tripId": "SXH1O12RT3-OD15",
    "offerId": "30eb9ab3-3cba-468c-b8d7-71e355e77cbb"
}, {
    "minPrice": "1162.25",
    "trip_duration": 1030,
    "tripId": "HX9S4EG2ZL-OD29",
    "offerId": "e6c691dc-e6bc-4cad-ac15-a940fe374f05"
}, {
    "minPrice": "1800.76",
    "trip_duration": 855,
    "tripId": "DQ7DJ4GZ6D-OD30",
    "offerId": "a1919d5d-93d4-4146-9c39-15543ccd43eb"
}, {
    "minPrice": "1800.76",
    "trip_duration": 1526,
    "tripId": "DE9VEQMONX-OD31",
    "offerId": "6cf213f7-106e-42e2-8386-6b7b59a619d1"
}, {
    "minPrice": "1800.76",
    "trip_duration": 1050,
    "tripId": "HAEDE5C2GN-OD32",
    "offerId": "3313e661-70e0-4b96-bb64-ecda7b29f3ee"
}, {
    "minPrice": "1485.47",
    "trip_duration": 1050,
    "tripId": "V239UW2HPY-OD49",
    "offerId": "69711bf4-e47e-4d98-af12-3147df41f50e"
}, {
    "minPrice": "1248.60",
    "trip_duration": 610,
    "tripId": "CVCWVO8WEP-OD142",
    "offerId": "fb872ec3-239d-4dbb-a440-04ed71a7a1d9"
}, {
    "minPrice": "1248.60",
    "trip_duration": 840,
    "tripId": "AW7BTYSSF0-OD143",
    "offerId": "63bdd97d-d7cc-4619-9fe3-5af69a6af4a1"
}, {
    "minPrice": "1248.60",
    "trip_duration": 849,
    "tripId": "QYEFB9B2TD-OD144",
    "offerId": "4bc322c5-c4cb-4ea2-855d-7dfcc7a9afa7"
}, {
    "minPrice": "1248.60",
    "trip_duration": 1009,
    "tripId": "H476GHH55P-OD145",
    "offerId": "2c407dd8-c211-40cc-b4d5-2f95d60adc4b"
}, {
    "minPrice": "1248.60",
    "trip_duration": 881,
    "tripId": "XYIQVSFSDV-OD146",
    "offerId": "ab8d4909-1b0f-47b4-8e47-5c275f743247"
}, {
    "minPrice": "1248.60",
    "trip_duration": 1054,
    "tripId": "Z50P9KDM3Q-OD147",
    "offerId": "d0568aa6-2283-4b22-9ef1-063e5ca64f24"
}, {
    "minPrice": "1248.60",
    "trip_duration": 1694,
    "tripId": "MU49E5HKIT-OD148",
    "offerId": "c5391a02-fdcb-4c69-bed3-81f3558d54b1"
}, {
    "minPrice": "1252.86",
    "trip_duration": 917,
    "tripId": "H6ANPQ6HEQ-OD149",
    "offerId": "745d07ad-12f3-4bb0-a30b-dba126de99c8"
}, {
    "minPrice": "1252.86",
    "trip_duration": 960,
    "tripId": "W7LR8CCP5F-OD150",
    "offerId": "8c1a7e0d-b7ce-42d4-9381-0b5c5972020d"
}, {
    "minPrice": "1252.86",
    "trip_duration": 1036,
    "tripId": "KMBIVC0C4L-OD151",
    "offerId": "c724b48f-e2e2-4f00-9275-1464ecd1a2da"
}, {
    "minPrice": "1255.45",
    "trip_duration": 820,
    "tripId": "H63Y0HJYNY-OD152",
    "offerId": "3398204d-aa71-4222-9954-813e15f8bb8a"
}, {
    "minPrice": "1018.26",
    "trip_duration": 1245,
    "tripId": "HNW6PXHV25-OD153",
    "offerId": "17c904fb-cd66-470f-b33c-332211ffc15a"
}, {
    "minPrice": "1018.26",
    "trip_duration": 1040,
    "tripId": "Y82VSWD94G-OD154",
    "offerId": "ddf107a9-4942-4ee0-9fc0-cb5d9e64d37b"
}, {
    "minPrice": "1255.45",
    "trip_duration": 745,
    "tripId": "JNPDRT3BHO-OD155",
    "offerId": "0abea531-069b-4484-94a6-7addb05e100f"
}, {
    "minPrice": "1505.45",
    "trip_duration": 825,
    "tripId": "WFH4M52ETV-OD156",
    "offerId": "a8eff25e-77bd-44e4-98b6-d3a1529063dc"
}, {
    "minPrice": "1505.45",
    "trip_duration": 795,
    "tripId": "SO2VJAPAG3-OD157",
    "offerId": "07fe41a3-238a-40a8-810b-e5083ba45cd2"
}, {
    "minPrice": "1505.45",
    "trip_duration": 760,
    "tripId": "BPVU20EJH0-OD158",
    "offerId": "fdf7f1f9-880b-4bd6-9ffa-690ef6a21b67"
}, {
    "minPrice": "1054.23",
    "trip_duration": 810,
    "tripId": "HATMBWOXF7-OD159",
    "offerId": "2051be04-aa9f-4838-86b0-a840e9d32e25"
}, {
    "minPrice": "1795.26",
    "trip_duration": 1014,
    "tripId": "LKONL5XGGW-OD173",
    "offerId": "4f5b0139-149a-4a93-a684-d42d40e32060"
}, {
    "minPrice": "1795.26",
    "trip_duration": 1195,
    "tripId": "ZG2N0ZTF0M-OD193",
    "offerId": "009bb20b-9540-4057-9c94-77bc40625a37"
}, {
    "minPrice": "1551.24",
    "trip_duration": 1200,
    "tripId": "FL1,FL2",
    "offerId": "c74624e5-83a3-44f9-8624-e583a3b40002"
}, {
    "minPrice": "3145.83",
    "trip_duration": 1500,
    "tripId": "FL3,FL2",
    "offerId": "c74624e5-83a3-44f9-8624-e583a3b40007"
}, {
    "minPrice": "1551.24",
    "trip_duration": 1508,
    "tripId": "FL1,FL4",
    "offerId": "c74624e5-83a3-44f9-8624-e583a3b4000a"
}, {
    "minPrice": "1832.23",
    "trip_duration": 1445,
    "tripId": "FL5,FL2",
    "offerId": "c74624e5-83a3-44f9-8624-e583a3b4000f"
}, {
    "minPrice": "3145.83",
    "trip_duration": 1515,
    "tripId": "FL6,FL2",
    "offerId": "c74624e5-83a3-44f9-8624-e583a3b40014"
}, {
    "minPrice": "3145.83",
    "trip_duration": 1808,
    "tripId": "FL3,FL4",
    "offerId": "c74624e5-83a3-44f9-8624-e583a3b40017"
}, {
    "minPrice": "3145.33",
    "trip_duration": 1360,
    "tripId": "FL1,FL7",
    "offerId": "c74624e5-83a3-44f9-8624-e583a3b4001a"
}, {
    "minPrice": "3145.33",
    "trip_duration": 1485,
    "tripId": "FL1,FL8",
    "offerId": "c74624e5-83a3-44f9-8624-e583a3b4001d"
}, {
    "minPrice": "3145.83",
    "trip_duration": 1370,
    "tripId": "FL9,FL2",
    "offerId": "c74624e5-83a3-44f9-8624-e583a3b40020"
}, {
    "minPrice": "4740.92",
    "trip_duration": 1660,
    "tripId": "FL3,FL7",
    "offerId": "c74624e5-83a3-44f9-8624-e583a3b40023"
}, {
    "minPrice": "4740.92",
    "trip_duration": 1785,
    "tripId": "FL3,FL8",
    "offerId": "c74624e5-83a3-44f9-8624-e583a3b40025"
}, {
    "minPrice": "1832.23",
    "trip_duration": 1753,
    "tripId": "FL5,FL4",
    "offerId": "c74624e5-83a3-44f9-8624-e583a3b40027"
}, {
    "minPrice": "1188.10",
    "trip_duration": 845,
    "tripId": "HDTSHLJ5L7-OD2",
    "offerId": "885db797-c254-499c-b191-401758dff212"
}, {
    "minPrice": "1551.24",
    "trip_duration": 1465,
    "tripId": "FL10,FL2",
    "offerId": "c74624e5-83a3-44f9-8624-e583a3b4002f"
}, {
    "minPrice": "3145.33",
    "trip_duration": 1400,
    "tripId": "FL1,FL11",
    "offerId": "c74624e5-83a3-44f9-8624-e583a3b40034"
}, {
    "minPrice": "3145.83",
    "trip_duration": 1400,
    "tripId": "FL12,FL2",
    "offerId": "c74624e5-83a3-44f9-8624-e583a3b40037"
}, {
    "minPrice": "4740.92",
    "trip_duration": 1700,
    "tripId": "FL3,FL11",
    "offerId": "c74624e5-83a3-44f9-8624-e583a3b4003a"
}, {
    "minPrice": "3426.32",
    "trip_duration": 1605,
    "tripId": "FL5,FL7",
    "offerId": "c74624e5-83a3-44f9-8624-e583a3b4003c"
}, {
    "minPrice": "3426.32",
    "trip_duration": 1730,
    "tripId": "FL5,FL8",
    "offerId": "c74624e5-83a3-44f9-8624-e583a3b4003f"
}, {
    "minPrice": "4740.92",
    "trip_duration": 1675,
    "tripId": "FL6,FL7",
    "offerId": "c74624e5-83a3-44f9-8624-e583a3b40042"
}, {
    "minPrice": "4740.92",
    "trip_duration": 1800,
    "tripId": "FL6,FL8",
    "offerId": "c74624e5-83a3-44f9-8624-e583a3b40044"
}, {
    "minPrice": "3145.83",
    "trip_duration": 1678,
    "tripId": "FL9,FL4",
    "offerId": "c74624e5-83a3-44f9-8624-e583a3b40046"
}, {
    "minPrice": "1551.24",
    "trip_duration": 1773,
    "tripId": "FL10,FL4",
    "offerId": "c74624e5-83a3-44f9-8624-e583a3b40049"
}, {
    "minPrice": "3426.32",
    "trip_duration": 1645,
    "tripId": "FL5,FL11",
    "offerId": "c74624e5-83a3-44f9-8624-e583a3b4004e"
}, {
    "minPrice": "4740.92",
    "trip_duration": 1715,
    "tripId": "FL6,FL11",
    "offerId": "c74624e5-83a3-44f9-8624-e583a3b40051"
}, {
    "minPrice": "4740.92",
    "trip_duration": 1530,
    "tripId": "FL9,FL7",
    "offerId": "c74624e5-83a3-44f9-8624-e583a3b40053"
}, {
    "minPrice": "4740.92",
    "trip_duration": 1655,
    "tripId": "FL9,FL8",
    "offerId": "c74624e5-83a3-44f9-8624-e583a3b40055"
}, {
    "minPrice": "3145.83",
    "trip_duration": 1708,
    "tripId": "FL12,FL4",
    "offerId": "c74624e5-83a3-44f9-8624-e583a3b40057"
}, {
    "minPrice": "2217.21",
    "trip_duration": 1335,
    "tripId": "FL13,FL2",
    "offerId": "c74624e5-83a3-44f9-8624-e583a3b4005a"
}, {
    "minPrice": "3145.33",
    "trip_duration": 1625,
    "tripId": "FL10,FL7",
    "offerId": "c74624e5-83a3-44f9-8624-e583a3b4005f"
}, {
    "minPrice": "3145.33",
    "trip_duration": 1750,
    "tripId": "FL10,FL8",
    "offerId": "c74624e5-83a3-44f9-8624-e583a3b40062"
}, {
    "minPrice": "4740.92",
    "trip_duration": 1570,
    "tripId": "FL9,FL11",
    "offerId": "c74624e5-83a3-44f9-8624-e583a3b40065"
}, {
    "minPrice": "4740.92",
    "trip_duration": 1560,
    "tripId": "FL12,FL7",
    "offerId": "c74624e5-83a3-44f9-8624-e583a3b40067"
}, {
    "minPrice": "4740.92",
    "trip_duration": 1685,
    "tripId": "FL12,FL8",
    "offerId": "c74624e5-83a3-44f9-8624-e583a3b40069"
}, {
    "minPrice": "3145.33",
    "trip_duration": 1665,
    "tripId": "FL10,FL11",
    "offerId": "c74624e5-83a3-44f9-8624-e583a3b4006b"
}, {
    "minPrice": "2217.21",
    "trip_duration": 1643,
    "tripId": "FL13,FL4",
    "offerId": "c74624e5-83a3-44f9-8624-e583a3b4006e"
}, {
    "minPrice": "4740.92",
    "trip_duration": 1600,
    "tripId": "FL12,FL11",
    "offerId": "c74624e5-83a3-44f9-8624-e583a3b40073"
}, {
    "minPrice": "3811.30",
    "trip_duration": 1495,
    "tripId": "FL13,FL7",
    "offerId": "c74624e5-83a3-44f9-8624-e583a3b40075"
}, {
    "minPrice": "3811.30",
    "trip_duration": 1620,
    "tripId": "FL13,FL8",
    "offerId": "c74624e5-83a3-44f9-8624-e583a3b40078"
}, {
    "minPrice": "1001.30",
    "trip_duration": 1535,
    "tripId": "FL13,FL11",
    "offerId": "c74624e5-83a3-44f9-8624-e583a3b4007a"
}, {
    "minPrice": "3145.33",
    "trip_duration": 1465,
    "tripId": "FL1,FL14",
    "offerId": "c74624e5-83a3-44f9-8624-e583a3b4007d"
}, {
    "minPrice": "3145.33",
    "trip_duration": 1535,
    "tripId": "FL1,FL15",
    "offerId": "c74624e5-83a3-44f9-8624-e583a3b4007f"
}, {
    "minPrice": "3145.33",
    "trip_duration": 1730,
    "tripId": "FL10,FL14",
    "offerId": "c74624e5-83a3-44f9-8624-e583a3b40081"
}, {
    "minPrice": "3145.33",
    "trip_duration": 1800,
    "tripId": "FL10,FL15",
    "offerId": "c74624e5-83a3-44f9-8624-e583a3b40083"
}, {
    "minPrice": "3214.39",
    "trip_duration": 1558,
    "tripId": "FL1,FL16",
    "offerId": "c74624e5-83a3-44f9-8624-e583a3b40085"
}, {
    "minPrice": "3214.39",
    "trip_duration": 1823,
    "tripId": "FL10,FL16",
    "offerId": "c74624e5-83a3-44f9-8624-e583a3b40087"
}, {
    "minPrice": "3426.32",
    "trip_duration": 1710,
    "tripId": "FL5,FL14",
    "offerId": "c74624e5-83a3-44f9-8624-e583a3b40089"
}, {
    "minPrice": "3426.32",
    "trip_duration": 1780,
    "tripId": "FL5,FL15",
    "offerId": "c74624e5-83a3-44f9-8624-e583a3b4008b"
}, {
    "minPrice": "3495.37",
    "trip_duration": 1803,
    "tripId": "FL5,FL16",
    "offerId": "c74624e5-83a3-44f9-8624-e583a3b4008d"
}, {
    "minPrice": "3811.30",
    "trip_duration": 1600,
    "tripId": "FL13,FL14",
    "offerId": "c74624e5-83a3-44f9-8624-e583a3b4008f"
}, {
    "minPrice": "3811.30",
    "trip_duration": 1670,
    "tripId": "FL13,FL15",
    "offerId": "c74624e5-83a3-44f9-8624-e583a3b40091"
}, {
    "minPrice": "3880.36",
    "trip_duration": 1693,
    "tripId": "FL13,FL16",
    "offerId": "c74624e5-83a3-44f9-8624-e583a3b40093"
}, {
    "minPrice": "4740.92",
    "trip_duration": 1665,
    "tripId": "FL12,FL14",
    "offerId": "c74624e5-83a3-44f9-8624-e583a3b40095"
}, {
    "minPrice": "4740.92",
    "trip_duration": 1735,
    "tripId": "FL12,FL15",
    "offerId": "c74624e5-83a3-44f9-8624-e583a3b40096"
}, {
    "minPrice": "4740.92",
    "trip_duration": 1635,
    "tripId": "FL9,FL14",
    "offerId": "c74624e5-83a3-44f9-8624-e583a3b40097"
}, {
    "minPrice": "4740.92",
    "trip_duration": 1705,
    "tripId": "FL9,FL15",
    "offerId": "c74624e5-83a3-44f9-8624-e583a3b40098"
}, {
    "minPrice": "4740.92",
    "trip_duration": 1780,
    "tripId": "FL6,FL14",
    "offerId": "c74624e5-83a3-44f9-8624-e583a3b40099"
}, {
    "minPrice": "4740.92",
    "trip_duration": 1850,
    "tripId": "FL6,FL15",
    "offerId": "c74624e5-83a3-44f9-8624-e583a3b4009a"
}, {
    "minPrice": "4740.92",
    "trip_duration": 1765,
    "tripId": "FL3,FL14",
    "offerId": "c74624e5-83a3-44f9-8624-e583a3b4009b"
}, {
    "minPrice": "4740.92",
    "trip_duration": 1835,
    "tripId": "FL3,FL15",
    "offerId": "c74624e5-83a3-44f9-8624-e583a3b4009c"
}, {
    "minPrice": "4808.98",
    "trip_duration": 1728,
    "tripId": "FL9,FL16",
    "offerId": "c74624e5-83a3-44f9-8624-e583a3b4009d"
}, {
    "minPrice": "4808.98",
    "trip_duration": 1758,
    "tripId": "FL12,FL16",
    "offerId": "c74624e5-83a3-44f9-8624-e583a3b4009e"
}, {
    "minPrice": "4808.98",
    "trip_duration": 1858,
    "tripId": "FL3,FL16",
    "offerId": "c74624e5-83a3-44f9-8624-e583a3b4009f"
}, {
    "minPrice": "4808.98",
    "trip_duration": 1873,
    "tripId": "FL6,FL16",
    "offerId": "c74624e5-83a3-44f9-8624-e583a3b400a0"
}]
