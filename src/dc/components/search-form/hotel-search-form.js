import React, {useState} from 'react'
import {Button, Row, Col} from 'react-bootstrap'
import TravelDatepickup from '../traveldate-pickup/travel-datepickup'
import style from './search-form.module.scss'
import PassengerSelector from '../passenger-selector/passenger-selector'
import {CityLookup} from "../lookup/city-lookup";


export default function HotelSearchForm(props){
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
    oneWayAllowed,
    maxPassengers,
    showLabels
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

  function validate(){
    let destinationValid =  isDestinationValid();
    let departureDateValid = isDepartureDateValid();
    let returnDateValid = isReturnDateValid() ;
    let paxSelectionValid = isPaxSelectionValid();
    return destinationValid && departureDateValid && returnDateValid && paxSelectionValid;
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
      locationsSource:'hotels'
    };
  }

  const isValid=validate();

    return (<>

          <div className={style.searchFormContainer}>
            <Row >
              <Col xs={12} md={3} className={style.formElem}><CityLookup initialLocation={initiDest} onSelectedLocationChange={setDestination} placeHolder='Destination' label='Where to?' localstorageKey={'destination'}/></Col>
              <Col xs={12} md={3} className={style.formElem}><PassengerSelector adults={adults} children={children} infants={infants} onAdultsChange={setAdults} onChildrenChange={setChildren} onInfantsChange={setInfants} placeholder='guest' infantsAllowed={true} label='Who?'/></Col>
              <Col xs={12} md={3} className={style.formElem}><TravelDatepickup onStartDateChanged={setDepartureDate} onEndDateChanged={setReturnDate} initialStart={departureDate} initialEnd={returnDate} startPlaceholder='Check in' endPlaceholder='Check out' label='When' localstorageKey={'traveldates'}/></Col>
            </Row>
          </div>
        </>
    )

}
