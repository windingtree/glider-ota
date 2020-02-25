

class FlightSearchResultsConverter {
    constructor(results) {
        this.results = results;
    }


    //just for testing
    findOfferById(offerReference) {
        return this.results.offers[offerReference]
    }


    transformResults() {
        const simplifiedResults = [];
        console.log('This results',this.results.offers);
        //return empty array if there is no results
        if (!('offers' in this.results)) {
            return simplifiedResults;
        }
        for (const offerId in this.results.offers)
            simplifiedResults.push(this.transformSingleOffer(offerId));
        return simplifiedResults
    }


    transformSingleOffer(offerId) {
        let offer = this.results.offers[offerId];
        const record = {
            offerId: offerId,
            expiration: offer.expiration,//copy expiry
            price: offer.price,//copy price as is
            pricePlans: this.expandPricePlanReferences(offer.pricePlansReferences)
        };
        return record
    }

    /**
     *
     *
     "pricePlansReferences": {
        "PC2": {
          "flights": [
            "FL1"
          ]
        },
        "PC13": {
          "flights": [
            "FL2"
          ]
        }
      },
     */
    expandPricePlanReferences(pricePlanReferences) {
        let pricePlansConvertedExpanded = [];
        for (const pricePlanReferenceId of Object.keys(pricePlanReferences)) {
            const pricePlanReference = pricePlanReferences[pricePlanReferenceId];
            let pricePlanExpanded = this.expandPricePlanReference(pricePlanReferenceId);
            let itineraries = this.expandItineraries(pricePlanReference.flights);
            pricePlanExpanded.flights = itineraries;
            pricePlansConvertedExpanded.push(pricePlanExpanded)
        }
        return pricePlansConvertedExpanded;
    }

    /**
     "PC2": {
          "flights": [
            "FL1"
          ]
        },
     *
     */

    expandPricePlanReference(pricePlanReferenceId) {
        const pricePlan = this.results.pricePlans[pricePlanReferenceId];
        let pricePlanRecord = {
            ...pricePlan, ...{
                pricePlanReference: pricePlanReferenceId
            }
        };
        return pricePlanRecord;
    }

    expandItineraries(itineraries) {
        let flightsExpanded = [];
        for (let itinIdx in itineraries) {
            let itineraryRef = itineraries[itinIdx];
            let itinerarySegments = this.results.itineraries.combinations[itineraryRef];
            let itinerarySegmentsExpanded = [];
            for (let i in itinerarySegments) {
                let segmentId = itinerarySegments[i];
                let segment=this.results.itineraries.segments[segmentId];
                segment.segmentRef=segmentId;//copy ref
                flightsExpanded.push(segment)
            }
            // flightsExpanded.push(itinerarySegmentsExpanded)
        }
        return flightsExpanded;
    }


}


module.exports = FlightSearchResultsConverter;