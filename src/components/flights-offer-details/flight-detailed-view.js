import React  from 'react'
import './flight-detailed-view.scss'
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
      selectedOffer:newOffer,
      // contact_details:[]
    })
  }

  handleContactDetailsChange(contactDetails){
    this.setState({ contact_details:contactDetails})
    console.log("Contact details",contactDetails)
  }


  handlePayButtonClick(){
    const contactDetails = this.state.contact_details;
    const selectedOffer = this.state.selectedOffer;
    console.log("Pay button clicked, offer:",selectedOffer, "pax details:", contactDetails);
  }



  render () {

    const {selectedOffer} = this.state;
    const {selectedCombination,searchResults} = this.props;
    let passengers = searchResults.passengers;
    let pricePlans = searchResults.pricePlans;

    return (
      <>
        <Container >
          <Row >
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
              <PriceSummary price={selectedOffer.offer.price} onPayButtonClick={this.handlePayButtonClick}/>
            </Col>
          </Row>
        </Container>
      </>
    )
  }


}



const PriceSummary = ({price, onPayButtonClick}) =>{
  return (
      <Alert variant="dark">
        <h4>Pay {price.public} {price.currency} to complete the booking</h4>
        <Button variant="primary" onClick={onPayButtonClick}>Pay now</Button>
      </Alert>
  )
}


