import OfferUtils from "./offer-utils";
import {FlightSearchResultsWrapper} from "./flight-search-results-wrapper";
import {FILTERS} from "../components/filters/filters-utils";



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
        console.debug(`Filter stats: total offers count:${Object.keys(offers).length}`);

        //apply "offer level" filters (e.g. price range or baggage allowance to limit the amount of offers to process in next steps
        offers = this.applyOfferFilters(offers,filters);
        console.debug(`Filter stats: offers count after offer level filters:${Object.keys(offers).length}`);

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
        console.debug(`Filter stats: trip count before trip level filters:${tripArray.length}`);
        tripArray = this.applyTripFilters(tripArray,filters);
        console.debug(`Filter stats: trip count after trip level filters:${tripArray.length}`);
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
            console.debug('Sorting by price')
            trips.sort(priceComparator)
        }
        else {
            console.debug('Sorting by duration')
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

    checkLayoverDurationFilter(filterState, itineraries) {
        const {min, max} = filterState;
        let result = true;
        let layovers = [];
        itineraries.map(itinerary => {
            let segments = itinerary.segments;
            let prevSegment = null;
            //if it's a direct flight - add 0 so that we can also filter out direct flights if min range is specified
            if (segments.length == 1)
                layovers.push(0);
            segments.map(segment => {
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
        let result = true;
        if (filterState['ALL'] && filterState['ALL'] === true)
            return true;

        itineraries.forEach(itinerary=>{
            let stops = itinerary.segments.length - 1;
            if (!filterState[stops] || filterState[stops] === false)
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
        pricePlans.map(pricePlan => {
            let bagsAllowance=0;
            if(pricePlan.checkedBaggages && pricePlan.checkedBaggages.quantity)
                bagsAllowance=pricePlan.checkedBaggages.quantity;
            result = result && (filter[bagsAllowance]===true);
        })
        return result;
    }

}





