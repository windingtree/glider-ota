import update from 'immutability-helper';
import {BaseSearchResultsWrapper} from "./base-results-wrapper";
const _ = require('lodash')

/**
 * Raw data returned from Glider OTA backend(flight&hotel search results) needs to be transformed in order to simplify further operations in UI.
 * <br/> This module contains functions that take raw results from the backend and transform to the desired structure.
 * @module utils/flight-search-results-extender
 */


/**
 * Merge outbound and inbound flight offers to have only one price for entire trip, instead of two prices for outbound and return trips separately.
 * <br/>When user makes a search for a return trip (e.g. JFK-LHR and LHR-JFK), some airlines return prices for outbound and inbound trips separately (e.g. JFK-LHR=500EUR,LHR-JFK=400EUR).
 * <br/>But the user wants to see the total price.
 * <br/>Therefore, we need to combine outbound and inbound offers together and also calculate the total price to show the user JFK-LHR-JFK=500EUR+400EUR=900EUR).
 * <br/>One way search results are not modified.
 * @param searchResults {Object} raw data returned from Glider OTA backend (search results)
 * @return {Object} transformed data with outbound and return trips combined together.
 */

const mergeRoundTripOffers = (searchResults) => {
    // Apply only to flight searches (accommodations will not be modified)
    if(searchResults.itineraries === undefined) {
        return searchResults;
    }

    // Check if we have a round-trip flight Search
    let isReturn = false;
    const combinations = searchResults.itineraries.combinations;
    const segments = searchResults.itineraries.segments;
    const orgIata = segments[Object.keys(segments)[0]].origin.iataCode;
    for(let combinationIndex=0; combinationIndex<Object.keys(combinations).length; combinationIndex++) {
        let combinationId = Object.keys(combinations)[combinationIndex];
        let firstSegment = segments[combinations[combinationId][0]];
        if(firstSegment.origin.iataCode !== orgIata) {
            isReturn = true;
            break;
        }
    }

    if(isReturn) {
      // Prepare to split inbound and outbound offers
      let inboundOffers = [];
      let outboundOffers = [];

      // Go through each offer
      Object.keys(searchResults.offers).forEach(offerId => {
        // Extract the price plans
        let pricePlans = Object.keys(searchResults.offers[offerId].pricePlansReferences);

        // If there is only one price plan with one flight, it is a one-way offer
        if(pricePlans.length === 1 &&
          searchResults.offers[offerId].pricePlansReferences[pricePlans[0]].flights.length === 1) {
            let flightKey = searchResults.offers[offerId].pricePlansReferences[pricePlans[0]].flights[0];
            let segmentKeys = searchResults.itineraries.combinations[flightKey];

            // Add offer to outbound or inbound arrays
            if(searchResults.itineraries.segments[segmentKeys[0]].origin.iataCode === orgIata) {
              outboundOffers.push(offerId);
            } else {
              inboundOffers.push(offerId);
            }

        }
      });

      // Create new combinations using the outbound and inboud
      for(let i=0; i<inboundOffers.length; i++) {
        let inboundOfferId = inboundOffers[i];
        for(let j=0; j<outboundOffers.length; j++) {
          let outboundOfferId = outboundOffers[j];
          let mergedofferKey = `${outboundOfferId},${inboundOfferId}`;

          // Retrieve details of both offers
          let outboundOffer = searchResults.offers[outboundOfferId];
          let inboundOffer = searchResults.offers[inboundOfferId];

          // Get the plan key, there is exactly one since it was filtered above
          let outboundPlanKey = Object.keys(outboundOffer.pricePlansReferences)[0];
          let inboundPlanKey = Object.keys(inboundOffer.pricePlansReferences)[0];

          let newPricePlansReferences = {};

          // If keys are the same, the flight list contains the two flights
          if(inboundPlanKey === outboundPlanKey) {
            newPricePlansReferences[outboundPlanKey] = { flights: [
              outboundOffer.pricePlansReferences[outboundPlanKey].flights[0],
              inboundOffer.pricePlansReferences[inboundPlanKey].flights[0],
            ]};
          }

          // Otherwise there is one key per pricePlan / flight
          else {
            newPricePlansReferences[outboundPlanKey] = outboundOffer.pricePlansReferences[outboundPlanKey];
            newPricePlansReferences[inboundPlanKey] = inboundOffer.pricePlansReferences[inboundPlanKey];
          }

          // Return the merged offer
          searchResults.offers[mergedofferKey] = {
            expiration: Date(inboundOffer.expiration) < Date(outboundOffer.expiration) ? inboundOffer.expiration : outboundOffer.expiration,
            pricePlansReferences: newPricePlansReferences,
            price: {
              currency: inboundOffer.price.currency,
              public: Number(Number(inboundOffer.price.public)+Number(outboundOffer.price.public)).toFixed(2),
              taxes: Number(Number(inboundOffer.price.taxes)+Number(outboundOffer.price.taxes)).toFixed(2),
            }
          }
        }

        // Delete the one-way inbound offer as soon as we do not need it to free memory
        delete(searchResults.offers[inboundOfferId]);
      }

      // Finally delete the remaining outbound offers
      for(let j=0; j<outboundOffers.length; j++) {
        delete(searchResults.offers[outboundOffers[j]]);
      }
    }

    return searchResults;
};

/**
 * This function takes care of any necessary transformations that are needed on raw search results (flight & hotels) before it's passed to UI.
 * <br/> It takes care of merging outbound and inbound flight offers.
 * <br/> If more transformations are needed - it's the best place to perform it.
 *
 */
export default function extendResponse(response){

    //only perform transormations once (detect if response was already transformed by metadata.postprocessed property)
    if(response && ('metadata' in response) && ('postprocessed' in response.metadata)){
        return response;
    }
    let copy = Object.assign({},response)
    let start=Date.now();
    copy = mergeRoundTripOffers(copy);
    let end=Date.now();
    if(!copy.metadata)
        copy.metadata={};
    copy.metadata['postprocessed']=true;
    return copy;
}



