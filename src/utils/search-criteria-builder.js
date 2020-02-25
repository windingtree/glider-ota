import formatISO from 'date-fns/formatISO'

export default class SearchCriteriaBuilder {
  constructor () {
    this.searchCriteria = {

    }
  }

  withDepartureFromAirport (originAirport) {
    this.searchCriteria.origin = {
      locationType: 'airport',
      iataCode: originAirport
    };
    return this
  }

  withDepartureFromRailstation (originRailstation) {
    this.searchCriteria.origin = {
      locationType: 'railstation',
      iataCode: originRailstation
    };
    return this
  }

  withDepartureFromCity (originCitycode) {
    this.searchCriteria.origin = {
      locationType: 'city',
      iataCode: originCitycode
    };
    return this
  }

  withReturnFromAirport (destinationAirport) {
    this.searchCriteria.destination = {
      locationType: 'airport',
      iataCode: destinationAirport
    };
    return this
  }

  withReturnFromRailstation (destinationRailstation) {
    this.searchCriteria.destination = {
      locationType: 'railstation',
      iataCode: destinationRailstation
    };
    return this
  }

  withReturnFromCity (destinationCitycode) {
    this.searchCriteria.destination = {
      locationType: 'city',
      iataCode: destinationCitycode
    };
    return this
  }

  withDepartureDate (departureDate) {
    console.log('Date:', formatISO(departureDate));
    this.searchCriteria.departureTime = formatISO(departureDate);
    return this
  }

  withReturnDate (returnDate) {
    this.searchCriteria.returnTime = formatISO(returnDate);
    return this
  }

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

  build () {
    const request = {
      itinerary: {
        segments: [
          {
            origin: this.searchCriteria.origin,
            destination: this.searchCriteria.destination,
            departureTime: this.searchCriteria.departureTime
          }
        ]
      },
      passengers: this.searchCriteria.passengers
    };

    if ('arrivalTime' in this.searchCriteria) {
      console.log('round trip');
      const returnSegment = {
        origin: this.searchCriteria.destination,
        destination: this.searchCriteria.origin,
        departureTime: this.searchCriteria.returnTime
      };
      request.itinerary.segments.push(returnSegment)
    }
    // console.log(request)

    return request
  }
}
