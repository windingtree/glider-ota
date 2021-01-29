
import {parseISO, differenceInHours, differenceInMinutes, differenceInBusinessDays, format} from "date-fns";
import airportToCityMap from "../components/storybook-utils/mock-data/airport-city-map";


export default class OfferUtils {
  static calculateDuration (itinerary) {
    const firstSegment = OfferUtils.getFirstSegmentOfItinerary(itinerary);
    const lastSegment = OfferUtils.getLastSegmentOfItinerary(itinerary);
    const startOfTrip = parseISO(firstSegment.departureTimeUtc);
    const endOfTrip = parseISO(lastSegment.arrivalTimeUtc);

    const hrs = differenceInHours(endOfTrip, startOfTrip);
    const mins = differenceInMinutes(endOfTrip, startOfTrip) - hrs * 60;
    let durationString = '';
    if (hrs > 0) { durationString += hrs + 'h ' }
    if (mins > 0) { durationString += mins + 'm' }
    return durationString
  }
  static calculateDurationInMins (itinerary) {
    // console.log('=====', itinerary);
    const firstSegment = OfferUtils.getFirstSegmentOfItinerary(itinerary);
    const lastSegment = OfferUtils.getLastSegmentOfItinerary(itinerary);
    const startOfTrip = parseISO(firstSegment.departureTimeUtc);
    const endOfTrip = parseISO(lastSegment.arrivalTimeUtc);
    const mins = differenceInMinutes(endOfTrip, startOfTrip);
    return mins;
  }

  static calculateLayoverDurationInMinutes (prevSegment, nextSegment) {
    const arrival = parseISO(prevSegment.arrivalTimeUtc);
    const departure = parseISO(nextSegment.departureTimeUtc);
    return  differenceInMinutes(departure, arrival);
  }
  static calculateStayBetweenTripsInBusinessDays (outboundItinerary, returnItinerary) {
    let arrivalToDestination = OfferUtils.getItineraryArrivalDate(outboundItinerary)
    let departureFromDestination = OfferUtils.getItineraryDepartureDate(returnItinerary)

    return differenceInBusinessDays(departureFromDestination,arrivalToDestination)
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
    let lastSegment=OfferUtils.getLastSegmentOfItinerary(itinerary);
    return iataToCityName(lastSegment.destination.iataCode);
  }
  static getItineraryDepartureAirportName(itinerary){
    let firstSegment=OfferUtils.getFirstSegmentOfItinerary(itinerary);
    return iataToAirportName(firstSegment.origin.iataCode);
  }
  static getItineraryArrivalAirportName(itinerary){
    let lastSegment=OfferUtils.getLastSegmentOfItinerary(itinerary);
    return iataToAirportName(lastSegment.destination.iataCode);
  }
  static getItineraryDepartureAirportCode(itinerary){
    let firstSegment=OfferUtils.getFirstSegmentOfItinerary(itinerary);
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





/**
 * Format date (param) to a string using specified format.
 *
 * @param date Date object or string (if it's string - function will try to parse date)
 * @param formatString
 * @returns {string}
 */
export function safeDateFormat(date, formatString) {
  let result = '';
  try{
    let dateObj = date;
    if(typeof date === 'string'){
      dateObj=parseISO(date);
    }
    result = format(dateObj, formatString);
  }catch(err){
    console.warn()
  }
  return result;
}

/**
 * Convert date from str to Date (or do nothing if it's already date)
 * @param date
 * @returns {Date|*}
 */
export function ensureDateObj(date) {
  if(typeof date === 'string'){
    return parseISO(date);
  }
  return date;

}

export function isSameDay(date1, date2) {
  let d1=ensureDateObj(date1);
  let d2=ensureDateObj(date2);
}
