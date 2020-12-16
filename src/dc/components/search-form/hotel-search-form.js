import React, {useEffect, useState} from 'react'
import {Button, Row, Col, Container} from 'react-bootstrap'
import DatePickup from '../traveldate-pickup/date-pickup'
import {addDays} from "date-fns";
import style from './hotel-search-form.module.scss'
import PassengerSelector from '../passenger-selector/passenger-selector'
import {CityLookup} from "../lookup/city-lookup";
import {hotelSearchCriteriaChangedAction} from "../../../redux/sagas/shopping-flow-store";
import {connect} from "react-redux";
import DateRangePickup from "../traveldate-pickup/date-range-pickup";
import {venueConfig} from "../venue-context/theme-context";


export function HotelSearchForm(props){
  // Destructure properties
  const {
    initiDest,
    initDepartureDate,
    initReturnDate,
    initAdults,
    initChildren,
    initInfants,
    onSearchButtonClick,
    maxPassengers,
    showLabels,
    searchCriteriaChanged
  } = props;


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
      isValid:validate()
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


  //subscribe for search criteria changes so that we notify others once form is valid
  useEffect(() => {
    if(searchCriteriaChanged){
      if (departureDate && !returnDate) {
        setReturnDate(addDays(departureDate, 1))
      }

      let searchCriteria=serializeSearchForm();
      let isSearchFormValid = searchCriteria.isValid;
      //fire action to notify others about search criteria and bool flag with the result of validation
      searchCriteriaChanged(searchCriteria, isSearchFormValid);
    }else{
      console.warn('searchCriteriaChanged is not defined!')
    }
  }, [destination, departureDate, returnDate, adults, children, infants]) // <-- here put the parameter to listen



  function validate(){
    let destinationValid =  isDestinationValid();
    let departureDateValid = isDepartureDateValid();
    let returnDateValid = isReturnDateValid() ;
    let paxSelectionValid = isPaxSelectionValid();
    return destinationValid && departureDateValid && returnDateValid && paxSelectionValid;
  }
  // let initialOrigin=initOrigin?initOrigin:venueConfig.originIata;
  // let initialDestination=initiDest?initiDest:venueConfig.destinationIata;
  let initialCheckInDate=departureDate?departureDate:venueConfig.startDate;
  let initialCheckout=returnDate?returnDate:venueConfig.endDate;

    return (<>

          <Container fluid={true}>
            <Row >
              <Col xs={12} md={3} className={style.formElem}>
                <CityLookup
                  initialLocation={initiDest}
                  onSelectedLocationChange={setDestination}
                  placeHolder='Destination'
                  label='Destination/Hotel'
                  localstorageKey={'destination-city'}
                />
              </Col>
              <Col xs={12} md={6} className={style.formElem}>
                <DateRangePickup onStartDateChanged={setDepartureDate} onEndDateChanged={setReturnDate} initialStart={initialCheckInDate} initialEnd={initialCheckout} label='When' localstorageKey={'traveldates'}/>
              </Col>
              <Col xs={12} md={3} className={style.formElem}><PassengerSelector adults={adults} children={children} infants={infants} onAdultsChange={setAdults} onChildrenChange={setChildren} onInfantsChange={setInfants} placeholder='guest' infantsAllowed={true} label='Who'/></Col>
            </Row>
          </Container>
        </>
    )

}


const mapStateToProps = state => ({

});

const mapDispatchToProps = (dispatch) => {
  return {
    searchCriteriaChanged: (searchCriteria, isSearchFormValid) => {
      dispatch(hotelSearchCriteriaChangedAction(searchCriteria, isSearchFormValid))
    }
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(HotelSearchForm);
