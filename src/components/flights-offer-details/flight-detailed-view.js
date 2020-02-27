import React  from 'react'
import './flight-detailed-view.css'
import {Container, Row, Col, Button, Alert} from 'react-bootstrap'
import PassengersDetailsForm from './passenger-details'
import YourFlightInfo from './flight-info'
import FlightRates from './flight-rates'

export default class FlightDetail extends React.Component {
  constructor (props) {
    super(props);
    const {selectedCombination,selectedOffer}=props;
    this.state={
      selectedOfferId:selectedOffer.offerId,
      selectedCombination:selectedCombination,
      selectedOffer:selectedOffer
    }
    this.handleContactDetailsChange = this.handleContactDetailsChange.bind(this);
    this.handlePayButtonClick = this.handlePayButtonClick.bind(this);
    this.handleSelectedOfferChange= this.handleSelectedOfferChange.bind(this);
  }

  handleSelectedOfferChange(newOffer){
    console.log("Offer changed",newOffer)
    this.setState({
      selectedOfferId:newOffer.offerId,
      selectedOffer:newOffer
    })
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

  createRequest(){
    let req={
      "offerId": "ad43a2d8-bbe4-4714-83a2-d8bbe4d70001",
      "offerItems": {
        "cc9d98f0-dd28-49b6-9d98-f0dd2879b608": {
          "passengerReferences": "PAX1"
        }
      },
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

    const {selectedOffer} = this.state;
    const {selectedCombination,searchResults} = this.props;
    let passengers = searchResults.passengers;
    let pricePlans = searchResults.pricePlans;


    console.log("Render offer:",selectedOffer)
    // let itinWrapper=new ItineraryWrapper(outboundItinerary);
    return (
      <>
        <Container >
          <Row className='border'>
            <Col>
              <YourFlightInfo combination={selectedCombination}/>
            </Col>
          </Row>

          <Row>
            <Col>
              <FlightRates selectedCombination={selectedCombination} pricePlans={pricePlans} selectedOffer={selectedOffer} onOfferChange={this.handleSelectedOfferChange}/>
            </Col>
          </Row>

          <Row>
            <Col>
              <PassengersDetailsForm onDataChange={this.handleContactDetailsChange} passengers={passengers}/>
            </Col>
          </Row>
          <Row>
            <Col>
              <Alert variant="dark">
                <h4>Pay {selectedOffer.offer.price.public} {selectedOffer.offer.price.currency} to complete the booking</h4>
                <Button variant="primary" onClick={this.handlePayButtonClick}>
                  Pay now
                </Button>

              </Alert>
            </Col>
          </Row>
        </Container>
      </>
    )
  }


}





