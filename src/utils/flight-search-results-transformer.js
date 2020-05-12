var _ = require('lodash')


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
            offerItems: {
              ...inboundOffer.offerItems,
              ...outboundOffer.offerItems,
            },
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
function transformResponse(response){
    response = mergeRoundTripOffers(response);
    let combinations = getAllCombinations(response);
    decorateHotelWithAccommodationId(response.accommodations)
    decoratePricePlanWithPricePlanId(response.pricePlans);
    response.combinations=combinations;
    return response;
}


function getAllCombinations(response){
    let flightCombinationOffersMap={};
    _.each(response.offers,(offer,offerId)=>{
        let flightCombination = getFlightCombination(offer.pricePlansReferences);
        let combinationId = createFlightCombinationId(flightCombination);
        let itineraryDetails = getItinerary(response,flightCombination);
        if(flightCombinationOffersMap[combinationId]===undefined){
            flightCombinationOffersMap[combinationId]={
                combinationId:combinationId,
                offers:[],
                itinerary:itineraryDetails
            }
        }

        let record = flightCombinationOffersMap[combinationId];
        record.offers.push({
            offerId:offerId,
            offer:offer,
            flightCombination:flightCombination
        });
    })

    return _.values(flightCombinationOffersMap);
}

function getItinerary(response,flightCombination){
    let flights=flightCombination.map(rec=>{
        let segments=response.itineraries.combinations[rec.flight]
        let segmentDetails=segments.map(segment=>{
            let segmentData = response.itineraries.segments[segment]
            return segmentData;
        })
        let itin={
            itinId:rec.flight,
            segments:segmentDetails
        }

        return itin;
    });
    return flights;
}



function getFlightCombination(pricePlansReferences){
    let itins=[]
    _.each(pricePlansReferences,(pricePlan,pricePlanId)=>{
        _.each(pricePlan.flights,(flight,id)=>{
            itins.push({flight:flight, pricePlan:pricePlanId})
        })
    })
    return itins;
}

function createFlightCombinationId(flightCombination){
    let flights=flightCombination.map(rec=>{return rec.flight});
    return flights.join(':')
}


function decorateHotelWithAccommodationId(accommodations){
    _.map(accommodations,(hotel,hotelId)=>{
        hotel.accommodationId=hotelId;
        decorateRoomTypeWithRoomTypeId(hotel.roomTypes)
    })
}

function decorateRoomTypeWithRoomTypeId(roomTypes){
    _.map(roomTypes,(roomType,roomTypeId)=>{
        roomType.roomTypeId=roomTypeId;
    })
}

function decoratePricePlanWithPricePlanId(pricePlans){
    _.map(pricePlans,(pricePlan,pricePlanId)=>{
        pricePlan.pricePlanId=pricePlanId;
    })
}



module.exports = {
    extendResponse: transformResponse
}



