import React from 'react'
import Header from '../components/header/header'
import Footer from '../components/footer/footer'
import FlightsSearchForm from '../components/flights-search-form/flights-search-form'
import FlightDetail from "../components/flights-search-results/flight-detailed-view";

export default class FlightDetails extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
    };
  }


  render () {
    return (
      <>
        <Header />
        <FlightsSearchForm onSearchRequested={this.searchForFlights} />
        <FlightDetail />
        <Footer />
      </>
    )
  }
}
