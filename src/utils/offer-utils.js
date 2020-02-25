import {parseISO,differenceInHours,differenceInMinutes} from "date-fns";




export default class OfferUtils {
  static calculateDuration (pricePlan) {
    const firstSegment = this.getFirstSegmentOfItinerary(pricePlan);
    const lastSegment = this.getLastSegmentOfItinerary(pricePlan);
    const startOfTrip = parseISO(firstSegment.departureTime);
    const endOfTrip = parseISO(lastSegment.arrivalTime);

    const hrs = differenceInHours(endOfTrip, startOfTrip);
    const mins = differenceInMinutes(endOfTrip, startOfTrip) - hrs * 60;
    console.log('Start:', startOfTrip, ' End:', endOfTrip, ', diff in hrs:', hrs, ', diff in mins:', mins);
    let durationString = '';
    if (hrs > 0) { durationString += hrs + 'h ' }
    if (mins > 0) { durationString += mins + 'm' }
    return durationString
  }


  static getOutboundItinerary (offer) {
    return offer.pricePlans[0]
  }
  static doesReturnItineraryExist(offer){
    return offer.pricePlans.length>1
  }
  static getReturnItinerary (offer) {
    //FIXME - what if there are more than two?
    return offer.pricePlans[1]
  }

  static getFirstSegmentOfItinerary (itinerary) {
    return itinerary.flights[0]
  }

  static  getLastSegmentOfItinerary (itinerary) {
    return itinerary.flights[itinerary.flights.length - 1]
  }

  static getItineraryDepartureDate(itinerary){
    return itinerary.flights[0].departureTime;
  }

  static getCityNameByAirportCode(airportCode){
    //TODO-retrieve city name
    return airportCode;
  }



}

export class OfferWrapper{
    constructor(offer){
        this.offer=offer;
    }


}

export class ItineraryWrapper{
  constructor(itinerary)
  {
    this.itin=itinerary;
    console.log("ItineraryWrapper,",this.itin)
  }
  getItineraryDepartureDate(){
    let firstSegment=OfferUtils.getFirstSegmentOfItinerary(this.itin);
    return parseISO(firstSegment.departureTime);
  }
  getItineraryArrivalDate(){
    let lastSegment=OfferUtils.getLastSegmentOfItinerary(this.itin);
    return parseISO(lastSegment.arrivalTime);
  }

  getItineraryDepartureAirportCode(){
    let firstSegment=OfferUtils.getFirstSegmentOfItinerary(this.itin);
    return firstSegment.origin.iataCode;
  }
  getItineraryArrivalAirportCode(){
    let lastSegment=OfferUtils.getFirstSegmentOfItinerary(this.itin);
    return lastSegment.destination.iataCode;
  }

  getItineraryDepartureCityName(){
    let firstSegment=OfferUtils.getFirstSegmentOfItinerary(this.itin);
    //TODO replace with cityname
    return '[City]'+firstSegment.origin.iataCode;
  }
  getItineraryArrivalCityName(){
    let lastSegment=OfferUtils.getFirstSegmentOfItinerary(this.itin);
    //TODO replace with cityname
    return '[City]'+lastSegment.destination.iataCode;
  }
  getItineraryDepartureAirportName(){
    let firstSegment=OfferUtils.getFirstSegmentOfItinerary(this.itin);
    //TODO replace with full airport/station name
    return '[Station]'+firstSegment.origin.iataCode;
  }
  getItineraryArrivalAirportName(){
    let lastSegment=OfferUtils.getFirstSegmentOfItinerary(this.itin);
    //TODO replace with full airport/station name
    return '[Station]'+lastSegment.destination.iataCode;
  }


  test(){return "test"}
}



