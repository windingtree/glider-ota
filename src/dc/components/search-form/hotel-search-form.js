import React, {useCallback, useEffect, useState} from 'react';
import { connect } from 'react-redux';
import { Button, Row, Col, Container } from 'react-bootstrap';
import DateRangePickup from '../traveldate-pickup/date-range-pickup';
import PassengerSelector from '../passenger-selector/passenger-selector';
import { CityLookup } from '../lookup/city-lookup';
import {
  hotelSearchCriteriaChangedAction
} from '../../../redux/sagas/shopping-flow-store';
import { addDays } from 'date-fns';
import style from './hotel-search-form.module.scss';

import { storageKeys } from '../../../config/default';

import {UnicornVenueBadge} from "../../components/search-form/unicorn-venue-badge";
import {venueConfig} from "../../components/venue-context/theme-context";

export function HotelSearchForm(props) {
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

  const destinationCityKey = storageKeys.hotels.destination;

  const [initDestination, setInitDestination] = useState(initDest);
  const [destination, setDestination] = useState(initDestination);
  const [departureDate, setDepartureDate] = useState(initDepartureDate);
  const [returnDate, setReturnDate] = useState(initReturnDate);
  const [adults, setAdults] = useState(initAdults);
  const [children, setChildren] = useState(initChildren);
  const [infants, setInfants] = useState(initInfants);

  const showVenueBadge = venueConfig.active && (!destination || (destination && destination.primary !== venueConfig.destinationCity.primary));

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
      if (infants > adults) {
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

  //subscribe for search criteria changes so that we notify others once form is valid
  useEffect(() => {
    const serializeSearchForm = () => {
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
    };

    if (searchCriteriaChanged){
      if (departureDate && !returnDate) {
        setReturnDate(addDays(departureDate, 1))
      }
      let searchCriteria = serializeSearchForm();
      let isSearchFormValid = searchCriteria.isValid;
      //fire action to notify others about search criteria and bool flag with the result of validation
      searchCriteriaChanged(searchCriteria, isSearchFormValid);
    } else {
      console.warn('searchCriteriaChanged is not defined!')
    }
  }, [destination, departureDate, returnDate, adults, children, infants, searchCriteriaChanged, validate]) // <-- here put the parameter to listen

  const onVenueBadgeClick = () => {
    try {
      setInitDestination(venueConfig.destinationCity);
    }catch(err){
      console.error('Failed to set destination',err)
    }
  }

  return (<>
            <Col xs={12} md={3} className={style.formElem}>
              <CityLookup
                initialLocation={initDestination}
                onSelectedLocationChange={setDestination}
                placeHolder='Destination'
                label='Destination/Hotel'
                localstorageKey={destinationCityKey}
              />
              {showVenueBadge && <UnicornVenueBadge isDates={false} onBadgeClick={onVenueBadgeClick}/>}
            </Col>
            <Col xs={12} md={6} className={style.formElem}>
              <DateRangePickup
                onStartDateChanged={setDepartureDate}
                onEndDateChanged={setReturnDate}
                initialStart={initDepartureDate}
                initialEnd={initReturnDate}
                label='When'
                localstorageKey={'traveldates'}
                displayVenueBadge={true}
                destination={destination}
              />
            </Col>
            <Col xs={12} md={3} className={style.formElem}>
              <PassengerSelector
                adults={initAdults}
                children={initChildren}
                infants={initInfants}
                onAdultsChange={setAdults}
                onChildrenChange={setChildren}
                onInfantsChange={setInfants}
                placeholder='guest'
                infantsAllowed={true}
                label='Who'
              />
            </Col>
      </>
  );
}

const mapStateToProps = state => ({});
const mapDispatchToProps = (dispatch) => ({
  searchCriteriaChanged: (searchCriteria, isSearchFormValid) => dispatch(
    hotelSearchCriteriaChangedAction(searchCriteria, isSearchFormValid)
  )
});

export default connect(mapStateToProps, mapDispatchToProps)(HotelSearchForm);
