import React, {useState} from 'react'
import {Button, Container, Row, Col} from 'react-bootstrap'
import LocationLookup from './location-lookup'
import TravelDatepickup from './travel-datepickup'
import './search-form.scss'
import PassengerSelector from './passenger-selector'
import {config} from '../../config/default'
import SearchCriteriaBuilder from "../../utils/search-criteria-builder";
import {findFlights, findHotels} from "../../utils/search";


export function SearchForm({initOrigin,initiDest,initDepartureDate,initReturnDate,initAdults,initChildren,initInfants,onSearchButtonClick, enableOrigin,locationsSource, oneWayAllowed}){
  const [origin, setOrigin] = useState(initOrigin);
  const [destination, setDestination] = useState(initiDest);
  const [departureDate, setDepartureDate] = useState();
  const [returnDate, setReturnDate] = useState();
  const [adults, setAdults] = useState(initAdults||1);
  const [childrn, setChildren] = useState(initChildren||0);
  const [infants, setInfants] = useState(initInfants||0);


 /* function searchFormChanged(){
    console.log("searchFormChanged");
    const searchFormCriteria = serializeSearchForm();
    if(onSearchFormChanged) {
      console.log("searchFormChanged OK");
      onSearchFormChanged(searchFormCriteria);
    }
  }*/

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
    console.log("searchButtonClick()")
    const searchCriteria = serializeSearchForm();
    console.log("searchButtonClick() - searchCriteria",searchCriteria)
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

  function validate(){
    return (isOriginValid() || !enableOrigin) && isDepartureDateValid() && (isReturnDateValid() || oneWayAllowed) && isDestinationValid();
  }

    const isValid=validate();
   // searchFormChanged();
    return (<>
      <Container fluid={true} >
        <Row >
          {enableOrigin && (
            <Col lg={6} className='pb-4'><LocationLookup onLocationSelected={setOrigin} locationsSource={locationsSource}/></Col>)}
            <Col lg={6} className='pb-4'><LocationLookup onLocationSelected={setDestination} locationsSource={locationsSource}/></Col>
        </Row>
        <Row>
          <Col lg={6} ><TravelDatepickup onStartDateChanged={setDepartureDate} onEndDateChanged={setReturnDate} /></Col>
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
  console.log('searchForFlights2', criteria);
  return searchForFlights(criteria.origin.iata, criteria.destination.iata, criteria.departureDate, criteria.returnDate, criteria.adults, criteria.children, criteria.infants);
}

export async function searchForFlights(originCode, destinationCode, departureDate, returnDate, adults, children, infants){
  let searchRequest;
  console.log('searchForFlights', originCode);
  if(!config.OFFLINE_MODE) { //no need to fill search criteria in OFFLINE_MODE
    searchRequest = buildFlightsSearchCriteria(originCode, destinationCode, departureDate, returnDate, adults, children, infants);
  }
  console.log('API search criteria', searchRequest);
  return findFlights(searchRequest);
}


export async function searchForHotels(criteria, onSearchSuccessCallback,onSearchFailureCallback){

  let searchRequest;

  if(!config.OFFLINE_MODE) { //no need to fill search criteria in OFFLINE_MODE
    searchRequest = buildHotelsSearchCriteria(criteria.destination.latitude, criteria.destination.longitude, criteria.departureDate, criteria.returnDate, criteria.adults, criteria.children, criteria.infants);
  }

  console.debug('Raw search criteria:',criteria,' API search criteria', searchRequest)
  return findHotels(searchRequest);
}




export function buildFlightsSearchCriteria(origin,destination,departureDate,returnDate, adults,children,infants) {
  console.log("buildFlightsSearchCriteria", origin)
  const criteriaBuilder = new SearchCriteriaBuilder();
  // TODO - handle search from city/railstation and different pax types
  const searchCriteria = criteriaBuilder
      .withTransportDepartureFromLocation(origin)
      .withTransportDepartureDate(departureDate)
      .withTransportReturnFromLocation(destination)
      .withTransportReturnDate(returnDate)
      .withPassengers(adults,children,infants)
      .build();
  console.log("buildFlightsSearchCriteria  criteria", searchCriteria)
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
  return searchCriteria;
}