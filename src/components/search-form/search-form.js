import React, {useState} from 'react'
import {Button, Container, Row, Col} from 'react-bootstrap'
import LocationLookup from './location-lookup'
import TravelDatepickup from './travel-datepickup'
import './search-form.scss'
import PassengerSelector from './passenger-selector'
import {config} from '../../config/default'
import SearchCriteriaBuilder from "../../utils/search-criteria-builder";
import {findFlights, findHotels} from "../../utils/search";
import {uiEvent} from "../../utils/events";


export function SearchForm({initOrigin,initiDest,initDepartureDate,initReturnDate,initAdults,initChildren,initInfants,onSearchButtonClick, enableOrigin,locationsSource, oneWayAllowed}){
  const [origin, setOrigin] = useState(initOrigin);
  const [destination, setDestination] = useState(initiDest);
  const [departureDate, setDepartureDate] = useState(initDepartureDate?initDepartureDate:undefined);
  const [returnDate, setReturnDate] = useState(initReturnDate?initReturnDate:undefined);
  const [adults, setAdults] = useState(initAdults||1);
  const [childrn, setChildren] = useState(initChildren||0);
  const [infants, setInfants] = useState(initInfants||0);

  function serializeSearchForm(){
    return {
      origin: origin,
      destination: destination,
      departureDate: departureDate,
      returnDate: returnDate,
      adults:adults,
      children:childrn,
      infants:infants,
      isValid:validate(),
      locationsSource:locationsSource
    };
  }

  function searchButtonClick () {
    const searchCriteria = serializeSearchForm();
    uiEvent("search click", searchCriteria);
    if(onSearchButtonClick)
      onSearchButtonClick(searchCriteria)
  }

  function isOriginValid(){
    return origin!==undefined;
  }
  function isDestinationValid(){
    return destination!==undefined;
  }

  function isDepartureDateValid(){
    return departureDate!==undefined
  }
  function isReturnDateValid(){
    if (returnDate!==undefined) {
      return departureDate!==undefined && returnDate >= departureDate;
    }else{
      return false
    }
    return true;
  }
  function isPaxSelectionValid(){
    return (adults>0)
  }

  function validate(){
    let originValid =  isOriginValid() || !enableOrigin;
    let destinationValid =  isDestinationValid();
    let departureDateValid = isDepartureDateValid();
    let returnDateValid = isReturnDateValid() || oneWayAllowed;
    let paxSelectionValid = isPaxSelectionValid();
    let isFormValid = originValid && destinationValid && departureDateValid && returnDateValid && paxSelectionValid;
    return isFormValid;
  }
    const isValid=validate();
   // searchFormChanged();
    return (<>
      <Container fluid={true} >
        <Row >
          {enableOrigin && (
            <Col lg={6} className='pb-4'><LocationLookup initialLocation={initOrigin} onLocationSelected={setOrigin} locationsSource={locationsSource} placeHolder='Origin'/></Col>)}
            <Col lg={6} className='pb-4'><LocationLookup initialLocation={initiDest} onLocationSelected={setDestination} locationsSource={locationsSource} placeHolder='Destination'/></Col>
        </Row>
        <Row>
          <Col lg={6} ><TravelDatepickup onStartDateChanged={setDepartureDate} onEndDateChanged={setReturnDate} initialStart={departureDate}/></Col>
          <Col lg={6} className='pb-4'><PassengerSelector adults={adults} childrn={childrn} infants={infants} onAdultsChange={setAdults} onChildrenChange={setChildren} onInfantsChange={setInfants}/></Col>
        </Row>
      </Container>
      <Container fluid={true} className='searchbutton__container'>
        <Row className='pt-5'>
          <Col xs={12} className='d-flex'>
          <Button className='searchbutton__button flex-fill' variant="primary" size="lg"
                  disabled={!isValid && !config.OFFLINE_MODE} onClick={searchButtonClick}>Search</Button>
          </Col>
        </Row>
      </Container>
      </>
    )
}

export async function searchForFlightsWithCriteria(criteria){
  return searchForFlights(criteria.origin, criteria.destination, criteria.departureDate, criteria.returnDate, criteria.adults, criteria.children, criteria.infants);
}

export async function searchForFlights(originCode, destinationCode, departureDate, returnDate, adults, children, infants){
  let searchRequest;
  if(!config.OFFLINE_MODE) { //no need to fill search criteria in OFFLINE_MODE
    searchRequest = buildFlightsSearchCriteria(originCode, destinationCode, departureDate, returnDate, adults, children, infants);
  }
  return findFlights(searchRequest);
}


export async function searchForHotels(criteria){

  let searchRequest;

  if(!config.OFFLINE_MODE) { //no need to fill search criteria in OFFLINE_MODE
    searchRequest = buildHotelsSearchCriteria(criteria.destination.latitude, criteria.destination.longitude, criteria.departureDate, criteria.returnDate, criteria.adults, criteria.children, criteria.infants);
  }
  return findHotels(searchRequest);
}




export function buildFlightsSearchCriteria(origin,destination,departureDate,returnDate, adults,children,infants) {
  uiEvent(`flight search params RAW origin=[${origin}] destination=[${destination}}] departureDate=[${departureDate}}] returnDate=[${returnDate}}] adults=[${adults}}] children=[${children}}] infants=[${infants}}]`);
  const criteriaBuilder = new SearchCriteriaBuilder();
  // TODO - handle search from city/railstation and different pax types
   criteriaBuilder
      .withTransportDepartureFromLocation(origin)
      .withTransportDepartureDate(departureDate)
      .withTransportReturnFromLocation(destination)

      .withPassengers(adults,children,infants);
   if(returnDate!==undefined)
     criteriaBuilder.withTransportReturnDate(returnDate);

  const searchCriteria = criteriaBuilder.build();

  uiEvent('flight search criteria',searchCriteria);
  return searchCriteria;
}



export function buildHotelsSearchCriteria(latitude,longitude,arrivalDate,returnDate, adults,children,infants) {
  const criteriaBuilder = new SearchCriteriaBuilder();
  let boundingBoxForSelectedLocation = criteriaBuilder.boundingBox(latitude,longitude,config.LOCATION_BOUNDING_BOX_IN_KM)
  const searchCriteria = criteriaBuilder
      .withAccommodationLocation(boundingBoxForSelectedLocation,'rectangle')
      .withAccommodationArrivalDate(arrivalDate)
      .withAccommodationReturnDate(returnDate)
      .withPassengers(adults,children,infants)
      .build();
  uiEvent(`hotel search params RAW latitude=[${latitude}] longitude=[${longitude}}] arrivalDate=[${arrivalDate}}] returnDate=[${returnDate}}] adults=[${adults}}] children=[${children}}] infants=[${infants}}]`);
  uiEvent('hotel search criteria',searchCriteria);
  return searchCriteria;
}