var _ = require('lodash')


function extendResponse(response){
    let combinations = getAllCombinations(response);
    let newResponse = {
        combinations:combinations,
        pricePlans:response.pricePlans,
        passengers:response.passengers
    }
    // response.combinations = combinations;
    return newResponse;
}


function getAllCombinations(response){
    let flightCombinationOffersMap={};

    let i=0;
    _.each(response.offers,(offer,offerId)=>{
        i++;
        let flightCombination = getFlightCombination(offer.pricePlansReferences);
        let combinationId = createFlightCombinationId(flightCombination);
        // let itineraryDetails = createItineraryInfo(response,flightCombination);
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

function getItinerary(){

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

function processOffer(offerId, offer){

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

function createItineraryInfo(response,flightCombination){
    let flights=flightCombination.map(rec=>{return rec.flight});
    return flights;
}

module.exports = {
    extendResponse
}