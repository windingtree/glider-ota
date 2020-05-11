import {parseISO,differenceInHours,differenceInMinutes} from "date-fns";
import airportToCityMap from "../data/airport-city-map";

export default class OfferUtils {
  static calculateDuration (itinerary) {
    const firstSegment = OfferUtils.getFirstSegmentOfItinerary(itinerary);
    const lastSegment = OfferUtils.getLastSegmentOfItinerary(itinerary);
    const startOfTrip = parseISO(firstSegment.departureTime);
    const endOfTrip = parseISO(lastSegment.arrivalTime);

    const hrs = differenceInHours(endOfTrip, startOfTrip);
    const mins = differenceInMinutes(endOfTrip, startOfTrip) - hrs * 60;
    let durationString = '';
    if (hrs > 0) { durationString += hrs + 'h ' }
    if (mins > 0) { durationString += mins + 'm' }
    return durationString
  }
  static calculateDurationInMins (itinerary) {
    const firstSegment = OfferUtils.getFirstSegmentOfItinerary(itinerary);
    const lastSegment = OfferUtils.getLastSegmentOfItinerary(itinerary);
    const startOfTrip = parseISO(firstSegment.departureTime);
    const endOfTrip = parseISO(lastSegment.arrivalTime);
    const mins = differenceInMinutes(endOfTrip, startOfTrip);
    return mins;
  }

  static getOutboundItinerary (combination) {
    return combination.itinerary[0];
  }
  static doesReturnItineraryExist(combination){
    return combination.itinerary.length>1;
  }
  static getReturnItinerary (combination) {
    //FIXME - what if there are more than two?
    return OfferUtils.doesReturnItineraryExist(combination)===true?combination.itinerary[1]:undefined;
  }

  static getFirstSegmentOfItinerary (itinerary) {
    return itinerary.segments[0];
  }

  static  getLastSegmentOfItinerary (itinerary) {
    return itinerary.segments[itinerary.segments.length - 1];
  }

  static getItineraryDepartureDate(itinerary){
    return parseISO(OfferUtils.getFirstSegmentOfItinerary(itinerary).departureTime);
  }

  static getItineraryArrivalDate(itinerary){
    return parseISO(OfferUtils.getLastSegmentOfItinerary(itinerary).arrivalTime);
  }

  static getItinerarySegments(itinerary){
    return itinerary.segments;
  }

  static calculateNumberOfStops (itinerary) {
    let segCount = OfferUtils.getItinerarySegments(itinerary).length;
    return segCount>0?segCount-1:0;
  }

  /**
   * Returns a list of operating carriers for a given itinerary.
   * If there are multiple operators, only unique operators will be returned (same carrier will not be repeated)
   *
   * @param list of records, example record:
   * {
   *     operatorType:"airline"
   *     iataCode:"AF"
   * }
   */
  static getItineraryOperatingCarriers(itinerary){
    let segments = OfferUtils.getItinerarySegments(itinerary);
    let operators = {};
    if(segments){
      for(let i=0;i<segments.length;i++){
        let operator = segments[i].operator;
        operators[operator.iataCode]=operator;
      }
    }
    return operators;
  }

  static getCheapestOffer(combination){
    let offers=combination.offers;
    offers.sort((a,b)=>{
      return (a.offer.price.public>b.offer.price.public)?1:-1;
    })
    return offers[0]
  }

  static getCityNameByAirportCode(airportCode){
    //TODO-retrieve city name
    return airportCode;
  }

  static getItineraryOperatingCarrier(itinerary){
    let segment = OfferUtils.getFirstSegmentOfItinerary(itinerary);

    return {
      iataCode:segment.operator.iataCode,
      airlineName:segment.operator.iataCode,
      flight:segment.operator.iataCode+'-123'
    }
  }
  static getItineraryDepartureCityName(itinerary){
    let firstSegment=OfferUtils.getFirstSegmentOfItinerary(itinerary);
    return iataToCityName(firstSegment.origin.iataCode);
  }
  static getItineraryArrivalCityName(itinerary){
    let lastSegment=OfferUtils.getFirstSegmentOfItinerary(itinerary);
    return iataToCityName(lastSegment.destination.iataCode);
  }
  static getItineraryDepartureAirportName(itinerary){
    let firstSegment=OfferUtils.getFirstSegmentOfItinerary(itinerary);
    return iataToAirportName(firstSegment.origin.iataCode);
  }
  static getItineraryArrivalAirportName(itinerary){
    let lastSegment=OfferUtils.getFirstSegmentOfItinerary(itinerary);
    return iataToAirportName(lastSegment.destination.iataCode);
  }
  static getItineraryDepartureAirportCode(itinerary){
    let firstSegment=OfferUtils.getLastSegmentOfItinerary(itinerary);
    return firstSegment.origin.iataCode;
  }
  static getItineraryArrivalAirportCode(itinerary){
    let lastSegment=OfferUtils.getLastSegmentOfItinerary(itinerary);
    return lastSegment.destination.iataCode;
  }

//TODO - replace with correct body
  static getItineraryPricePlan(itinerary) {
    return {
      "name": "Economy",
      "amenities": [],
      "checkedBaggages": {
        "quantity": Math.floor(Math.random() * (+2 - +0)) + +0
      },
      "pricePlanId": "PC1"
    }
  }

}


export function iataToCityName(iata){
  let rec=airportToCityMap[iata];
  if(rec){
    return rec.city;
  }else{
    return "["+iata+"]";
  }
}
export function iataToAirportName(iata){
  let rec=airportToCityMap[iata];
  if(rec){
    return rec.airport;
  }else{
    return "["+iata+"]";
  }
}

export const expandSearchResult = (criteria, searchResults) => {
  // Check if we have a roundtrip flight Search
  let offers = searchResults.offers;
  //console.log('criteria >> ', criteria);
  
  if(criteria.returnDate !== undefined) {
    // Prepare to split inbound and outbound offers
    const orgIata = criteria.origin.code;
    
    let inboundOffers = [];
    let outboundOffers = [];

    // Go through each offer
    Object.keys(offers).forEach(offerId => {
      // Extract the price plans
      const pricePlans = Object.keys(offers[offerId].pricePlansReferences);

      // If there is only one price plan with one flight, it is a one-way offer
      if(pricePlans.length === 1 && 
        offers[offerId].pricePlansReferences[pricePlans[0]].flights.length === 1) {
          const flightKey = offers[offerId].pricePlansReferences[pricePlans[0]].flights[0];
          const segmentKeys = searchResults.itineraries.combinations[flightKey];

          // Add offer to outbound or inbound arrays
          if(searchResults.itineraries.segments[segmentKeys[0]].origin.iataCode === orgIata) {
            outboundOffers.push(offerId);
          } else {
            inboundOffers.push(offerId);
          }
          
      }
    });

    // Create new combinations using the outbound and inboud
    inboundOffers.forEach(inboundOfferId => {
      outboundOffers.forEach(outboundOfferId => {
        const offerKey = `${outboundOfferId},${inboundOfferId}`;
        const inboundOffer = offers[inboundOfferId];
        const outboundOffer = offers[outboundOfferId];
        //console.log('Merging offers: ', JSON.stringify(inboundOffer), JSON.stringify(outboundOffer)); 
        offers[offerKey] = {
          offerItems: {
            ...inboundOffer.offerItems,
            ...outboundOffer.offerItems,
          },
          expiration: Date(inboundOffer.expiration) < Date(outboundOffer.expiration) ? inboundOffer.expiration : outboundOffer.expiration,
          pricePlansReferences: {
            ...inboundOffer.pricePlansReferences,
            ...outboundOffer.pricePlansReferences,
          },
          price: {
            currency: inboundOffer.price.currency,
            public: Number(Number(inboundOffer.price.public)+Number(outboundOffer.price.public)).toFixed(2),
            taxes: Number(Number(inboundOffer.price.taxes)+Number(outboundOffer.price.taxes)).toFixed(2),
          }
        }
      });
    });

    // Remove duplicated keys
    [...inboundOffers,  ...outboundOffers].forEach(offerId => {
      delete(offers[offerId]);
    });

    searchResults.offers = offers;
  }
  return searchResults;
};
