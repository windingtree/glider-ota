import update from 'immutability-helper';
import {BaseSearchResultsWrapper} from "./base-results-wrapper";

/**
 * @module utils/flight-search-results-wrapper
 */

/**
 * Subclass of BaseSearchResultsWrapper.
 * <br/>Wrapper class that offers helper methods to process flight results operations
 */
export class FlightSearchResultsWrapper extends BaseSearchResultsWrapper{
    constructor(searchResults) {
        super(searchResults)
        this.itineraries = searchResults.itineraries;
    }

    /**
     * Get a list with all unique itineraries from search results .
     * Each itinerary is enriched with itinId and list of segments that build a given itinerary.
     *
     * @returns [itinId=>{
     *     segments:[]
     * }]
     */
    getAllItineraries(){
        let itins={};
        Object.keys(this.itineraries.combinations).forEach(itinId=>{
            itins[itinId] = this.getItinerary(itinId);
        });
        return itins;
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
        this.sortItinerariesInDepartureTimeAscendingOrder(itineraries);
        return itineraries;
    }


    sortItinerariesInDepartureTimeAscendingOrder(itineraries){
        const firstSegDptrDateComparator = (itin1, itin2) => {
            if(itin1.segments[0].departureTime < itin2.segments[0].departureTime)
                return -1;
            else return 1;
        }

        itineraries.sort(firstSegDptrDateComparator);
        return itineraries;
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
        try {
            segmentIds.forEach(segmentId => {
                segments.push(this.getSegment(segmentId));
            })
        } catch(err){
            console.error("Error:, itinID", itinId, "segmentIds:",segmentIds)

        }
        let itinerary = {
            itinId:itinId,    //enrich returned object with "itinId" property
            segments:segments
        }
        // decorateItineraryWithMetadata(itinerary);
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
        Object.keys(pricePlansReferences).forEach(pricePlanId=> {
            let pricePlan = pricePlansReferences[pricePlanId];
            let flights = pricePlan.flights;
            offerItinIds=[...offerItinIds,...flights];
        });
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
        Object.keys(offers).forEach(candidateOfferId=>{
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

        alternativeOffers.forEach(offer=>{
            let offerDetails={
                price:offer.price,
                offerId:offer.offerId,
                itinToPlanMap:{},
                planToItinMap:{}
            };
            Object.keys(offer.pricePlansReferences).forEach(pricePlanId=>{
                results.pricePlans[pricePlanId] = this.getPricePlan(pricePlanId);

                let pricePlan=offer.pricePlansReferences[pricePlanId];
                pricePlan.flights.forEach(itinId=>{
                    offerDetails.itinToPlanMap[itinId]=pricePlanId;
                    offerDetails.planToItinMap[pricePlanId]=itinId;
                });
            });
            results.offers[offer.offerId]=offerDetails;
        });
        return results;
    }


}

