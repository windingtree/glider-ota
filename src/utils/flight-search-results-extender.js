import update from 'immutability-helper';
import {BaseSearchResultsWrapper} from "./base-results-wrapper";
const _ = require('lodash')


// Detect if the search is one-way and return, and in case of return merge one-way offers
// This function heavily impact performances
const mergeRoundTripOffers = (searchResults) => {

    // Apply only to flight searches
    if(searchResults.itineraries === undefined) {
        return searchResults;
    }

    // Check if we have a roundtrip flight Search
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
 * Extend search results with additional collections to simplify UI
 */
export default function extendResponse(response){
    if(response && ('metadata' in response) && ('postprocessed' in response.metadata)){
        return response;
    }
    let copy = Object.assign({},response)
    let start=Date.now();
    copy = mergeRoundTripOffers(copy);
    //console.log("[Flight Results] Resulting merged offer: ", JSON.stringify(copy));
    // let combinations = getAllCombinations(response);
    // decorateHotelWithAccommodationId(response.accommodations)
    // decoratePricePlanWithPricePlanId(response.pricePlans);
    // response.combinations=combinations;
    let end=Date.now();
    if(!copy.metadata)
        copy.metadata={};
    copy.metadata['postprocessed']=true;
    /*
    Object.keys(copy.offers).forEach(offerId => {
      const offer = copy.offers[offerId];
      console.log(`${offerId}: ${offer.price.currency} ${offer.price.public}|${JSON.stringify(offer.pricePlansReferences)}`);
    });
    */
    return copy;
}



