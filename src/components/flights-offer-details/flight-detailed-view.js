import React  from 'react'
import './flight-detailed-view.css'
import {Container, Row,Col, Button} from 'react-bootstrap'
import PassengersDetailsForm from './passenger-details'
import YourFlightInfo from './flight-info'
import FlightRates from './flight-rates'

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
    const {selectedCombination,selectedOffer,searchResults} = this.props;
    let passengers = searchResults.passengers;
    let pricePlans = searchResults.pricePlans;

    console.log("Selected offer:",selectedOffer)
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
              <FlightRates selectedCombination={selectedCombination} pricePlans={pricePlans} selectedOffer={selectedOffer}/>
            </Col>
          </Row>

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


}





