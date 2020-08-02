import update from 'immutability-helper';

/**
 * @module utils/base-results-wrapper

 */

/**
 * Base class for operations on search results which simplifies operations/logic related to search results returned by Glider OTA backend.
 * <br/>Since flight and hotel search results are having different structure, there are two subclasses of BaseSearchResultsWrapper:
 * <ul>
 *     <li>FlightSearchResultsWrapper - wrapper for flight search results</li>
 *     <li>HotelSearchResultsWrapper - wrapper for hotel search results</li>
 * </ul>
 */
export class BaseSearchResultsWrapper {
    constructor(searchResults) {
        this.offers = searchResults.offers;
        this.pricePlans = searchResults.pricePlans;
    }

    /**
     * Get a list with all unique offers from search results.
     * @returns {Object} All offers retrieved from the backend enriched with offerId added to each offer
     */
    getAllOffers(){
        let offers={};
        Object.keys(this.offers).forEach(offerId=>{
            offers[offerId] = this.getOffer(offerId);
        });
        return offers;
    }

    /**
     * Returns offer details for an offerID provided as a parameter
     * <br/>Returned object is a deep copy of a corresponding record from search results.
     * <br/>Returned object is enriched with offerId
     * @param {string} offerId
     * @returns {Object} Requested offer
     */
    getOffer(offerId){
        let offer = this.offers[offerId];
        if(!offer) {
            console.warn(`SearchResultsWrapper - requested offer was not found!`,offerId)
            return null;
        }
        offer = update(offer,{offerId:{$set:offerId}});  //enrich returned object with "offerId" property
        return offer;
    }


    /**
     * Return array containing price plans that belong to a given offerId
     * <br/>Returned object is a deep copy of a corresponding record from search results
     * @param offerId
     * @returns
     */
    getOfferPricePlans(offerId){
        let offer = this.getOffer(offerId);
        let pricePlans=[];
        let pricePlansReferences = offer.pricePlansReferences;
        Object.keys(pricePlansReferences).map(pricePlanId=> {
            pricePlans.push(this.getPricePlan(pricePlanId));
        })
        return pricePlans;
    }

    getPricePlan(pricePlanId){
        let pricePlan = update(this.pricePlans[pricePlanId],{pricePlanId:{$set:pricePlanId}});  //enrich returned object with "pricePlanId" property
        return pricePlan;
    }
}

