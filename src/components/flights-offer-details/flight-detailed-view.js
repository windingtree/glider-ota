import React, { useState }  from 'react'
import './flight-detailed-view.css'
import {Container, Row,Col,Image, Form, Button, Alert} from 'react-bootstrap'
import {parseISO,format} from 'date-fns'
import logo from '../../assets/airline_logo.png'
import OfferUtils,{ItineraryWrapper} from '../../utils/offer-utils'
import _ from 'lodash'
import PassengersDetailsForm from './passenger-details'
import YourFlightInfo from './flight-info'

export default class FlightDetail extends React.Component {
  constructor (props) {
    super(props);
    this.state={
      selectedOfferId:props.selectedOffer.offerId,
      selectedCombination:props.selectedCombination,
      selectedOffer:props.selectedOffer
    }
    this.handleContactDetailsChange = this.handleContactDetailsChange.bind(this);
    this.handlePayButtonClick = this.handlePayButtonClick.bind(this);
    console.log(props)
  }

  handleContactDetailsChange(contactDetails){
    console.log("Contact details",contactDetails)
  }


  handlePayButtonClick(){
    let request={
      "offerId": this.state.selectedOfferId,
        "offerItems": this.state.selectedOffer.offerItems,
      "passengers": {
      "PAX1": {
        "type": "ADT",
            "civility": "MR",
            "lastnames": [
          "Marley"
        ],
            "firstnames": [
          "Bob"
        ],
            "birthdate": "1980-03-21T00:00:00Z",
            "contactInformation": [
          "+32123456789",
          "contact@org.co.uk"
        ]
      }
    }
    }


  }

  render () {

    let combination = this.props.selectedCombination;
    let selectedOffer = this.props.selectedOffer;
    let searchResults = this.props.searchResults;
    let passengers = searchResults.passengers;
    let pricePlans = searchResults.pricePlans;

    console.log("Selected offer:",selectedOffer)
    // let itinWrapper=new ItineraryWrapper(outboundItinerary);
    return (
      <>
        <Container >
          <Row className='border'>
            <Col>
              <YourFlightInfo combination={combination}/>
            </Col>
          </Row>
{/*
          <Row>
            <Col>
              <FlightRates combination={combination} pricePlans={{pricePlans}} selectedOffer={{selectedOffer}}/>
            </Col>
          </Row>
*/}
          <Row>
            <Col>
              <PassengersDetailsForm onDataChange={this.handleContactDetailsChange} passengers={passengers}/>
            </Col>
          </Row>
          <Row>
            <Col>
              Price: {selectedOffer.offer.price.public} {selectedOffer.offer.price.currency}
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


function FlightRates(props){
  let combination=props.combination;



  let selectedOffer=props.selectedOffer;
  let pricePlans=props.pricePlans;
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
        {

        }
        <Row>
          <Col>
            <h5>Vueling (Paris-London)</h5>
          </Col>
        </Row>
      </Container>
  )
}





