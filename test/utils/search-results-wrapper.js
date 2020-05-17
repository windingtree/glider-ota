// const sample = require ('./sample_response')



class SearchResultsWrapper {
  constructor(searchResults) {
    this.results = searchResults;
    this.offers = searchResults.offers;
    this.itineraries = searchResults.itineraries;
    this.pricePlans = searchResults.pricePlans;
  }

  getOffer(offerId){
    return this.offers[offerId];
  }

  getItinerary(itineraryId){
    let segmentIds = this.itineraries.combinations[itineraryId];
    let segments=[];
    console.log("segmentIds:",segmentIds);
    console.log("Keys:",Object.keys(segmentIds));
    segmentIds.forEach(segmentId=>{
      let segment = this.getSegment(segmentId)
      segment.segmentId=segmentId;
      segments.push(segment);
    })
    let itinerary = {
      itineraryId:itineraryId,
      segments:segments
    }
    return itinerary;
  }

  getSegment(segmentId){
    return this.itineraries.segments[segmentId];
  }

  getItineraries(offerId){
    return this.offers[offerId];
  }

}


class OfferWrapper{
  constructor(offerId, offer) {
    this.offerId=offerId;
    this.offer=offer;
  }
  getItineraries(){

  }

}

module.exports={SearchResultsWrapper}
