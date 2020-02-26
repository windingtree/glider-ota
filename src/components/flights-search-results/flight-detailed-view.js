import React, { useState }  from 'react'
import './flight-detailed-view.css'
import {Container, Row,Col,Image, Form, Button, Alert} from 'react-bootstrap'
import {parseISO,format} from 'date-fns'
import logo from '../../assets/airline_logo.png'
import OfferUtils,{ItineraryWrapper} from '../../utils/offer-utils'
import _ from 'lodash'

export default class FlightDetail extends React.Component {
  constructor (props) {
    super(props);
    this.handleContactDetailsChange = this.handleContactDetailsChange.bind(this);
    this.handlePayButtonClick = this.handlePayButtonClick.bind(this);
  }

  handleContactDetailsChange(contactDetails){
    console.log("Contact details",contactDetails)
  }

  handlePayButtonClick(){
    console.log("Pay!!!")
  }

  render () {

    let combination = this.props.selectedOffer;
    let passengers = this.props.passengers;
    let pricePlans = this.props.pricePlans;
    // let itinWrapper=new ItineraryWrapper(outboundItinerary);
    return (
      <>
        <Container >
          <Row className='border'>
            <Col>
              {/*<YourFlightInfo combination={combination}/>*/}
            </Col>
          </Row>
          <Row>
            <Col>
              <FlightRates combination={combination}/>
            </Col>
          </Row>
          <Row>
            <Col>
              <PassengerForm onDataChange={this.handleContactDetailsChange} passengers={passengers}/>
            </Col>
          </Row>
          <Row>
            <Col>
              Price: 100EUR
              <Button variant="primary" onClick={this.handlePayButtonClick}>
                Submit
              </Button>
            </Col>
          </Row>
        </Container>
      </>
    )
  }


  renderSubtitle(outboundItinerary, returnItinerary){

  }


}


function YourFlightInfo(props){

  let combination=props.combination;

  if(combination===undefined){
    return (<>nothing to display</>)
  }

  const outboundItinerary = OfferUtils.getOutboundItinerary(combination);
  const returnItinerary = OfferUtils.doesReturnItineraryExist(combination)?OfferUtils.getReturnItinerary(combination) : undefined;


  return(
      <Container >
        <Row>
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

      </Container>
  )
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
  let combination=props.combination;
  let offers = combination.offers


  return(
      <Container>
        <Row>
          <Col>
            <h2>Airline rates</h2>
          </Col>
        </Row>
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



class PassengerForm extends React.Component {
  constructor(props) {
    super(props);
    var initState = {
      email: '',
      phone: ''
    }
    _.map(props.passengers, (pax, id) => {
      initState[id] = {
        firstname: '',
        lastname: '',
        birthdate: '',
      }
    })

    console.log("Init state:",initState)
    this.state=(initState);

    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleInputChange(event) {
    const target = event.target;
    let name = target.name;
    const value = target.value;
    let paxId;
    //if fieldname is prefixed with paxID (e.g. PAX1.lastname), set value for appropriate passenger
    if(name.indexOf('.')!=-1){
      paxId=name.split('.')[0]
      name=name.split('.')[1]
    }
    console.log("change, name:", name, ",value:", value,' PaxID:',paxId);
    let s=this.state;

    if(paxId!==undefined)
      s[paxId][name]=value;
    else
      s[name]=value;
    this.setState(s)

    if(this.props.onDataChange!==undefined){
      this.props.onDataChange(this.state);
    }
  }


  handleSubmit(event) {
    event.preventDefault();
    const data = new FormData(event.target);
    console.log("Data:",data)
  }




  render() {
    let passengers = this.props.passengers;
    // passengers=[]
    _.map(passengers,(pax,id)=>{
      console.log("Pax:",pax,"ID:",id)
    })


    console.log("State:",this.state)
    return (
        <Form onSubmit={this.handleSubmit}>
          <Container>
            <Row>
              <Col>
                <h2>Passengers for reservation</h2>
              </Col>
            </Row>
            <Row>
              <Col>
                Enter your personal details as indicated in the travel document you are flying on. Use Latin letters.
                <div>
                  <small>The number and type of passengers for this airline can only be changed with a new search
                  </small>
                </div>
              </Col>
            </Row>
            {
              _.map(passengers,(pax,id)=>{

                return (
                    <Row>
                      <Col>
                        <h5>Adult {this.state[id].firstname} {this.state[id].lastname}</h5>



                        <Form.Row>
                          <Col>
                            <Form.Label>Surname</Form.Label>
                            <Form.Control type="text" placeholder="Lastname" name={id+'.lastname'} value={this.state[id].lastname}
                                          onChange={this.handleInputChange} />
                          </Col>
                          <Col>
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="text" placeholder="Firstname" name={id+'.firstname'} value={this.state[id].firstname}
                                          onChange={this.handleInputChange}/>
                          </Col>
                        </Form.Row>
                        <Form.Row>
                          <Col>
                            <Form.Label>Date of birth</Form.Label>
                            <Form.Control type="date" className="input-birthdate" name={id+'.birthdate'}
                                          value={this.state[id].birthdate}
                                          onChange={this.handleInputChange}/>
                          </Col>

                        </Form.Row>
                      </Col>
                    </Row>

                )
              })
            }
            <Row>
              <Col>
                <Alert variant="dark">
                  This website doesn’t store any personal data you may enter while booking. All passneger’s information
                  and
                  buyer’s contact data is securely passed to supplier
                </Alert>
              </Col>
            </Row>
            <Row>
              <Col>
                <h2>Contact details</h2>
              </Col>
            </Row>
            <Row>
              <Col>

                  <Form.Row>
                    <Col>
                      <Form.Label>Email {this.state.email}</Form.Label>
                      <Form.Control type="email" placeholder="email" name="email" value={this.state.email}
                                    onChange={this.handleInputChange}/>
                    </Col>
                    <Col>
                      <Form.Label>Telephone</Form.Label>
                      <Form.Control type="phone" placeholder="+7" name="phone" value={this.state.phone}
                                    onChange={this.handleInputChange}/>
                    </Col>
                  </Form.Row>
{/*                  <Button variant="primary" type="submit">
                    Submit
                  </Button>*/}
              </Col>
            </Row>
            <Row>
              <Col>
                We will send a ticket to the ail, we will send an SMS to the phone about changes in the flight or in
                case
                of other emergency situations
              </Col>
            </Row>
          </Container>
        </Form>
    )
  }
}