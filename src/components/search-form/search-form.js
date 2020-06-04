import React, {useState} from 'react'
import {Button, Container, Row, Col} from 'react-bootstrap'
import LookupField, {LOCATION_SOURCE} from '../lookup/lookup-field'
import TravelDatepickup from './travel-datepickup'
import style from './search-form.module.scss'
import PassengerSelector from './passenger-selector'
import {config} from '../../config/default'
import SearchCriteriaBuilder from "../../utils/search-criteria-builder";
import {findFlights, findHotels} from "../../utils/search";
import {uiEvent} from "../../utils/events";
import {AirportLookup,CityLookup} from "../lookup/lookup";

const TYPE={
  FLIGHTS:'flights',
  HOTELS:'hotels'
}

function SearchForm({initOrigin,initiDest,initDepartureDate,initReturnDate,initAdults,initChildren,initInfants,onSearchButtonClick, formType,locationsSource, oneWayAllowed}){
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
    let originValid =  isOriginValid() || (formType==TYPE.HOTELS);  //if it's hotels - origin is not displayed
    let destinationValid =  isDestinationValid();
    let departureDateValid = isDepartureDateValid();
    let returnDateValid = isReturnDateValid() || oneWayAllowed;
    let paxSelectionValid = isPaxSelectionValid();
    let isFormValid = originValid && destinationValid && departureDateValid && returnDateValid && paxSelectionValid;
    return isFormValid;
  }
    const isValid=validate();


  const renderHotelForm = () =>{
    return (<>

          <div className={style.searchFormContainer}>
            <Row >
              <Col lg={6} className={style.formElem}><CityLookup initialLocation={initiDest} onSelectedLocationChange={setDestination} placeHolder='Destination'/></Col>
              <Col lg={6} className={style.formElem}><PassengerSelector adults={adults} childrn={childrn} infants={infants} onAdultsChange={setAdults} onChildrenChange={setChildren} onInfantsChange={setInfants} placeholder='guest'/></Col>
            </Row>
            <Row>
              <Col className=''><TravelDatepickup onStartDateChanged={setDepartureDate} onEndDateChanged={setReturnDate} initialStart={departureDate} startPlaceholder='Check in' endPlaceholder='Check out'/></Col>
            </Row>
          </div>
          <div className={style.searchButtonContainer}>
            <Row >
              <Col xs={12} className='d-flex'>
                <Button className={style.searchButton} variant="primary" size="lg"
                        disabled={!isValid && !config.OFFLINE_MODE} onClick={searchButtonClick}>Search</Button>
              </Col>
            </Row>
          </div>
        </>
    )
  }

  const renderFlightsForm = () =>{
    return (<>
          <div className={style.searchFormContainer}>
            <Row >
              <Col xs={12} md={6} className={style.formElem}><AirportLookup initialLocation={initOrigin} onSelectedLocationChange={setOrigin} placeHolder='Origin'/></Col>
              <Col xs={12} md={6} className={style.formElem}><AirportLookup initialLocation={initiDest} onSelectedLocationChange={setDestination} placeHolder='Destination'/></Col>
            </Row>
            <Row>
              <Col xs={12}  md={6} className=''><TravelDatepickup onStartDateChanged={setDepartureDate} onEndDateChanged={setReturnDate} initialStart={departureDate} initialEnd={returnDate}/></Col>
              <Col xs={12} md={6} className={style.formElem}><PassengerSelector adults={adults} childrn={childrn} infants={infants} onAdultsChange={setAdults} onChildrenChange={setChildren} onInfantsChange={setInfants}/></Col>
            </Row>
          </div>
          <div className={style.searchButtonContainer}>
            <Row >
              <Col xs={12} className='d-flex'>
                <Button className={style.searchButton} variant="primary" size="lg"
                        disabled={!isValid && !config.OFFLINE_MODE} onClick={searchButtonClick}>Search</Button>
              </Col>
            </Row>
          </div>
        </>
    )
  }
  return (<>
        {formType===TYPE.FLIGHTS && renderFlightsForm()}
        {formType===TYPE.HOTELS && renderHotelForm()}
      </>
    )
}

export function FlightsSearchForm({initOrigin,initiDest,initDepartureDate,initReturnDate,initAdults,initChildren,initInfants,onSearchButtonClick}) {
  return (
      <SearchForm
          initOrigin={initOrigin}
          initiDest={initiDest}
          initAdults={initAdults}
          initChildren={initChildren}
          initInfants={initInfants}
          initDepartureDate={initDepartureDate}
          initReturnDate={initReturnDate}
          oneWayAllowed={true}
          locationsSource={LOCATION_SOURCE.AIRPORTS}
          formType={TYPE.FLIGHTS}
          onSearchButtonClick={onSearchButtonClick} />
)
}

export function HotelsSearchForm ({initOrigin,initiDest,initDepartureDate,initReturnDate,initAdults,initChildren,initInfants,onSearchButtonClick}){
  return (
      <SearchForm
          initOrigin={initOrigin}
          initiDest={initiDest}
          initAdults={initAdults}
          initChildren={initChildren}
          initInfants={initInfants}
          initDepartureDate={initDepartureDate}
          initReturnDate={initReturnDate}
          oneWayAllowed={true}
          locationsSource={LOCATION_SOURCE.CITIES}
          formType={TYPE.HOTELS}
          onSearchButtonClick={onSearchButtonClick} />

  )
}





export async function searchForFlightsWithCriteria(criteria){
  return searchForFlights(criteria.origin.code, criteria.destination.code, criteria.departureDate, criteria.returnDate, criteria.adults, criteria.children, criteria.infants);
}

export async function searchForFlights(originCode, destinationCode, departureDate, returnDate, adults, children, infants){
  let searchRequest;
  console.log("searchForFlights(.,.,.,.,.), originCode",originCode,"destinationCode",destinationCode)
  // if(!config.OFFLINE_MODE) { //no need to fill search criteria in OFFLINE_MODE
    searchRequest = buildFlightsSearchCriteria(originCode, destinationCode, departureDate, returnDate, adults, children, infants);
  // }
  console.log("searchForFlights(.,.,.,.,.), searchRequest",searchRequest)
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
  let boundingBoxForSelectedLocation = criteriaBuilder.boundingBox(latitude,longitude,10)
  let boundingBoxForSelectedLocation2 = criteriaBuilder.boundingBox(latitude,longitude,40)
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



