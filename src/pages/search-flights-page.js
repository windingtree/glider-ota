import React from 'react'
import FlightsSearchForm from '../components/flights-search-form/flights-search-form'
import FlightsSearchResults from '../components/flights-search-results/flights-search-results'
import SearchCriteriaBuilder from '../utils/search-criteria-builder'
import FlightDetail from "../components/flights-offer-details/flight-detailed-view";
import FlightSearchResultsConverter from '../utils/flight-search-results-converter'

export default class _SearchFlightsPage extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      flight_search_results: undefined,
      selected_offer:undefined

    };
    this.searchForFlights = this.searchForFlights.bind(this);
    this.displayOffer = this.displayOffer.bind(this)
  }

  searchForFlights (criteria) {
    this.search(criteria)
  }

  displayOffer(offer) {
    console.log("Offer requested:",offer);
    this.setState({ selected_offer: offer });
  }

  search (criteria) {

    const criteriaBuilder = new SearchCriteriaBuilder();

    // TODO - handle search from city/railstation and different pax types
    const searchCriteria = criteriaBuilder
      .withDepartureFromAirport(criteria.origin.id)
      .withDepartureDate(criteria.departureDate)
      .withReturnFromAirport(criteria.destination.id)
      .withReturnDate(criteria.returnDate)
      .withPassengers(criteria.adults,criteria.children,criteria.infants)
      .build();

    console.log('Search criteria', searchCriteria);
    const me = this;

    const requestInfo = {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json'
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      body: JSON.stringify(searchCriteria)
    };
    console.log("Request info:",requestInfo);
    fetch('/api/searchOffers', requestInfo)
      .then(function (res) {
        return res.json()
      })
      .then(function (data) {
        me.handleSearchResultsReceived( data );
      }).catch(function (err) {
        console.log(err)
      })
  }

  render () {
    if(this.state.selected_offer!==undefined){
      return this.renderSingleOffer();
    }else{
      return this.renderResults();
    }

  }

  handleSearchResultsReceived(results){
    let converter = new FlightSearchResultsConverter(results);
    this.setState({ flight_search_results: converter.transformResults() })
  }


  renderResults () {
    let search_results = this.state.flight_search_results;

/*
    let converter = new FlightSearchResultsConverter(sample_response)
    search_results = converter.transformResults()
*/
    console.log("data",search_results);
    // let converter = new FlightSearchResultsConverter(sample_response)
    return (
      <>
        <FlightsSearchForm onSearchRequested={this.searchForFlights} />

        <FlightsSearchResults onOfferDisplay={this.displayOffer} searchResults={search_results} />
      </>
    )
  }

  renderSingleOffer(){
    return (
        <>
            <FlightDetail offer={this.state.selected_offer}/>
        </>
    )
  }

}
