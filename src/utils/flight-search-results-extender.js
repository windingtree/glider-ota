import update from 'immutability-helper';
import {BaseSearchResultsWrapper} from "./base-results-wrapper";
const _ = require('lodash')


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
        const combinationId = Object.keys(combinations)[combinationIndex];
        const firstSegment = segments[combinations[combinationId][0]];
        if(firstSegment.origin.iataCode !== orgIata) {
            isReturn = true;
            break;
        }
    }
    
    if(isReturn) {
      // Prepare to split inbound and outbound offers
      let offers = searchResults.offers;
      let inboundOffers = [];
      let outboundOffers = [];
  
      // Go through each offer
      Object.keys(offers).forEach(offerId => {
        // Extract the price plans
        const pricePlans = Object.keys(offers[offerId].pricePlansReferences);
  
        // If there is only one price plan with one flight, it is a one-way offer
        if(pricePlans.length === 1 && 
          offers[offerId].pricePlansReferences[pricePlans[0]].flights.length === 1) {
            const flightKey = offers[offerId].pricePlansReferences[pricePlans[0]].flights[0];
            const segmentKeys = searchResults.itineraries.combinations[flightKey];
  
            // Add offer to outbound or inbound arrays
            if(searchResults.itineraries.segments[segmentKeys[0]].origin.iataCode === orgIata) {
              outboundOffers.push(offerId);
            } else {
              inboundOffers.push(offerId);
            }
            
        }
      });
  
      // Create new combinations using the outbound and inboud
      inboundOffers.forEach(inboundOfferId => {
        outboundOffers.forEach(outboundOfferId => {
          const offerKey = `${outboundOfferId},${inboundOfferId}`;
          const inboundOffer = offers[inboundOfferId];
          const outboundOffer = offers[outboundOfferId];
          //console.log('Merging offers: ', JSON.stringify(inboundOffer), JSON.stringify(outboundOffer)); 
          offers[offerKey] = {
/*
            offerItems: {
              ...inboundOffer.offerItems,
              ...outboundOffer.offerItems,
            },
*/
            expiration: Date(inboundOffer.expiration) < Date(outboundOffer.expiration) ? inboundOffer.expiration : outboundOffer.expiration,
            pricePlansReferences: {
              ...inboundOffer.pricePlansReferences,
              ...outboundOffer.pricePlansReferences,
            },
            price: {
              currency: inboundOffer.price.currency,
              public: Number(Number(inboundOffer.price.public)+Number(outboundOffer.price.public)).toFixed(2),
              taxes: Number(Number(inboundOffer.price.taxes)+Number(outboundOffer.price.taxes)).toFixed(2),
            }
          }
        });
      });
  
      // Remove duplicated keys
      inboundOffers.forEach(offerId => {
        delete(offers[offerId]);
      });
      outboundOffers.forEach(offerId => {
        delete(offers[offerId]);
      });
  
      searchResults.offers = offers;
    }
  
    return searchResults;
};

/**
 * Extend search results with additional collections to simplify UI
 */
export default function extendResponse(response){
    if(response && ('metadata' in response) && ('postprocessed' in response.metadata)){
        console.debug("Response was already extended -ignoring this")
        return response;
    }
    let copy = Object.assign({},response)
    let start=Date.now();
    copy = mergeRoundTripOffers(copy);
    // let combinations = getAllCombinations(response);
    // decorateHotelWithAccommodationId(response.accommodations)
    // decoratePricePlanWithPricePlanId(response.pricePlans);
    // response.combinations=combinations;
    let end=Date.now();
    if(!copy.metadata)
        copy.metadata={};
    copy.metadata['postprocessed']=true;
    console.info(`Search results extender, time:${end-start}ms`)
    return copy;
}



