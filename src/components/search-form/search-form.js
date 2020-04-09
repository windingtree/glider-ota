import React from 'react'
import {Button, Container, Row, Col} from 'react-bootstrap'
import LocationLookup from '../location-lookup/location-lookup'
import TravelDatepickup from '../travel-datepickup/travel-datepickup'
import './search-form.scss'
import PassengerSelector from '../passenger-selector/passenger-selector'

export default class SearchForm extends React.Component {
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
    this.handleOriginChanged = this.handleOriginChanged.bind(this);
    this.handleDestinationChanged = this.handleDestinationChanged.bind(this);
    this.handleStartDateChanged = this.handleStartDateChanged.bind(this);
    this.handleEndDateChanged = this.handleEndDateChanged.bind(this);
    this.handlePaxSelectionChanged = this.handlePaxSelectionChanged.bind(this);
    this.handleSearchBtn = this.handleSearchBtn.bind(this)
  }

  handleOriginChanged (airport) {
    this.setState({ origin: airport })
  }

  handleDestinationChanged (airport) {
    this.setState({ destination: airport })
  }

  handleStartDateChanged (date) {
    this.setState({ departureDate: date })
  }

  handleEndDateChanged (date) {
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
    }else{
      return false
    }
    return true;
  }

  isValid(enableOrigin,oneWayAllowed) {
    return (this.isOriginValid() || !enableOrigin) && this.isDepartureDateValid() && (this.isReturnDateValid() || oneWayAllowed) && this.isDestinationValid();
  }

  render () {
    const {enableOrigin,locationsSource, oneWayAllowed} = this.props;
    const isValid=this.isValid(enableOrigin, oneWayAllowed);
    return (<>
      <Container fluid={true} >
        <Row className='d-flex justify-content-center'>
          {enableOrigin && (<LocationLookup onLocationSelected={this.handleOriginChanged} locationsSource={locationsSource}/>)}
          <LocationLookup  onLocationSelected={this.handleDestinationChanged} locationsSource={locationsSource}/>
          <TravelDatepickup onStartDateChanged={this.handleStartDateChanged} onEndDateChanged={this.handleEndDateChanged} />
          <PassengerSelector onPaxSelectionChanged={this.handlePaxSelectionChanged}/>
        </Row>
      </Container>
        <Container fluid={true} >
        <Row className='d-flex justify-content-center pt-5'>
          {/*<Button className='flightsearch-searchbutton' variant="primary" size="lg" disabled={!isValid} onClick={this.handleSearchBtn}>Search flights</Button>*/}
          <Button className='flightsearch-searchbutton' variant="primary" size="lg" onClick={this.handleSearchBtn}>Search </Button>
        </Row>
        </Container>
      </>
    )
  }
}
