import React from 'react'
import './flights-search-results.css'
import {Container,Row,Col,Image} from 'react-bootstrap'
import logo from '../../assets/airline_logo.png'
import {format,parseISO} from "date-fns";

import FlightSearchResultsConverter from '../../utils/flight-search-results-converter'
import StopoverFilter from '../filters/stopover-filter'
import FastCheapFilter from '../filters/fast-cheap-filter'
import OfferUtils from '../../utils/offer-utils'
// import FlightResultsProcessor from '../../utils/offer-utils'


export default class FlightsSearchResults extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      value: ''
    };
    this.handleInputValueChange = this.handleInputValueChange.bind(this);
    this.handleOfferDisplay = this.handleOfferDisplay.bind(this);
  }

  handleInputValueChange (event) {
  }
  handleOfferDisplay (offer) {
    console.log("handleOfferDisplay",offer);
    if (this.props.onOfferDisplay) { this.props.onOfferDisplay(offer) }
  }


  render () {

    let searchResults = [];

    if (this.props.searchResults !== undefined) {
      console.log('we have data',this.props.searchResults);
      searchResults = this.props.searchResults;
    }else{
      console.log('No data!!');

      return (<>Search for something</>)
    }
    return (
      <>

        <Container>
          <Row>
            <Col ms={2}>
              {<StopoverFilter />}
            </Col>
            <Col sm={12} md={10} lg={8} xl={7} className='search-results-container'>
              <FastCheapFilter />
              {
                 searchResults.map(offer => { return this.renderOffer(offer) })
              }
            </Col>
            <Col />
          </Row>
        </Container>
      </>
    )
  }

  renderOffer (offer) {
    const outboundItinerary = offer.pricePlans[0];
    const returnItinerary = OfferUtils.doesReturnItineraryExist(offer) ? OfferUtils.getReturnItinerary(offer) : undefined;
    const firstSegment = OfferUtils.getFirstSegmentOfItinerary(outboundItinerary);
    return (
      <Container className='offer-container'>
        <Row className='offer-row offer-row-metainfo'>
          <Col sm={4} className='offer-col offer-col-price'>{this.renderPrice(offer)}</Col>
          <Col sm={4} className='offer-col offer-col-ancillaries'>2</Col>
          <Col sm={4} className='offer-col offer-col-operator'>{this.renderAirlineLogo(firstSegment.operator)}</Col>
        </Row>
        {this.renderItinerary(outboundItinerary)}
        {returnItinerary !== undefined && this.renderItinerary(outboundItinerary)}
      </Container>
    )
  }

  renderItinerary (itinerary) {
    return (
      <Row className='offer-row offer-row-itinerary'>
        <Col sm={4} className='offer-col offer-col-airports'>{this.renderAirports(itinerary)}</Col>
        <Col sm={4} className='offer-col offer-col-duration'>{this.renderDuration(itinerary)}</Col>
        <Col sm={4} className='offer-col offer-col-stopover'>{this.renderStopoverInformation(itinerary)}</Col>
      </Row>
    )
  }

  renderPrice (offer) {
    return (
      <>
        <div className='offer-details--title'>BOOK</div>
        <div className='offer-details--content'>
          <button className='offer-details-price' onClick={()=>{this.handleOfferDisplay(offer)}}>{offer.price.public} {offer.price.currency}</button>
        </div>
      </>
    )
  }

  renderAirports (itinerary) {
    const firstSegment = OfferUtils.getFirstSegmentOfItinerary(itinerary);
    const lastSegment = OfferUtils.getLastSegmentOfItinerary(itinerary);
    const startOfTrip = parseISO(firstSegment.departureTime);
    const endOfTrip = parseISO(lastSegment.arrivalTime);
    return (<>
      <div className='offer-details--title'>{firstSegment.origin.iataCode}-{lastSegment.destination.iataCode}</div>
      <div className='offer-details--content'>{format(startOfTrip, 'HH:mm')}-{format(endOfTrip, 'HH:mm')}</div>
    </>
    )
  }

  renderDuration (itinerary) {
    return (<>
      <div className='offer-details--title'>DURATION</div>
      <div className='offer-details--content'>{OfferUtils.calculateDuration(itinerary)}</div>
    </>
    )
  }

  renderStopoverInformation (itinerary) {
    const segments = itinerary.flights;
    const stops = [];
    for (let i = 0; i < segments.length - 1; i++) {
      const segment = segments[i];
      if(i>0)
        stops.push(',');
      stops.push(segment.destination.iataCode)
    }
    return (<>
        <div className='offer-details--title'>STOPS</div>
        <div className='offer-details--content'>{stops}</div>
      </>
    )
  }

  renderAirlineLogo (operator) {
    return (
      <Image src={logo} />
    )
  }


}


function processResults(results){
  // results.com
}