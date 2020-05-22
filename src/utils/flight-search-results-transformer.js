import update from 'immutability-helper';
import {differenceInMinutes, parseISO} from "date-fns";
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
        console.warn("Response was already extended -ignoring this")
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
    console.log(`Search results extender, time:${end-start}ms`)
    return copy;
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
export function sortItinerariesInDepartureTimeAscendingOrder(itineraries){
    itineraries.sort(firstSegDptrDateComparator);
    return itineraries;
}

const firstSegDptrDateComparator = (itin1, itin2) => {
    if(itin1.segments[0].departureTime < itin2.segments[0].departureTime)
        return -1;
    else return 1;
}


export function decorateItineraryWithMetadata(itinerary){
        //calculate trip duration in mins
        let firstSeg = itinerary.segments[0];
        let lastSeg = itinerary.segments[itinerary.segments.length-1];
        let startOfTrip = parseISO(firstSeg.departureTime);
        let endOfTrip = parseISO(lastSeg.arrivalTime);
        let durationInMins = differenceInMinutes(endOfTrip, startOfTrip);
        //get all operating carrier codes
        let carriers={}
        itinerary.segments.forEach(segment=>carriers[segment.operator.iataCode]=segment.operator.iataCode);

        let metadata={
            itinerary_duration:durationInMins,
            stops:itinerary.segments.length-1,
            operating_carriers:carriers
        }
        itinerary=Object.assign(itinerary,{metadata:metadata});
    return itinerary;
}

export function decorateOfferWithMetadata(offer){
    //calculate trip duration in mins

}


export class SearchResultsWrapper {
    constructor(searchResults) {
        this.results = searchResults;
        this.offers = searchResults.offers;
        this.itineraries = searchResults.itineraries;
        this.pricePlans = searchResults.pricePlans;
    }

    /**
     * Returns offer details for an offerID provided as a parameter
     * Returned object is a deep copy of a corresponding record from search results.
     * Returned object is enriched with offerId
     * @param offerId
     */
    getOffer(offerId){
        let offer = this.offers[offerId];
        if(!offer) {
            console.warn(`SearchResultsWrapper - requested offer was not found!`)
            return null;
        }
        offer = update(offer,{offerId:{$set:offerId}});  //enrich returned object with "offerId" property
        return offer;
    }

    /**
     * Return array of itineraries that belong to a given offer
     * Returned array contains deep copies of corresponding records from search results
     * @param offerId
     * @returns {{itinId: *, segments: *[]}[]}
     */
    getOfferItineraries(offerId){
        let offerItinIds = this._getOfferItinerariesIds(offerId);
        let itineraries = offerItinIds.map((itinId)=>{return this.getItinerary(itinId);})

        //put itins in order (departure date of first segment)
        sortItinerariesInDepartureTimeAscendingOrder(itineraries);
        return itineraries;
    }


    /**
     * Return array containing price plans that belong to a given offerId
     * Returned object is a deep copy of a corresponding record from search results
     * @param offerId
     * @returns
     */
    getOfferPricePlans(offerId){
        let offer = this.getOffer(offerId);
        let pricePlans=[];
        let pricePlansReferences = offer.pricePlansReferences;
        Object.keys(pricePlansReferences).map(pricePlanId=> {
            let pricePlan = update(this.pricePlans[pricePlanId],{pricePlanId:{$set:pricePlanId}});  //enrich returned object with "pricePlanId" property
            pricePlans.push(this.getPricePlan(pricePlanId));
        })
        return pricePlans;
    }

    getPricePlan(pricePlanId){
        let pricePlan = update(this.pricePlans[pricePlanId],{pricePlanId:{$set:pricePlanId}});  //enrich returned object with "pricePlanId" property
        return pricePlan;
    }


    /**
     * Returns object containing itinerary (itinId and list of segments that build an itinerary provided by itinId parameter).
     * Returned object is a deep copy of a corresponding record from search results
     * @param itinId
     * @returns {{itinId: *, segments: []}}
     */
    getItinerary(itinId){
        let segmentIds = this.itineraries.combinations[itinId];
        let segments=[];
        segmentIds.forEach(segmentId=>{
            segments.push(this.getSegment(segmentId));
        })
        let itinerary = {
            itinId:itinId,    //enrich returned object with "itinId" property
            segments:segments
        }
        decorateItineraryWithMetadata(itinerary);
        return itinerary;
    }

    /**
     * Return segment details for a segmentId provided by a parameter.
     * Returned object is enriched with segmentId
     * Returned object is a deep copy of a corresponding record from search results
     * @param segmentId
     * @returns {*[{departureTime: undefined, origin: undefined, destination: undefined}|{departureTime: string, arrivalTime: string, origin: {iataCode: string, airport_name: string, locationType: string}, destination: {iataCode: string, airport_name: string, locationType: string}, operator: {iataCode: string, flight_number: string, flight_info: string, operatorType: string, carrier_name: string}}|{departureTime: string, arrivalTime: string, origin: {iataCode: string, locationType: string}, destination: {iataCode: string, locationType: string}, operator: {iataCode: string, operatorType: string}]}}
     */
    getSegment(segmentId){
        let segment = update(this.itineraries.segments[segmentId],{segmentId:{$set:segmentId}}); //enrich returned object with segmentId
        return segment;
    }

    /**
     * Return array of itinerary IDs that are associated with a given offer
     * @param offerId
     * @returns {[]}
     * @private
     */
    _getOfferItinerariesIds(offerId){
        let offer = this.getOffer(offerId);
        let pricePlansReferences = offer.pricePlansReferences;
        let offerItinIds = [];
        Object.keys(pricePlansReferences).map(pricePlanId=> {
            let pricePlan = pricePlansReferences[pricePlanId];
            let flights = pricePlan.flights;
            offerItinIds=[...offerItinIds,...flights];
        })
        return offerItinIds;
    }

    /**
     * Find all available alternative offers for a given offer
     * @param offerId
     * @returns {[]}
     */
    findAlternativeOffers(offerId){
        let itinerariesIds = this._getOfferItinerariesIds(offerId);
        itinerariesIds.sort();  //sort IDs so that it's easy to compare this array with array of offerIDs in the next loop

        let offers = this.offers;
        let matchingOffers = [];
        Object.keys(offers).map(candidateOfferId=>{
            let offerItineraryIDs = this._getOfferItinerariesIds(candidateOfferId);
            offerItineraryIDs.sort();
            if(JSON.stringify(itinerariesIds) === JSON.stringify(offerItineraryIDs))
                matchingOffers.push(this.getOffer(candidateOfferId));
        })
        return matchingOffers;
    }


    /**
     * For a given offer, find all available price plans and it's prices and generate a list of then with associated itineraryId
     * @param offerId
     * @returns {
     *     pricePlans - all priceplans that are available for this offer are in this array
     *     itineraries - itineraries associated with this offer
     *     offers{} - list of all alternate offers associated with offerId (passed as parameter), key is offerId, value is defined as
     *      {
     *          price: offer price,
     *          offerId: offer ID,
     *          itinToPlanMap: mapping between pricePlanID and itineraryID
     *          planToItinMap: mapping between itineraryID and pricePlanID
     *      }
     * ]}
     */
    generateTripRatesData(offerId){
        let alternativeOffers=this.findAlternativeOffers(offerId);
        let results={
            pricePlans:{},
            itineraries:this.getOfferItineraries(offerId),
            offers:{}
        };
        let pricePlans={};

        alternativeOffers.forEach(offer=>{
            let offerDetails={
                price:offer.price,
                offerId:offer.offerId,
                itinToPlanMap:{},
                planToItinMap:{}
            }
            Object.keys(offer.pricePlansReferences).map(pricePlanId=>{
                results.pricePlans[pricePlanId] = this.getPricePlan(pricePlanId);

                let pricePlan=offer.pricePlansReferences[pricePlanId];
                pricePlan.flights.forEach(itinId=>{
                    offerDetails.itinToPlanMap[itinId]=pricePlanId;
                    offerDetails.planToItinMap[pricePlanId]=itinId;
                })
            });
            results.offers[offer.offerId]=offerDetails;
        })
        return results;
    }

    generateSearchResults(sortBy = 'PRICE'){
        let trips={};
        Object.keys(this.offers).forEach(offerId=>{
            let offer = this.getOffer(offerId);
            let itineraries = this.getOfferItineraries(offerId);
            let totalItinDuration=0;
            itineraries.map(itinerary=>totalItinDuration+=itinerary.metadata.itinerary_duration)
            let price=offer.price.public;
            let tripID = this.generateTripID(itineraries)
            let tripInfo = trips[tripID] || {
                minPrice:Number.MAX_SAFE_INTEGER,
                trip_duration:totalItinDuration,
                tripId:tripID,

            }
            if(price<tripInfo.minPrice){
                tripInfo.minPrice=price;
                tripInfo.offerId=offerId;
            }
            if(!trips[tripID])
                trips[tripID]=tripInfo;
        })

        const priceComparator = (trip1,trip2) =>{
            if(trip1.minPrice < trip2.minPrice)
                return -1;
            else if(trip1.minPrice > trip2.minPrice)
                return 1;
            else return 0;
        }

        const durationComparator = (trip1,trip2) =>{
            if(trip1.trip_duration < trip2.trip_duration)
                return -1;
            else if(trip1.trip_duration > trip2.trip_duration)
                return 1;
            else return 0;
        }

        let tripArray=[]
        Object.keys(trips).forEach(tripId=>tripArray.push(trips[tripId]));

        console.log("before",JSON.stringify(tripArray))
        if(sortBy === 'PRICE') {
            console.log("Sort by price")
            tripArray.sort(priceComparator)
        }
        else {
            console.log("Sort by duration")
            tripArray.sort(durationComparator);
        }
        return tripArray;
    }

    generateTripID(itineraries){
        let itinIDs=itineraries.map(itinerary=>itinerary.itinId);
        let tripID = itinIDs.join(',');
        return tripID;
    }
}

