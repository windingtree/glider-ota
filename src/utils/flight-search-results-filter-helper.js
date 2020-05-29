import OfferUtils from "./offer-utils";
import {FlightSearchResultsWrapper} from "./flight-search-results-wrapper";

export class FlightSearchResultsFilterHelper {
    constructor(searchResults){
        this.searchResultsWrapper = new FlightSearchResultsWrapper(searchResults);
    }

    /**
     * Generate a list of offers (search results).
     * Each item in the list contains metadata (e.g. trip duration, operating carriers, baggage allowance) so that it can be used later to narrow down/filter search results.
     * @param sortBy
     * @returns {[]}
     */
    generateSearchResults(sortBy = 'PRICE', predicates=[]){
        let trips={};
        //extract all available offers
        let allOffers=this.searchResultsWrapper.getAllOffers();
        let beforeOfferPredicates=Object.keys(allOffers).length;

        //filter out offers based on "offer level" criteria  (and not a flight), for example price conditions (min & max price) is an "offer level" criteria, whereas e.g. "flight duration" is a trip level criteria
        allOffers = this.applyOfferPredicates(allOffers,predicates);

        let afterOfferPredicates=Object.keys(allOffers).length;

        //now iterate over each offer, calculate basic metadata (e.g. trip duration, number of stops, operating carriers) and later on apply "flight level" criteria (e.g. min & max flight duration or allowed operating carriers)
        Object.keys(allOffers).forEach(offerId=>{
            let offer = this.searchResultsWrapper.getOffer(offerId);
            let offerItineraries = this.searchResultsWrapper.getOfferItineraries(offerId);
            //ensure filter metadata (e.g. itinerary duration, operating carriers, etc...) is calculated for each itin
            offerItineraries.map(itinerary=>{
                if(!itinerary.filter_metadata)
                    this.decorateItineraryWithFilterMetadata(itinerary)
            });

            let price=offer.price;
            let tripID = this.generateTripID(offerItineraries);
            //check if we found an offer for existing trip which is cheaper than previous one
            let tripInfo = trips[tripID];
            if(!tripInfo) {
                tripInfo={
                    tripId:tripID,
                    offerId: undefined,
                    bestoffer:undefined
                }
                trips[tripID]=tripInfo;
            }
            let prevOffer = tripInfo.bestoffer;
            if (prevOffer === undefined || price.public < prevOffer.price.public) {
                //in case it's cheaper - store it (entire offer)
                tripInfo.bestoffer = offer;
                tripInfo.itineraries = offerItineraries;
            }
        })
        let tripArray=[];
        Object.keys(trips).forEach(tripId=>tripArray.push(trips[tripId]));
        let beforeTripPredicates=tripArray.length;
        tripArray = this.applyTripPredicates(tripArray,predicates);
        tripArray = this.sortTrips(tripArray, sortBy);
        console.debug(`Filter stats: total results:${beforeOfferPredicates}, after offer level filters:${afterOfferPredicates}, before trip level filters:${beforeTripPredicates}, results after all filters:${tripArray.length}`);

        return tripArray;
    }

    sortTrips(trips,sortBy){
        const priceComparator = (trip1,trip2) =>{
        let price1 = trip1.bestoffer.price;
        let price2 = trip2.bestoffer.price;
        if (price1.public < price2.public)
            return -1;
        else if (price1.public > price2.public)
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
        if(sortBy === 'PRICE') {
            trips.sort(priceComparator)
        }
        else {
            trips.sort(durationComparator);
        }
        return trips;
    }

    generateTripID(itineraries){
        let itinIDs=itineraries.map(itinerary=>itinerary.itinId);
        let tripID = itinIDs.join(',');
        return tripID;
    }

    decorateItineraryWithFilterMetadata(itinerary){
        //calculate trip duration in mins
        let itineraryDurationInMins = OfferUtils.calculateDurationInMins(itinerary);
        //get all operating carrier codes
        let carriers={}
        itinerary.segments.forEach(segment=>carriers[segment.operator.iataCode]=segment.operator.iataCode);

        let metadata={
            itinerary_duration:itineraryDurationInMins,
            stops:itinerary.segments.length-1,
            operating_carriers:carriers
        }
        itinerary['filter_metadata']=metadata;
        return itinerary;
    }

    applyOfferPredicates(offers, predicates) {
        let result={};
        Object.keys(offers).map(offerId=>{
            let offer=offers[offerId];
            let checkResult = true;
            predicates.map(predicate=>{
                if(predicate.type==='offer')
                    checkResult=result && predicate.predicate(offer);
            })
            if(checkResult)
                result[offerId]=(offer);
        })
        return result;
    }
    applyTripPredicates(trips, predicates) {
        let result=[];
        trips.map(tripInfo=>{
            let itineraries = tripInfo.itineraries;

            let checkResult = true;
            predicates.map(predicate=>{
                if(predicate.type==='trip')
                    checkResult=result && predicate.predicate(itineraries);
            })
            if(checkResult)
                result.push(tripInfo);
        })
        return result;
    }

}




export function createAirlinePredicate(airlines){

    const predicate = (itineraries) => {
        let result = true;
        if(airlines['ALL'] && airlines['ALL']===true)
            return true;
        itineraries.map(itinerary=>{
            itinerary.segments.map(segment=>{
                let carrierCode = segment.operator.iataCode;
                if(!airlines[carrierCode] || airlines[carrierCode] === false)
                    result = false;
            })
        })
        return result;
    }
    return predicate;
}


export function createPricePredicate(priceRange){
    const {min, max} = priceRange;

    const predicate = (offer) => {
        let result = true;
        if(min)
            result = result && min<=offer.price.public;
        if(max)
            result = result && offer.price.public<=max;
        return result;
    }
    return predicate;
}


export function createMaxStopsPredicate(stopsCriteria){

    const predicate = (itineraries) => {
        let result = true;
        if(stopsCriteria['ALL'] && stopsCriteria['ALL']===true)
            return true;
        itineraries.map(itinerary=>{
            let stops = itinerary.segments.length-1;
            if(!stopsCriteria[stops] || stopsCriteria[stops]===false)
                result = false;
        })
        return result;
    }
    return predicate;
}

export function createBagsPredicate(bagsCriteria){

    const predicate = (offer) => {
        let result = true;
        if(bagsCriteria['ALL'] && bagsCriteria['ALL']===true)
            return true;
        //TODO
        return result;
    }
    return predicate;
}


export function createLayoverDurationPredicate(layoverDurationRange){
    const {min, max} = layoverDurationRange;

    const predicate = (itineraries) => {
        let result = true;
        let layovers=[];
        itineraries.map(itinerary=>{
            let segments = itinerary.segments;
            let prevSegment = null;
            //if it's a direct flight - add 0 so that we can also filter out direct flights if min range is specified
            if(segments.length==1)
                layovers.push(0);
            segments.map(segment=>{
                if(prevSegment!=null){
                    layovers.push(OfferUtils.calculateLayoverDurationInMinutes(prevSegment,segment));
                }
                prevSegment=segment;
            })
        })

        for(let i=0;i<layovers.length;i++){
            let duration = layovers[i];
            if(min)
                result = result && min<=duration;
            if(max)
                result = result && duration<=max;
        }
        return result;
    }
    return predicate;
}
