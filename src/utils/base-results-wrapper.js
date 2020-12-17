import update from 'immutability-helper';


/**
 * Base class for operations on search results.
 * Flight and Hotel specific methods are implemented in subclasses.
 */
export class BaseSearchResultsWrapper {
    constructor(searchResults) {
        this.offers = searchResults.offers;
        this.pricePlans = searchResults.pricePlans;
    }


    /**
     * Get a list with all unique offers from search results.
     */
    getAllOffers(){
        let offers={};
        Object.keys(this.offers || {}).forEach(offerId=>{
            offers[offerId] = this.getOffer(offerId);
        });
        return offers;
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
            console.warn(`SearchResultsWrapper - requested offer was not found!`,offerId)
            return null;
        }
        offer = update(offer,{offerId:{$set:offerId}});  //enrich returned object with "offerId" property
        return offer;
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
        Object.keys(pricePlansReferences).forEach(pricePlanId=> {
            pricePlans.push(this.getPricePlan(pricePlanId));
        })
        return pricePlans;
    }

    getPricePlan(pricePlanId){
        let pricePlan = update(this.pricePlans[pricePlanId],{pricePlanId:{$set:pricePlanId}});  //enrich returned object with "pricePlanId" property
        return pricePlan;
    }



}

