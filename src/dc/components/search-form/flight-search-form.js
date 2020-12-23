import React, {useState, useEffect} from 'react'
import {Col} from 'react-bootstrap'
import DateRangePickup from '../traveldate-pickup/date-range-pickup'
import style from './flight-search-form.module.scss'
import PassengerSelector from '../passenger-selector/passenger-selector'
import {AirportLookup} from "../lookup/airport-lookup";
import {venueConfig} from "../venue-context/theme-context";

import { connect } from 'react-redux';
import {
  flightSearchCriteriaChangedAction
} from '../../../redux/sagas/shopping-flow-store';



export function FlightsSearchForm(props){
  // Destructure properties
  const {
    initOrigin,
    initDest,
    initDepartureDate,
    initReturnDate,
    initAdults,
    initChildren,
    initInfants,
    onSearchButtonClick,
    locationsSource,
    maxPassengers,
    searchCriteriaChanged
  } = props;

  const [origin, setOrigin] = useState(initOrigin);
  const [destination, setDestination] = useState(initDest);
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

  function isOriginValid(){
    return origin!==undefined;
  }

  function isDestinationValid(){
    return destination!==undefined;
  }

  function isDepartureDateValid(){
    return departureDate!==undefined
  }

  //subscribe for search criteria changes so that we notify others once form is valid
  useEffect(() => {
    if(searchCriteriaChanged){
      let searchCriteria=serializeSearchForm();
      let isSearchFormValid = searchCriteria.isValid;
      //fire action to notify others about search criteria and bool flag with the result of validation
      searchCriteriaChanged(searchCriteria, isSearchFormValid);
    }else{
      console.warn('searchCriteriaChanged is not defined!')
    }
  }, [origin, destination, departureDate, returnDate, adults, children, infants]) // <-- here put the parameter to listen

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
    let originValid = isOriginValid();
    let destinationValid =  isDestinationValid();
    let departureDateValid = isDepartureDateValid();
    let paxSelectionValid = isPaxSelectionValid();
    let result = originValid && destinationValid && departureDateValid && paxSelectionValid;
    return result;
  }

  const originAirportKey = 'origin-airport';
  const destinationAirportKey = 'destination-airport';

  const storedOriginRaw = sessionStorage.getItem(`inputfield-${originAirportKey}`);
  const storedDestinationRaw = sessionStorage.getItem(`inputfield-${destinationAirportKey}`);
  let storedOrigin;
  let storedDestination;

  try {
    storedOrigin = JSON.parse(storedOriginRaw);
    storedDestination = JSON.parse(storedDestinationRaw);
  } catch (e) {}

  let initialOrigin = initOrigin ? initOrigin : storedOrigin ? storedOrigin : venueConfig.originIata;
  let initialDestination = initDest ? initDest : storedDestination ? storedDestination : venueConfig.destinationIata;
  let initialDepartureDate = departureDate ? departureDate:null;
  let initialReturnDate = returnDate ? returnDate:null;

  return (
    <>
      <Col xs={12} md={3} className={style.formElem}>
        <AirportLookup
          initialLocation={initialOrigin}
          onSelectedLocationChange={setOrigin}
          placeHolder='Where from'
          label='From'
          localstorageKey={originAirportKey}
        />
      </Col>
      <Col xs={12} md={3} className={style.formElem}>
        <AirportLookup
          initialLocation={initialDestination}
          onSelectedLocationChange={setDestination}
          placeHolder='Where to'
          label='To'
          localstorageKey={destinationAirportKey}
        />
      </Col>
      <Col xs={12} md={3} className={style.formElem}>
        <DateRangePickup
          onStartDateChanged={setDepartureDate}
          startPlaceholder={'Departure'}
          endPlaceholder={'Return'}
          onEndDateChanged={setReturnDate}
          initialStart={initialDepartureDate}
          initialEnd={initialReturnDate}
          label='When'
          localstorageKey={'traveldates'}
          displayVenueBadge={true}
        />
      </Col>
      <Col xs={12} md={3} className={style.formElem}>
        <PassengerSelector
          adults={adults}
          children={children}
          infants={infants}
          onAdultsChange={setAdults}
          onChildrenChange={setChildren}
          onInfantsChange={setInfants}
          infantsAllowed={false}
          maxPassengers={9}
          label='Who'
        />
      </Col>
{/*
<Row>
  <Col xs={12} md={3} className={style.formElem}>
    <div className={style.roundTripCheckbox}> <Form.Check ><Form.Check.Input type={'checkbox'}  bsPrefix={style.roundTripCheckbox}/><Form.Check.Label bsPrefix={style.roundTripCheckboxLabel}>Round trip</Form.Check.Label></Form.Check></div>
  </Col>
</Row>
*/}

    </>
  );
}




const mapStateToProps = state => ({

});

const mapDispatchToProps = (dispatch) => {
  return {
    searchCriteriaChanged: (searchCriteria, isSearchFormValid) => {
      dispatch(flightSearchCriteriaChangedAction(searchCriteria, isSearchFormValid))
    }
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(FlightsSearchForm);
