import React  from 'react'
import './flight-detailed-view.scss'
import {Container, Row, Col, Button, Alert} from 'react-bootstrap'
import TripDetails from '../flightdetails/trip-details'
import {config} from "../../config/default";
import {Link} from "react-router-dom";
import _ from 'lodash';
import { withRouter } from 'react-router'
import PaxDetails from "./pax-details";



class Passengers extends React.Component {
  constructor (props) {
    super(props);
    const {selectedCombination,selectedOffer}=props;
    this.state={
      order:undefined
    }
    this.handleContactDetailsChange = this.handleContactDetailsChange.bind(this);
    this.proceedButtonClick = this.handleContactDetailsChange.proceedButtonClick(this);
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

  proceedButtonClick(){

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
        <Container fluid={true}>
          <Row>
            <Col >
              <TripDetails itineraries={selectedCombination.itinerary}/>
            </Col>
          </Row>


          <Row>
            <Col>
              <PaxDetails  onDataChange={this.handleContactDetailsChange} passengers={passengers}/>
            </Col>
          </Row>
          <Row className='py-5'>
            <Col className='d-flex justify-content-end'>
              <Button className='primary' onClick={proceedButtonClick}>Proceed to fare family selection</Button>
            </Col>
          </Row>
        </Container>
      </>
    )
  }


}



Passengers = withRouter(Passengers)
export default Passengers;