import React from 'react'
import {Container,Row} from 'react-bootstrap'
import AirportLookup from '../airport-lookup/airport-lookup'
import TravelDatepickup from '../travel-datepickup/travel-datepickup'
import './flights-search-form.css'
import PassengerSelector from '../passenger-selector/passenger-selector'

export default class FlightsSearchForm extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      origin: undefined,
      destination: undefined,
      departureDate: undefined,
      returnDate: undefined,
      adults:undefined,
      children:undefined,
      infants:undefined
    };
    this.handleOriginAirportChanged = this.handleOriginAirportChanged.bind(this);
    this.handleDestinationAirportChanged = this.handleDestinationAirportChanged.bind(this);
    this.handleStartDateChanged = this.handleStartDateChanged.bind(this);
    this.handleEndDateChanged = this.handleEndDateChanged.bind(this);
    this.handlePaxSelectionChanged = this.handlePaxSelectionChanged.bind(this);
    this.handleSearchBtn = this.handleSearchBtn.bind(this)
  }

  handleOriginAirportChanged (airport) {
    console.log('Origin changed to:', airport);
    this.setState({ origin: airport })
  }

  handleDestinationAirportChanged (airport) {
    console.log('Destination changed to:', airport);
    this.setState({ destination: airport })
  }

  handleStartDateChanged (date) {
    console.log('Start date:', date);
    this.setState({ departureDate: date })
  }

  handleEndDateChanged (date) {
    console.log('End date:', date);
    this.setState({ returnDate: date })
  }

  handlePaxSelectionChanged(paxSelected){

  }

  handleSearchBtn () {
    this.notifyAboutSearchButtonPressed()
  }

  notifyAboutSearchButtonPressed () {
    const searchCriteria = {
      origin: this.state.origin,
      destination: this.state.destination,
      departureDate: this.state.departureDate,
      returnDate: this.state.returnDate,
      adults:this.state.adults,
      children:this.state.children,
      infants:this.state.infants,
    };
    if (this.props.onSearchRequested) { this.props.onSearchRequested(searchCriteria) }
  }

  isOriginValid(){
    return this.state.origin!==undefined;
  }
  isDestinationValid(){
    return this.state.destination!==undefined;
  }

  isDepartureDateValid(){
    return this.state.departureDate!==undefined
  }
  isReturnDateValid(){
    const dptrDate=this.state.departureDate;
    const returnDate=this.state.returnDate;
    if (returnDate!==undefined) {
      return dptrDate!==undefined && returnDate >= dptrDate;
    }
    return true;
  }

  isValid() {
    return this.isOriginValid() && this.isDepartureDateValid() && this.isReturnDateValid() && this.isDestinationValid();
  }

  render () {
    const isValid=this.isValid();
    return (
      <Container>
        <Row className='flightsearch-row'>
          <AirportLookup onSelectedAirportChanged={this.handleOriginAirportChanged} />
          <AirportLookup onSelectedAirportChanged={this.handleDestinationAirportChanged} />
          <TravelDatepickup onStartDateChanged={this.handleStartDateChanged} onEndDateChanged={this.handleEndDateChanged} />
          <PassengerSelector onPaxSelectionChanged={this.handlePaxSelectionChanged}/>
          <button className='flightsearch-searchbutton' disabled={!isValid} onClick={this.handleSearchBtn}>Search</button>
        </Row>
      </Container>
    )
  }
}
