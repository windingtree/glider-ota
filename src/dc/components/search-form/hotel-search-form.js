import React, {useCallback, useEffect, useState} from 'react'
import {Button, Row, Col, Container} from 'react-bootstrap'
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
    initDest,
    initDepartureDate,
    initReturnDate,
    initAdults,
    initChildren,
    initInfants,
    onSearchButtonClick,
    maxPassengers,
    showLabels,
    searchCriteriaChanged,
    initSearch
  } = props;


  const [destination, setDestination] = useState(initDest);
  const [departureDate, setDepartureDate] = useState(initDepartureDate?initDepartureDate:undefined);
  const [returnDate, setReturnDate] = useState(initReturnDate?initReturnDate:undefined);
  const [adults, setAdults] = useState(initAdults||1);
  const [children, setChildren] = useState(initChildren||0);
  const [infants, setInfants] = useState(initInfants||0);

  const validate = useCallback(() => {
    const isDestinationValid = () => {
      return destination!==undefined;
    };
    const isDepartureDateValid = () => {
      return departureDate!==undefined;
    };
    const isReturnDateValid = () => {
      if (returnDate!==undefined) {
        return departureDate!==undefined && returnDate >= departureDate;
      } else{
        return false;
      }
    };
    const isPaxSelectionValid = () => {
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
    };

    let destinationValid =  isDestinationValid();
    let departureDateValid = isDepartureDateValid();
    let returnDateValid = isReturnDateValid() ;
    let paxSelectionValid = isPaxSelectionValid();
    return destinationValid && departureDateValid && returnDateValid && paxSelectionValid;
  }, [adults, children, departureDate, destination, infants, maxPassengers, returnDate]);

  const serializeSearchForm = useCallback(() => {
    return {
      origin: origin,
      destination: destination,
      departureDate: departureDate,
      returnDate: returnDate,
      adults: adults,
      children: children,
      infants: infants,
      isValid: validate()
    };
  }, [destination, departureDate, returnDate, adults, children, infants, validate]);

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
  }, [destination, departureDate, returnDate, adults, children, infants, serializeSearchForm, searchCriteriaChanged]) // <-- here put the parameter to listen


  let initialCheckInDate=departureDate?departureDate:null;
  let initialCheckout=returnDate?returnDate:null;

    return (<>
              <Col xs={12} md={3} className={style.formElem}>
                <CityLookup
                  initialLocation={destination}
                  onSelectedLocationChange={setDestination}
                  placeHolder='Destination'
                  label='Destination/Hotel'
                  localstorageKey={'destination-city'}
                />
              </Col>
              <Col xs={12} md={6} className={style.formElem}>
                <DateRangePickup
                  onStartDateChanged={setDepartureDate}
                  onEndDateChanged={setReturnDate}
                  initialStart={initialCheckInDate}
                  initialEnd={initialCheckout}
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
                  placeholder='guest'
                  infantsAllowed={true}
                  label='Who'
                />
              </Col>
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
