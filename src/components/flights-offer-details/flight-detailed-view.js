import React  from 'react'
import './flight-detailed-view.scss'
import {Container, Row, Col, Button, Alert} from 'react-bootstrap'
import PassengersDetailsForm from './passenger-details'
import YourFlightInfo from './flight-info'
import FlightRates from './flight-rates'

import {Link} from "react-router-dom";

const createOffer = options => {
  return window
      .fetch(`/api/createWithOffer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(options)
      })
      .then(res => {
        if (res.status === 200) {
          return res.json();
        } else {
          return null;
        }
      })
      .then(data => {
        if (!data || data.error) {
          console.log("API error:", { data });
          throw new Error("Cannot create offer - API error");
        } else {
          return data;
        }
      });
};

export default class FlightDetail extends React.Component {
  constructor (props) {
    super(props);
    const {selectedCombination,selectedOffer}=props;
    this.state={
      selectedOfferId:selectedOffer.offerId,
      selectedCombination:selectedCombination,
      selectedOffer:selectedOffer,
      processingInProgress:false,
      processingError:undefined,
      order:undefined
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

  createPassenger(firstName, lastName, contactEmail, contactPhone){
    return {
      "type": "ADT",
      "civility": "MR",
      "lastnames": [
        lastName
      ],
      "firstnames": [
        firstName
      ],
      "birthdate": "1980-03-21T00:00:00Z",
      "contactInformation": [
        contactPhone,
        contactEmail
      ]
    }
  }

  handlePayButtonClick(){
    const contactDetails = this.state.contact_details;
    const selectedOffer = this.state.selectedOffer;
    console.log("Pay button clicked, offer:",selectedOffer, "pax details:", contactDetails);
//todo - remove hardcoded paxID, add birthdate, pax type
    let request = {
      offerId:selectedOffer.offerId,
      offerItems:selectedOffer.offer.offerItems,
      passengers:{
        "PAX1":this.createPassenger(contactDetails.PAX1.firstname,contactDetails.PAX1.lastname,contactDetails.email,contactDetails.phone)
      }
    }
    console.log("Request:",request)
    this.setProcessingInProgress(true)
    this.setProcessingError(undefined)
    let me = this;
    createOffer(request).then(data=> {
      me.setProcessingInProgress(false);
      console.log("Offer created!!!", data)
      me.setOrderDetails(data);
    }).catch(err=>{
      console.log("Offer creation failed", err)
      me.setProcessingInProgress(false);
      me.setProcessingError("Cannot create reservation:"+err);
    })

  }

  setProcessingInProgress(processingInProgress){
    this.setState({processingInProgress:processingInProgress})
  }

  setProcessingError(msg){
    this.setState({processingError:msg})
  }
  setOrderDetails(order){
    this.setState({order:order})
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
          {this.state.processingInProgress &&
          (<Row>
            <Col>
              <Alert variant="primary">Transaction in progress....</Alert>
            </Col>
          </Row>)}
          {this.state.processingError!==undefined &&
          (<Row>
            <Col>
              <Alert variant="danger">{this.state.processingError}</Alert>
            </Col>
          </Row>)}
          {this.state.order!==undefined &&
          (<Row>
            <Col>
              <Alert variant="success">Pay with:
                <Link to={`/payments/${this.state.order.orderId}`}>card</Link>
              </Alert>
            </Col>
          </Row>)}

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


