
export default class FlightSearchResultsConverter {

  convertResponse (searchResults) {
    const simplifiedResults = [];
    //return empty array if there is no results
    if (!('offers' in searchResults)) {
      return simplifiedResults;
    }
    for (const key in searchResults.offers) {
      // noinspection JSUnfilteredForInLoop
      const record = this.transformSingleOffer(searchResults, searchResults.offers[key], key);
      simplifiedResults.push(record)
    }
    // let offer=this._findOffer(offers, offerID);
    // console.debug("Final JSON",record);
    return simplifiedResults
  }

  transformSingleOffer (offers, offer, offerId) {
    const serviceClass = offers.serviceClasses[offer.serviceClassReference];
    serviceClass.serviceClassReference = offer.serviceClassReference;
    const record = {
      offerId: offerId,
      expiration: offer.expiration,
      itineraries: [
        {
          itineraryReference: offer.itineraryCombinationReference,
          duration: '',
          segments: this.findItineraryCombination(offers, offer.itineraryCombinationReference)
        }
      ],
      serviceClass: serviceClass,
      price: offer.price
    };

    return record
  }

  findItineraryCombination (offers, itineraryCombinationReference) {
    const combinations = offers.itineraries[0].combinations;
    let segments = combinations.find(rec => itineraryCombinationReference in rec);
    segments = segments[itineraryCombinationReference].map(segmentId => {
      return offers.itineraries[0].segments[segmentId]
    });
    return segments
  }
}
