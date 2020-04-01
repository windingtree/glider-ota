import {parseISO,differenceInHours,differenceInMinutes} from "date-fns";


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
    //TODO
    return {
      airlineCode:'VL',
      airlineName:'Vueling',
      flight:'VL-123'
    }
  }
  static getItineraryDepartureCityName(itinerary){
    let firstSegment=OfferUtils.getFirstSegmentOfItinerary(itinerary);
    //TODO replace with cityname
    return firstSegment.origin.iataCode;
  }
  static getItineraryArrivalCityName(itinerary){
    let lastSegment=OfferUtils.getFirstSegmentOfItinerary(itinerary);
    //TODO replace with cityname
    return lastSegment.destination.iataCode;
  }
  static getItineraryDepartureAirportName(itinerary){
    let firstSegment=OfferUtils.getFirstSegmentOfItinerary(itinerary);
    //TODO replace with full airport/station name
    return firstSegment.origin.iataCode;
  }
  static getItineraryArrivalAirportName(itinerary){
    let lastSegment=OfferUtils.getFirstSegmentOfItinerary(itinerary);
    //TODO replace with full airport/station name
    return lastSegment.destination.iataCode;
  }
  static getItineraryDepartureAirportCode(itinerary){
    let firstSegment=OfferUtils.getFirstSegmentOfItinerary(itinerary);
    return firstSegment.origin.iataCode;
  }
  static getItineraryArrivalAirportCode(itinerary){
    let lastSegment=OfferUtils.getFirstSegmentOfItinerary(itinerary);
    return lastSegment.destination.iataCode;
  }
}
