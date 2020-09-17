
export default class AncillaryUtils {
  static getPricePLan (searchResults, pricePlanId) {
    return searchResults.pricePlans[pricePlanId];
  }

  static getItineraryPricePlanId(itinerary,offer){
    let itinId = itinerary.itinId;
    let flightPricePlan = offer.flightCombination.find(rec=>rec.flight === itinId);
    let pricePlanId = undefined;

    if (flightPricePlan !== undefined) {
      pricePlanId = flightPricePlan.pricePlan;
    }
    return pricePlanId;
  }

}


