import formatISO from 'date-fns/formatISO'
/**
 * @module utils/search-criteria-builder
 */


/**
 * Class that simplifies flight/hotel search criteria request creation.
 * <br/>Glider API requires certain format of a search request and user can search using multiple search criteria.
 * <br/>This class allows adding multiple search criteria (e.g. origin, destination, departure date, number of passengers) and creates an object which can be used to search for flights or hotels in Glider API
 *
 */
export default class SearchCriteriaBuilder {
  constructor (type) {
    this.searchCriteria = {
      transportOrigin:undefined,
      transportDepartureDate:undefined,
      transportDestination:undefined,
      transportReturnDate:undefined,
      passengers:[],
      accommodationLocation:undefined,
      accommodationArrivalDate:undefined,
      accommodationReturnDate:undefined,
      locationBoundingBoxSizeInKm:10
    }
  }

  validateLocation(location,locationType){
    if(locationType === 'airport' || locationType === 'railstation' || locationType === 'city'){
      if(location!== undefined && location.length === 3)
        return true;
      throw Error("Invalid location:"+location);
    }
    if(locationType==='rectangle'){
      //TODO - add location rectangle validation
    }
  }

  /**
   * Add origin airport search criteria
   * @param location {string} IATA code of an airport
   * @param locationType {string} 'airport' only supported
   * @return {SearchCriteriaBuilder}
   */
  withTransportDepartureFromLocation (location,locationType='airport') {
    this.validateLocation(location,locationType);
    this.searchCriteria.transportOrigin = {
      locationType: locationType,
      iataCode: location
    };
    return this;
  }

  /**
   * Add destination airport search criteria
   * @param location {string} IATA code of an airport
   * @param locationType {string} 'airport' only supported
   * @return {SearchCriteriaBuilder}
   */
  withTransportReturnFromLocation (location,locationType='airport') {
    this.validateLocation(location,locationType);
    this.searchCriteria.transportDestination = {
      locationType: locationType,
      iataCode: location
    };
    return this;
  }

  /**
   * Add departure date
   * @param departureDate
   * @return {SearchCriteriaBuilder}
   */
  withTransportDepartureDate (departureDate) {
    this.searchCriteria.transportDepartureDate = formatISO(departureDate);
    return this;
  }

  /**
   * Add return date
   * @param returnDate
   * @return {SearchCriteriaBuilder}
   */
  withTransportReturnDate (returnDate) {
    this.searchCriteria.transportReturnDate = formatISO(returnDate);
    return this;
  }

  /**
   * Specify location which should be used to search for hotels
   * @param location
   * @param locationType
   * @return {SearchCriteriaBuilder}
   */
  withAccommodationLocation (location,locationType='rectangle') {
    this.validateLocation(location,locationType);
    this.searchCriteria.accommodationLocation = {
      locationType: locationType,
      location: location
    };
    return this;
  }

  /**
   * Add arrival date (for hotels search)
   * @param arrivalDate
   * @return {SearchCriteriaBuilder}
   */
  withAccommodationArrivalDate (arrivalDate) {
    this.searchCriteria.accommodationArrivalDate = formatISO(arrivalDate);
    return this;
  }

  /**
   * Add return date (for hotels search)
   * @param arrivalDate
   * @return {SearchCriteriaBuilder}
   */
  withAccommodationReturnDate (arrivalDate) {
    this.searchCriteria.accommodationReturnDate = formatISO(arrivalDate);
    return this;
  }

  /**
   * Specify number and type of passengers
   * @param adult {number} number of adults
   * @param children {number} number of children
   * @param infant {number} number of infants
   * @return {SearchCriteriaBuilder}
   */
  withPassengers (adult, children, infant) {
    this.searchCriteria.passengers = [];
    this.searchCriteria.passengers.push({
      type: 'ADT',
      count: adult
    });
    if (children > 0) {
      this.searchCriteria.passengers.push({
        type: 'CHD',
        count: children
      })
    }
    if (infant > 0) {
      this.searchCriteria.passengers.push({
        type: 'INF',
        count: infant
      })
    }
    return this
  }

  /**
   * Create search criteria request that should be used to pass to Glider API
   * @return {Object}
   */
  build () {
    const request = {
      passengers: this.searchCriteria.passengers
    };

    if(this.searchCriteria.transportOrigin!==undefined){
      request.itinerary = this.buildItineraryRequest();
    }

    if(this.searchCriteria.accommodationLocation!==undefined){
      request.accommodation = this.buildAccomodationRequest();
    }

    return request
  }
  boundingBox(lat,long, distanceInKm)
  {
    let latitude = parseFloat(lat);
    let longitude = parseFloat(long);
    let size = parseInt(distanceInKm)
    const adjust = .008983112; // 1km at equator(in degrees).
    const lngRatio = 1/Math.cos(latitude*(Math.PI/180));
    let result =  {
      north:latitude + ( size * adjust),
      south:latitude - ( size * adjust),
      west:longitude + (size * adjust) * lngRatio,
      east:longitude - (size * adjust) * lngRatio
    }
    return result;
  }


  buildItineraryRequest () {
    const itineraryRequest = {
        segments: [
          {
            origin: this.searchCriteria.transportOrigin,
            destination: this.searchCriteria.transportDestination,
            departureTime: this.searchCriteria.transportDepartureDate
          }
        ]
      };

    if (this.searchCriteria.transportReturnDate!==undefined) {
      const returnSegment = {
        origin: this.searchCriteria.transportDestination,
        destination: this.searchCriteria.transportOrigin,
        departureTime: this.searchCriteria.transportReturnDate
      };
      itineraryRequest.segments.push(returnSegment)
    }

    return itineraryRequest;
  }

  buildAccomodationRequest () {
    const accomodationRequest = {
        location : {
          rectangle: this.searchCriteria.accommodationLocation.location
        },
        arrival: this.searchCriteria.accommodationArrivalDate,
        departure: this.searchCriteria.accommodationReturnDate
    };

    return accomodationRequest;
  }


}
