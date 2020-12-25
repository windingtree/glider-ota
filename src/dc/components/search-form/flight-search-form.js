import React, { useState, useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import { Button, Row, Col, Container, Form } from 'react-bootstrap';
import DateRangePickup from '../traveldate-pickup/date-range-pickup';
import DateSinglePickup from '../traveldate-pickup/date-pickup';
import PassengerSelector from '../passenger-selector/passenger-selector';
import { AirportLookup } from '../lookup/airport-lookup';
import {
  flightSearchCriteriaChangedAction
} from '../../../redux/sagas/shopping-flow-store';
import ReturnTripSelector from '../return-trip-selector';
import style from './flight-search-form.module.scss';

import { storageKeys } from '../../../config/default';

export function FlightsSearchForm(props) {
  // Destructure properties
  const {
    initReturnTrip,
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

  const originAirportKey = storageKeys.flights.origin;
  const destinationAirportKey = storageKeys.flights.destination;

  const [origin, setOrigin] = useState(initOrigin);
  const [destination, setDestination] = useState(initDest);
  const [departureDate, setDepartureDate] = useState(initDepartureDate);
  const [returnDate, setReturnDate] = useState(initReturnDate);
  const [adults, setAdults] = useState(initAdults);
  const [children, setChildren] = useState(initChildren);
  const [infants, setInfants] = useState(initInfants);
  const [isReturnTrip, setReturnTrip] = useState(initReturnTrip);

  const validate = useCallback(() => {
    const isOriginValid = () => {
      return origin!==undefined;
    }

    const isDestinationValid = () => {
      return destination!==undefined;
    }

    const isDepartureDateValid = () => {
      return departureDate!==undefined
    }

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
    }

    const originValid = isOriginValid();
    const destinationValid =  isDestinationValid();
    const departureDateValid = isDepartureDateValid();
    const paxSelectionValid = isPaxSelectionValid();
    const result = originValid && destinationValid && departureDateValid && paxSelectionValid;
    return result;
  }, [adults, children, departureDate, destination, infants, maxPassengers, origin]);

  //subscribe for search criteria changes so that we notify others once form is valid
  useEffect(() => {
    const serializeSearchForm = () => {
      console.log('Dates:',departureDate, returnDate)
      return {
        origin: origin,
        destination: destination,
        departureDate: departureDate,
        returnDate: returnDate,
        adults: adults,
        children: children,
        infants: infants,
        isValid:validate(),
        locationsSource:locationsSource
      };
    }

    if (searchCriteriaChanged) {
      let searchCriteria = serializeSearchForm();
      let isSearchFormValid = searchCriteria.isValid;
      console.log('searchCriteriaChanged', searchCriteria, isSearchFormValid);
      //fire action to notify others about search criteria and bool flag with the result of validation
      searchCriteriaChanged(searchCriteria, isSearchFormValid);
    } else {
      console.warn('searchCriteriaChanged is not defined!')
    }
  }, [locationsSource, origin, destination, departureDate, returnDate, adults, children, infants, searchCriteriaChanged, validate]) // <-- here put the parameter to listen

  useEffect(() => {
    if (!isReturnTrip) {
      setReturnDate(undefined);
    }
  }, [isReturnTrip]);

  return (
    <>
      <Col xs={12} md={3} className={style.formElem}>
        <AirportLookup
          initialLocation={initOrigin}
          onSelectedLocationChange={setOrigin}
          placeHolder='Where from'
          label='From'
          localstorageKey={originAirportKey}
        />
        <div className={style.returnTripSelectorWrapper}>
          <ReturnTripSelector
            label='Round-trip'
            onChange={setReturnTrip}
          />
        </div>
      </Col>
      <Col xs={12} md={3} className={style.formElem}>
        <AirportLookup
          initialLocation={initDest}
          onSelectedLocationChange={setDestination}
          placeHolder='Where to'
          label='To'
          localstorageKey={destinationAirportKey}
        />
      </Col>
      <Col xs={12} md={3} className={style.formElem}>
        {isReturnTrip &&
          <DateRangePickup
            onStartDateChanged={setDepartureDate}
            onEndDateChanged={setReturnDate}
            startPlaceholder={'Departure'}
            endPlaceholder={'Return'}
            initialStart={initDepartureDate}
            initialEnd={initReturnDate}
            label='When'
            localstorageKey={'traveldates'}
            displayVenueBadge={true}
            minimumNights={1}
          />
        }
        {!isReturnTrip &&
          <DateSinglePickup
            onDateChanged={setDepartureDate}
            initialDate={initDepartureDate}
            label='When'
            localstorageKey={'traveldates'}
            displayVenueBadge={true}
          />
        }
      </Col>
      <Col xs={12} md={3} className={style.formElem}>
        <PassengerSelector
          adults={initAdults}
          children={initChildren}
          infants={initInfants}
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

const mapStateToProps = state => ({});
const mapDispatchToProps = (dispatch) => ({
  searchCriteriaChanged: (searchCriteria, isSearchFormValid) => dispatch(
    flightSearchCriteriaChangedAction(searchCriteria, isSearchFormValid)
  )
});

export default connect(mapStateToProps, mapDispatchToProps)(FlightsSearchForm);
