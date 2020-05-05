import React  from 'react'
import './flight-detailed-view.scss'
import {Container, Row, Col, Button, Alert} from 'react-bootstrap'
import YourFlightInfo from './flight-info'
import FlightRates from './flight-rates'
import {config} from "../../config/default";
import {Link} from "react-router-dom";
import _ from 'lodash';
import Spinner from "../common/spinner";
import PaymentForm from "../payments/payment-form";
import { withRouter } from 'react-router'
import PaxDetails from "./pax-details";



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




class FlightDetail extends React.Component {
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
    this.onPaymentFailure=this.onPaymentFailure.bind(this);
    this.onPaymentSuccess=this.onPaymentSuccess.bind(this);
  }

  handleSelectedOfferChange(newOffer){
    console.log("Offer changed",newOffer)
    this.setState({
      selectedOfferId:newOffer.offerId,
      selectedOffer:newOffer,
      // contact_details:[]
    })
  }

  handleContactDetailsChange(passengers){
    console.log("Passengers details changed",passengers)
    this.setState({ contact_details:passengers})
  }

  createPassenger(passenger){
    console.log("createPassenger before",passenger);

    let result =  {
      "type": passenger.type,
      "civility": "MR",
      "lastnames": [
        passenger.lastName
      ],
      "firstnames": [
        passenger.firstName
      ],
      "birthdate": passenger.birthdate,
      "contactInformation": [
        passenger.phone,
        passenger.email,
      ]
    }
    console.log("createPassenger after",result);
    return result;
  }

  handlePayButtonClick(){
    const contactDetails = this.state.contact_details;
    const selectedOffer = this.state.selectedOffer;
    console.log("Pay button clicked, offer:",selectedOffer, "pax details:", contactDetails);
    let request = {
      offerId:selectedOffer.offerId,
      offerItems:selectedOffer.offer.offerItems,
      passengers:{
      }
    }
    _.each(contactDetails,(pax)=>{
      console.log("Will convert:",pax)
        request.passengers[pax.id]=this.createPassenger(pax)
    });

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

  onPaymentSuccess(){
    this.props.history.push("/confirmation/"+this.state.order.orderId);
  }

  onPaymentFailure(){
    // this.props.history.push("/confirmation/"+this.state.order.orderId);
    console.log("payment failed")
  }

  //temporary - convert pax from search results into format required by pax component
  //TODO - that should be replaced by session data
  createInitialPaxParameter(searchResults){
    let requestedPassengers = searchResults.passengers;
    let passengers = [];
    _.each(requestedPassengers,(rec,paxId)=>{
      passengers.push({
        id:paxId,
        type:rec.type
      })
    })
    return passengers;
  }

  render () {

    const {selectedOffer} = this.state;
    console.log("Flight detailed view - selected ofer", selectedOffer)
    const {selectedCombination,searchResults} = this.props;
    let passengers = this.createInitialPaxParameter(searchResults);
    console.log("Will pass",passengers)
    let pricePlans = searchResults.pricePlans;


    return (
      <>
        {config.DEBUG_MODE && <span>{selectedOffer.offerId}</span>}
        <Container>
          <Row>
            <Col className='flight-offer-details-wrapper'>
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
              <PaxDetails  onDataChange={this.handleContactDetailsChange} passengers={passengers}/>
            </Col>
          </Row>
          {(this.state.processingInProgress!==true && this.state.order===undefined) &&
          <Row className='pb-5'>
            <Col>
              <PriceSummary price={selectedOffer.offer.price} onPayButtonClick={this.handlePayButtonClick}/>
            </Col>
          </Row>
          }
          <Spinner enabled={this.state.processingInProgress===true}/>
          {this.state.processingError!==undefined &&
          (<Row>
            <Col>
              <Alert variant="danger">{this.state.processingError}</Alert>
            </Col>
          </Row>)}
          {this.state.order!==undefined && (<PaymentForm orderID={this.state.order.orderId} onPaymentFailure={this.onPaymentFailure} onPaymentSuccess={this.onPaymentSuccess}/>)}
          <Row className='pb-5'>

          </Row>
        </Container>
      </>
    )
  }


}



const PriceSummary = ({price, onPayButtonClick}) =>{
  return (
      <>
        <Row className='pt-5'>
          <Col >
      <div className='glider-font-h2-fg'>Pay {price.public} {price.currency} to complete the booking</div>
          </Col>
          <Col xl={2}>
            <Button variant="primary" onClick={onPayButtonClick} size="lg" >Pay now</Button>
          </Col>
        </Row>
      </>
  )
}




FlightDetail = withRouter(FlightDetail)
export default FlightDetail;