import React from 'react'
import './flight-detailed-view.css'
import {Container, Row,Col,Image} from 'react-bootstrap'
import {parseISO,format} from 'date-fns'
import FlightSearchResultsConverter from './flight-search-results-converter'

import logo from '../../assets/airline_logo.png'
import dummyResponse from '../../data/response_after_conversion'
import OfferUtils,{ItineraryWrapper} from '../../utils/offer-utils'


export default class FlightDetail extends React.Component {
  constructor (props) {
    super(props);
    // this.handleOfferDisplay = this.handleOfferDisplay.bind(this)

  }


  loadDummyOffer(){

    let converter = new FlightSearchResultsConverter();
    // let offers = converter.convertResponse(dummyResponse)
    let offers = dummyResponse;
    for(let key in offers){
      return offers[key]
    }
    let offer  = offers[0];
  }






  render () {
    let offer = this.loadDummyOffer();

    // let offer=this.props.offer

    if(offer===undefined){
      return (<>nothing to display</>)
    }

    const outboundItinerary = OfferUtils.getOutboundItinerary(offer);
    const returnItinerary = OfferUtils.doesReturnItineraryExist(offer)?OfferUtils.getReturnItinerary(offer) : undefined;


    let itinWrapper=new ItineraryWrapper(outboundItinerary);
    return (
      <>
        <Container className='offer-detail-wrapper'>
          <Row className='border'>
            <Col>
              <h1>Your flights</h1>
              <ItineraryDetails itinerary={itinWrapper}/>




{/*


              <h1 className="offer-detail-title">Your flights</h1>
              <h3 className="offer-detail-subtitle">{this.renderSubtitle(outboundItinerary,returnItinerary)}</h3>
*/}
            </Col>
          </Row>
          <Row>
            <Col>
              <h2>Airline rates</h2>

            </Col>
          </Row>
          <Row>
            <Col>
              <h2>Passengers for reservation</h2>
            </Col>
          </Row>
          <Row>
            <Col>
              <h2>Contact information</h2>
            </Col>
          </Row>

          <Row>
            <Col md={12}>
              {/*{ this.renderOffer(offer) })*/}
            </Col>
            <Col />
          </Row>
        </Container>
      </>
    )
  }


  renderSubtitle(outboundItinerary, returnItinerary){
    const firstSegment = OfferUtils.getFirstSegmentOfItinerary(outboundItinerary);
    const lastSegment = OfferUtils.getLastSegmentOfItinerary(outboundItinerary);
    const departureDate = parseISO(OfferUtils.getItineraryDepartureDate(outboundItinerary));

    let departureDateStr = format(departureDate, 'LLL dd (EEE)')

    let returnDateStr = '';
    if(returnItinerary!==undefined){
      let returnDate = parseISO(OfferUtils.getItineraryDepartureDate(returnItinerary));
      let returnDateStr  = format(returnDate, 'LLL dd (EEE)')
    }


    return (
      <span >{OfferUtils.getCityNameByAirportCode(firstSegment.origin.iataCode)}-
        {OfferUtils.getCityNameByAirportCode(lastSegment.destination.iataCode)} | {departureDateStr} | {returnDateStr}</span>
    )
  }

  renderItinerary (itinerary) {
    return (
      <Row className='offer-row offer-row-itinerary'>
        <Col sm={4} className='offer-col offer-col-airports'>CDG-SVO</Col>
        <Col sm={4} className='offer-col offer-col-duration'>2h 20 min</Col>
        <Col sm={4} className='offer-col offer-col-stopover'>KRK,VIE</Col>
      </Row>
    )
  }

  getOutboundItinerary (offer) {
    return offer.itineraries[0]
  }

  doesReturnItineraryExist(offer){
    return offer.itineraries.length>1
  }
  getReturnItinerary (offer) {
    //FIXME - what if there are more than two?
    return offer.itineraries[1]
  }

  getFirstSegment (itinerary) {
    return itinerary.segments[0]
  }

  getLastSegment (itinerary) {
    return itinerary.segments[itinerary.segments.length - 1]
  }
}


function ItineraryDetails(props){
  console.log("Itinerary",props.itinerary)
  // let itin=new ItineraryWrapper(props.itinerary);
  return (
      <Container className="offer-detail-container">
        <Row>
          <Col md={3} className='border'><AirlineAndFlight/></Col>
          <Col className='border'><DepartureAndArrivalInfo itinerary={props.itinerary}/></Col>
          <Col md={3} className='border'><h5>1h 23min</h5><PricePlan/></Col>
        </Row>
      </Container>
  )
}
function DepartureAndArrivalInfo(props){
  let itin=props.itinerary;
  let dptrDate=itin.getItineraryDepartureDate();
  let arrivalDate=itin.getItineraryArrivalDate();

  return (
      <Container className='border'>
        <Row>
          <h4>{itin.getItineraryDepartureCityName()} - {itin.getItineraryArrivalCityName()}</h4>
        </Row>
        <Row>
          <Col md={4}>
            <h5>{format(dptrDate,'HH:mm')}<small>{format(dptrDate,'LLL dd (EEE)')}</small></h5>
            <div><span>{itin.getItineraryDepartureAirportName()}</span><span>{itin.getItineraryDepartureAirportCode()}</span></div>
          </Col>
          <Col><span>-</span></Col>
          <Col md={4}>
            <h5>{format(arrivalDate,'HH:mm')}<small>{format(arrivalDate,'LLL dd (EEE)')}</small></h5>
            <div><span>{itin.getItineraryArrivalCityName()}</span><span>{itin.getItineraryArrivalAirportCode()}</span></div>
          </Col>
        </Row>
      </Container>
  )
}
function PricePlan(props) {
  return(
      <Container className='offer-detail--priceplan'>
        <Row>
          No luggage
        </Row>
      </Container>
  )
}
function AirlineAndFlight(props){
  return(
      <Container className='offer-detail--flightinfo'>
        <Row>
          <Col><Image src={logo} roundedCircle fluid/></Col>
          <Col>
            <p>Vueling <small className="text-muted">VY-123,Airbus a320</small></p>
          </Col>
        </Row>
      </Container>
  )
}

function FlightRates(props){
  return(
      <Container className='offer-detail--ratestinfo'>
        <Row>
          <Col>
            <h4>Flight#1</h4>
          </Col>
        </Row>
        <Row>
          <Col>
            <h5>Vueling (Paris-London)</h5>
          </Col>
        </Row>
      </Container>
  )
}