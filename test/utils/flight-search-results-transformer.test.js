import {SearchResultsWrapper} from '../../src/utils/flight-search-results-transformer';
var _ = require('lodash')
var assert = require('assert');



const sample = require('../test_data/sample_response_unprocessed')
const resultsWrapper = new SearchResultsWrapper(sample);
const sampleOfferIdAF_0012="c74624e5-83a3-44f9-8624-e583a3b40012";



describe('SearchResultsWrapper', function () {
    describe('#getOffer()', function () {
        it('should return an offer if it exists or null if it does not exist', function () {
            let offer = resultsWrapper.getOffer(sampleOfferIdAF_0012);
            let expected = {
                "expiration": "2020-05-13T14:58:05.800Z",
                "offerItems": {
                    "e52f5198-9f37-4809-af51-989f37b809ba": {
                        "passengerReferences": "7C53D5D6"
                    }
                },
                "pricePlansReferences": {
                    "PC19": {
                        "flights": [
                            "FL5"
                        ]
                    },
                    "PC8": {
                        "flights": [
                            "FL2"
                        ]
                    }
                },
                "price": {
                    "currency": "EUR",
                    "public": "4916.99",
                    "commission": "39.97",
                    "taxes": "919.99"
                }
            }
            assert.notEqual(offer,undefined)
            assert.deepEqual(offer,expected)
            offer = resultsWrapper.getOffer('dummy-offer-id');
            assert.equal(offer,null)
        });
    });
    describe('#getOfferItineraries()', function () {
        it('should return an offer if it exists or null if it does not exist', function () {
            let offer = resultsWrapper.getOfferItineraries(sampleOfferIdAF_0012);


            let expected = [];
            assert.notEqual(offer,undefined)
            assert.deepEqual(offer,expected)
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

});
