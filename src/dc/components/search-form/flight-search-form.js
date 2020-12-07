import React, {useState} from 'react'
import {Button, Row, Col} from 'react-bootstrap'
import TravelDatepickup from '../traveldate-pickup/travel-datepickup'
import style from './search-form.module.scss'
import PassengerSelector from '../passenger-selector/passenger-selector'
import {config} from '../../../config/default'
import {AirportLookup} from "../lookup/airport-lookup";


export default function FlightsSearchForm(props){
  // Destructure properties
  const {
    initOrigin,
    initiDest,
    initDepartureDate,
    initReturnDate,
    initAdults,
    initChildren,
    initInfants,
    onSearchButtonClick,
    locationsSource,
    oneWayAllowed = true,
    maxPassengers
  } = props;


  const [origin, setOrigin] = useState(initOrigin);
  const [destination, setDestination] = useState(initiDest);
  const [departureDate, setDepartureDate] = useState(initDepartureDate?initDepartureDate:undefined);
  const [returnDate, setReturnDate] = useState(initReturnDate?initReturnDate:undefined);
  const [adults, setAdults] = useState(initAdults||1);
  const [children, setChildren] = useState(initChildren||0);
  const [infants, setInfants] = useState(initInfants||0);

  function serializeSearchForm(){
    return {
      origin: origin,
      destination: destination,
      departureDate: departureDate,
      returnDate: returnDate,
      adults:adults,
      children:children,
      infants:infants,
      isValid:validate(),
      locationsSource:locationsSource
    };
  }

  function searchButtonClick () {
    const searchCriteria = serializeSearchForm();
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
    } else{
      return false
    }
  }

  function isPaxSelectionValid(){
    // Check if maximum is not exceeded
    if(maxPassengers && (adults + infants + children) > maxPassengers) {
      return false;
    }

    //@fixme: Infants are not yet supported by AC
    if(infants > 0) {
      return false;
    }

    // Check if infants do not exceed adults (since they seat on laps)
    if(infants > adults) {
      return false;
    }

    // Otherwise just ensure we have adults (minor-only not supported)
    return (adults>0);
  }
  function serializeSearchForm(){
    return {
      origin: origin,
      destination: destination,
      departureDate: departureDate,
      returnDate: returnDate,
      adults:adults,
      children:children,
      infants:infants,
      isValid:validate(),
      locationsSource:'flights'
    };
  }

  function validate(){
    let originValid = isOriginValid();
    let destinationValid =  isDestinationValid();
    let departureDateValid = isDepartureDateValid();
    let returnDateValid = isReturnDateValid() || oneWayAllowed;
    let paxSelectionValid = isPaxSelectionValid();
    return originValid && destinationValid && departureDateValid && returnDateValid && paxSelectionValid;
  }

    return (<>
          <div className={style.searchFormContainer}>
            <Row >
              <Col xs={12} md={3} className={style.formElem}><AirportLookup initialLocation={initOrigin} onSelectedLocationChange={setOrigin} placeHolder='Origin' label='Where from?' localstorageKey={'origin'}/></Col>
              <Col xs={12} md={3} className={style.formElem}><AirportLookup initialLocation={initiDest} onSelectedLocationChange={setDestination} placeHolder='Destination' label='Where to?' localstorageKey={'destination'}/></Col>
              <Col xs={12} md={3} className={style.formElem}><TravelDatepickup onStartDateChanged={setDepartureDate} onEndDateChanged={setReturnDate} initialStart={departureDate} initialEnd={returnDate} label='When?' localstorageKey={'traveldates'}/></Col>
              <Col xs={12} md={3} className={style.formElem}><PassengerSelector adults={adults} children={children} infants={infants} onAdultsChange={setAdults} onChildrenChange={setChildren} onInfantsChange={setInfants} infantsAllowed={false} maxPassengers={9} label='Who?'/></Col>
            </Row>
          </div>

        </>
    )
}



