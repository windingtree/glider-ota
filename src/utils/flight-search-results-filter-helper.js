import OfferUtils from "./offer-utils";
import {FlightSearchResultsWrapper} from "./flight-search-results-wrapper";
import {FILTERS} from "../components/filters/filters-utils";


/**
 * Helper class to process unfiltered search results and return only offers that pass filter criteria selected by the user
 */
export class FlightSearchResultsFilterHelper {
    constructor(searchResults){
        this.searchResultsWrapper = new FlightSearchResultsWrapper(searchResults);
    }

    /**
     * Generate a list of offers (search results).
     * Each item in the list contains metadata (e.g. trip duration, operating carriers, baggage allowance) so that it can be used later to narrow down/filter search results.
     * @param sortBy (PRICE or DURATION)
     * @param filters Object containing filters selection
     * @returns {[]}
     */
    generateSearchResults(sortBy = 'PRICE', filters={}){
        let trips={};
        //extract all available offers from search results
        let offers=this.searchResultsWrapper.getAllOffers();

        //apply "offer level" filters (e.g. price range or baggage allowance to limit the amount of offers to process in next steps
        offers = this.applyOfferFilters(offers,filters);
        // console.log('Offers:', offers);

        //now iterate over each offer,
        // calculate basic metadata (e.g. trip duration, number of stops, operating carriers)
        // and later on apply "flight level" criteria (e.g. min & max flight duration or allowed operating carriers)
        Object.keys(offers).forEach(offerId=>{

            let offer = this.searchResultsWrapper.getOffer(offerId);
            let offerItineraries = this.searchResultsWrapper.getOfferItineraries(offerId);
            //ensure filter metadata (e.g. itinerary duration, operating carriers, etc...) is calculated for each itin
            offerItineraries.forEach(itinerary=>{
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
            if (prevOffer === undefined || parseInt(price.public) < parseInt(prevOffer.price.public)) {
                //in case it's cheaper - store it (entire offer)
                tripInfo.bestoffer = offer;
                tripInfo.itineraries = offerItineraries;
                tripInfo.trip_duration=this.calculateTripDuration(offerItineraries);
            }

        })
        let tripArray=[];
        Object.keys(trips).forEach(tripId=>tripArray.push(trips[tripId]));
        tripArray = this.applyTripFilters(tripArray,filters);
        tripArray = this.sortTrips(tripArray, sortBy);
        return tripArray;
    }
    calculateTripDuration(itineraries){
        let duration=0;
        itineraries.forEach(itinerary=>{
            duration+=itinerary.filter_metadata.itinerary_duration;
        })
        return duration;
    }
    sortTrips(trips,sortBy){
        const priceComparator = (trip1,trip2) =>{
            let price1 = Number(trip1.bestoffer.price.public);
            let price2 = Number(trip2.bestoffer.price.public);
            if (price1 < price2)
                return -1;
            else if (price1 > price2)
                return 1;
            else return 0;
        }

        const durationComparator = (trip1,trip2) =>{
            let duration1=Number(trip1.trip_duration);
            let duration2=Number(trip2.trip_duration);
            if(duration1 < duration2)
                return -1;
            else if(duration1 > duration2)
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


    applyOfferFilters(offers, filters) {
        let result={};

        if(!filters)
            return offers;

        Object.keys(offers).forEach(offerId=>{
            let offer=offers[offerId];
            let checkResult = true;
            if(filters[FILTERS.BAGGAGE])
                checkResult = checkResult && (this.checkBaggageFilter(filters[FILTERS.BAGGAGE], offer) ===true);
            if(filters[FILTERS.PRICE])
                checkResult = checkResult && (this.checkPriceFilter(filters[FILTERS.PRICE],offer) === true);
            if(checkResult===true)
                result[offerId]=(offer);
        });
        return result;
    }

    /**
     * Apply "trip level" filters (e.g. airline name or max number of stops)
     * @param trips
     * @param filterStates
     * @returns {[]|*}
     */
    applyTripFilters(trips, filterStates) {
        let result=[];
        if(!filterStates)
            return trips;
        let checkResult = true;

        trips.forEach(tripInfo=>{
            let itineraries = tripInfo.itineraries;
            checkResult = true;
            if(filterStates[FILTERS.AIRLINES]) {
                checkResult = checkResult && (this.checkAirlineFilter(filterStates[FILTERS.AIRLINES], itineraries) === true);
            }
            if(filterStates[FILTERS.MAXSTOPS]) {
                checkResult = checkResult && (this.checkMaxStopsFilter(filterStates[FILTERS.MAXSTOPS], itineraries) === true);
            }
            // if(predicates[FILTERS.LAYOVERDURATION])
            //     checkResult = checkResult && (predicates[FILTERS.LAYOVERDURATION](itineraries)===true);

            if(checkResult)
                result.push(tripInfo);
        });
        return result;
    }

    /**
     * Check if a given itineraries(usually outbound and return) pass 'airline' filter
     * @param filter
     * @param itineraries
     * @returns {boolean}
     */
    checkAirlineFilter(filter, itineraries) {
        let result = true;
        if (filter['ALL'] && filter['ALL'] === true)
            return true;
        itineraries.forEach(itinerary=>{
            itinerary.segments.forEach(segment=>{
                let carrierCode = segment.operator.iataCode;
                if (!filter[carrierCode] || filter[carrierCode] === false)
                    result = false;
            });
        });
        return result;
    }

    /**
     * Check if a given itineraries(usually outbound and return) pass 'airline' filter (e.g. allowed carried = AC only)
     * @param filterState
     * @param itineraries
     * @returns {boolean}
     */
    checkLayoverDurationFilter(filterState, itineraries) {
        const {min, max} = filterState;
        let result = true;
        let layovers = [];
        itineraries.forEach(itinerary => {
            let segments = itinerary.segments;
            let prevSegment = null;
            //if it's a direct flight - add 0 so that we can also filter out direct flights if min range is specified
            if (segments.length === 1)
                layovers.push(0);
            segments.forEach(segment => {
                if (prevSegment != null) {
                    layovers.push(OfferUtils.calculateLayoverDurationInMinutes(prevSegment, segment));
                }
                prevSegment = segment;
            })
        })

        for (let i = 0; i < layovers.length; i++) {
            let duration = layovers[i];
            if (min)
                result = result && min <= duration;
            if (max)
                result = result && duration <= max;
        }
        return result;
    }

    checkMaxStopsFilter(filterState, itineraries) {
        if (filterState['ALL'] && filterState['ALL'] === true) {
            return true;
        }

        let maxStops = 0;
        Object.keys(filterState).forEach(key=>{
            if(filterState[key] === true && parseInt(key) > maxStops)
                maxStops = parseInt(key);
        })

        let result = true;
        itineraries.forEach(itinerary=>{
            let stops = itinerary.segments.length - 1;
            if (stops > maxStops)
                result = false;
        });

        return result;
    }

     checkPriceFilter(filter, offer) {
        const {min, max} = filter;
        let result = true;
        if (min)
            result = result && min <= offer.price.public;
        if (max)
            result = result && offer.price.public <= max;
        return result;
    }

    checkBaggageFilter(filter, offer) {
        if (filter['ALL'] && filter['ALL'] === true)
            return true;
        let result = true;
        let pricePlans=this.searchResultsWrapper.getOfferPricePlans(offer.offerId)
        pricePlans.forEach(pricePlan => {
            let bagsAllowance=0;
            if(pricePlan.checkedBaggages && pricePlan.checkedBaggages.quantity)
                bagsAllowance=pricePlan.checkedBaggages.quantity;
            result = result && (filter[bagsAllowance]===true);
        })
        return result;
    }

}





