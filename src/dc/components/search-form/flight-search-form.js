import React, {useState, useEffect} from 'react'
import {Button, Row, Col} from 'react-bootstrap'
import DateRangePickup from '../traveldate-pickup/date-range-pickup'
import style from './search-form.module.scss'
import PassengerSelector from '../passenger-selector/passenger-selector'
import {AirportLookup} from "../lookup/airport-lookup";


import { connect } from 'react-redux';
import {
  searchCriteriaChangedAction
} from '../../../redux/sagas/flights';


export function FlightsSearchForm(props){
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
    maxPassengers,
    searchCriteriaChanged
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
    console.log('Validate form:',result, `${originValid} ${destinationValid} ${departureDateValid} ${paxSelectionValid}`)
    return result;
  }

    return (<>
          <div className={style.searchFormContainer}>
            <Row >
              <Col xs={12} md={3} className={style.formElem}><AirportLookup initialLocation={initOrigin} onSelectedLocationChange={setOrigin} placeHolder='Origin' label='Where from?' localstorageKey={'origin'}/></Col>
              <Col xs={12} md={3} className={style.formElem}><AirportLookup initialLocation={initiDest} onSelectedLocationChange={setDestination} placeHolder='Destination' label='Where to?' localstorageKey={'destination'}/></Col>
              <Col xs={12} md={3} className={style.formElem}><DateRangePickup onStartDateChanged={setDepartureDate} onEndDateChanged={setReturnDate} initialStart={departureDate} initialEnd={returnDate} label='When?' localstorageKey={'traveldates'}/></Col>
              <Col xs={12} md={3} className={style.formElem}><PassengerSelector adults={adults} children={children} infants={infants} onAdultsChange={setAdults} onChildrenChange={setChildren} onInfantsChange={setInfants} infantsAllowed={false} maxPassengers={9} label='Who?'/></Col>
            </Row>
          </div>

        </>
    )
}




const mapStateToProps = state => ({

});

const mapDispatchToProps = (dispatch) => {
  return {
    searchCriteriaChanged: (searchCriteria, isSearchFormValid) => {
      console.log('mapDispatchToProps, searchCriteriaChanged:',searchCriteria, isSearchFormValid)
      dispatch(searchCriteriaChangedAction(searchCriteria, isSearchFormValid))
    }
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(FlightsSearchForm);
