const {SearchResultsWrapper} = require('./search-results-wrapper');
var _ = require('lodash')
const sampleSearchResults = require('./sample_response_unprocessed')

const sampleOfferIdAF_0012="c74624e5-83a3-44f9-8624-e583a3b40012";


const resultsWrapper = new SearchResultsWrapper(sampleSearchResults);

var assert = require('assert');
describe('search-results-wrapper', function () {
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
    describe('#getItineraries()', function(){
        let itinerary = resultsWrapper.getItinerary("U472IAXG82-OD1")
        console.log("itinerary:",itinerary)
    })
});


/*
 "c74624e5-83a3-44f9-8624-e583a3b40012": {
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
    },
 */