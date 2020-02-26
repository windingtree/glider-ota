import React from 'react'
import './flight-detailed-view.css'
import {Container, Row,Col,Image, Form, Button} from 'react-bootstrap'
import {parseISO,format} from 'date-fns'
import logo from '../../assets/airline_logo.png'
import OfferUtils,{ItineraryWrapper} from '../../utils/offer-utils'


export default class FlightDetail extends React.Component {
  constructor (props) {
    super(props);
  }


  render () {
    let combination=this.props.selectedOffer;
    let pricePlans=this.props.pricePlans;

    if(combination===undefined){
      return (<>nothing to display</>)
    }

    const outboundItinerary = OfferUtils.getOutboundItinerary(combination);
    const returnItinerary = OfferUtils.doesReturnItineraryExist(combination)?OfferUtils.getReturnItinerary(combination) : undefined;


    // let itinWrapper=new ItineraryWrapper(outboundItinerary);
    return (
      <>
        <Container className='offer-detail-wrapper'>
          <Row className='border'>
            <Col>
              <h1>Your flights</h1>
              <ItineraryHeader outboundItinerary={outboundItinerary} returnItinerary={returnItinerary}/>
              <ItineraryDetails itinerary={outboundItinerary}/>
              {returnItinerary!==undefined &&
              <ItineraryDetails itinerary={returnItinerary}/>
              }
{/*

              <h3 className="combination-detail-subtitle">{this.renderSubtitle(outboundItinerary,returnItinerary)}</h3>
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
              <PassengerForm />
            </Col>
          </Row>
          <Row>
            <Col>
              <h2>Contact information</h2>
            </Col>
          </Row>

          <Row>
            <Col md={12}>
              {/*{ this.renderOffer(combination) })*/}
            </Col>
            <Col />
          </Row>
        </Container>
      </>
    )
  }


  renderSubtitle(outboundItinerary, returnItinerary){

  }


}


function ItineraryDetails(props){
  console.log("Itinerary",props.itinerary)
  return (
      <Container className="offer-detail-container">
        <Row>
          <Col md={3} className='border'><AirlineAndFlight itinerary={props.itinerary}/></Col>
          <Col className='border'><DepartureAndArrivalInfo itinerary={props.itinerary}/></Col>
          <Col md={3} className='border'><h5>{OfferUtils.calculateDuration(props.itinerary)}</h5><PricePlan/></Col>
        </Row>
      </Container>
  )
}
function DepartureAndArrivalInfo(props){
  let itin=props.itinerary;
  let dptrDate=OfferUtils.getItineraryDepartureDate(props.itinerary);
  let arrivalDate=OfferUtils.getItineraryArrivalDate(props.itinerary);
  return (
      <Container className='border'>
        <Row>
          <h4>{OfferUtils.getItineraryDepartureCityName(props.itinerary)} - {OfferUtils.getItineraryArrivalCityName(props.itinerary)}</h4>
        </Row>
        <Row>
          <Col md={4}>
            <h5>{format(dptrDate,'HH:mm')}<small>{format(dptrDate,'LLL dd (EEE)')}</small></h5>
            <div><span>{OfferUtils.getItineraryDepartureAirportCode(props.itinerary)}</span><span>{OfferUtils.getItineraryDepartureAirportCode(props.itinerary)}</span></div>
          </Col>
          <Col><span>-</span></Col>
          <Col md={4}>
            <h5>{format(arrivalDate,'HH:mm')}<small>{format(arrivalDate,'LLL dd (EEE)')}</small></h5>
            <div><span>{OfferUtils.getItineraryArrivalCityName(props.itinerary)}</span><span>{OfferUtils.getItineraryArrivalAirportCode(props.itinerary)}</span></div>
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

function ItineraryHeader(props){
  const outboundItinerary=props.outboundItinerary;
  const returnItinerary=props.returnItinerary;
  const depCityName = OfferUtils.getItineraryDepartureCityName(outboundItinerary);
  const arrivCityName = OfferUtils.getItineraryArrivalCityName(outboundItinerary);
  let departureDateStr = format(OfferUtils.getItineraryDepartureDate(outboundItinerary), 'LLL dd (EEE)')
  let returnDateStr = '';
  if(returnItinerary!==undefined){
    returnDateStr  = ' | '+format(OfferUtils.getItineraryDepartureDate(returnItinerary), 'LLL dd (EEE)');
  }


  return (
      <span >{depCityName}-{arrivCityName} | {departureDateStr} {returnDateStr}</span>
  )

}

function AirlineAndFlight(props){
  let operatingCarrier=OfferUtils.getItineraryOperatingCarrier(props.itinerary);
  return(
      <Container className='offer-detail--flightinfo'>
        <Row>
          <Col><Image src={logo} roundedCircle fluid/></Col>
          <Col>
            <p>{operatingCarrier.airlineName} <small className="text-muted">{operatingCarrier.flight}</small></p>
          </Col>
        </Row>
      </Container>
  )
}

function FlightRates(props){
  return(
      <Container className='offer-detail--ratesinfo'>
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


function PassengerForm(props){
  return(
      <Container className='offer-detail--ratesinfo'>
        <Row>
          <Col>
            Enter your personal details as indicated in the travel document you are flying on. Use Latin letters.
            <div><small>The number and type of passengers for this airline can only be changed with a new search</small></div>
          </Col>
        </Row>
        <Row>
          <Col>
            <h5>Adult</h5>
            <Form>
              <Form.Group>
                <Form.Label>Surname</Form.Label>
                <Form.Control type="text" placeholder="Lastname" />
              </Form.Group>

              <Form.Group >
                <Form.Label>Name</Form.Label>
                <Form.Control type="text" placeholder="Firstname" />
              </Form.Group>
              <Form.Group controlId="formBasicCheckbox">
                <Form.Check type="checkbox" label="Check me out" />
              </Form.Group>
              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
  )
}