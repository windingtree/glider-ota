import { createSelector } from 'reselect';

import { all, call, put, takeEvery, select, delay } from 'redux-saga/effects';
import dummyFlightResults from "../../dc/components/storybook-utils/mock-data/flight_search_BOGMIA.json"
import dummyHotelResults from "../../dc/components/storybook-utils/mock-data/hotel_search_OSLO.json"
import {findFlights, findHotels} from "../../utils/search";
import {getCachedSearchResults} from "../../utils/api-utils";
import {config} from "../../config/default";
import {uiEvent} from "../../utils/events";
import SearchCriteriaBuilder from "../../utils/search-criteria-builder";

export const moduleName = 'flights';

const FLIGHTS_SEARCH_CRITERIA_CHANGED = `${moduleName}/FLIGHTS_SEARCH_CRITERIA_CHANGED`;
const SEARCH_FOR_FLIGHTS = `${moduleName}/SEARCH_FOR_FLIGHTS`;
const FLIGHT_SEARCH_COMPLETED = `${moduleName}/FLIGHT_SEARCH_COMPLETED`;
const FLIGHT_SEARCH_FAILED = `${moduleName}/FLIGHT_SEARCH_FAILED`;
const APPLY_FLIGHTS_FILTER = `${moduleName}/APPLY_FLIGHTS_FILTER`;
const CLEAR_FLIGHTS_FILTER = `${moduleName}/CLEAR_FLIGHTS_FILTER`;
const ERROR = `${moduleName}/ERROR`;

const HOTELS_SEARCH_CRITERIA_CHANGED = `${moduleName}/HOTELS_SEARCH_CRITERIA_CHANGED`;
const SEARCH_FOR_HOTELS = `${moduleName}/SEARCH_FOR_HOTELS`;
const HOTEL_SEARCH_COMPLETED = `${moduleName}/SEARCH_COMPLETED`;
const HOTEL_SEARCH_FAILED = `${moduleName}/SEARCH_FAILED`;
const APPLY_HOTELS_FILTER = `${moduleName}/APPLY_HOTELS_FILTER`;
const CLEAR_HOTELS_FILTER = `${moduleName}/CLEAR_HOTELS_FILTER`;

const REQUEST_RESTORE_RESULTS_FROM_CACHE = `${moduleName}/RESTORE_RESULTS_FROM_CACHE`;


const initialState = {
    flightFilters: null,
    flightSearchCriteria: null,
    flightSearchResults: null,
    flightSearchInProgress:false,
    flightError:null,
    flightSearchFormValid:false,

    hotelFilters: null,
    hotelSearchCriteria: null,
    hotelSearchResults: null,
    hotelSearchInProgress:false,
    hotelError:null,
    isHotelSearchFormValid:false
};

// reducer
export default (state = initialState, action) => {
    const {
        type,
        payload,
        error
    } = action;
    console.log(`Reducer:${moduleName}, action:`,action)
    switch (type) {
        case SEARCH_FOR_FLIGHTS:
            return Object.assign({}, state, {
                flightSearchInProgress:true
            });
        case FLIGHT_SEARCH_COMPLETED:
            return Object.assign({}, state, {
                flightSearchInProgress:false,
                flightSearchResults: payload.flightSearchResults
            });
        case FLIGHT_SEARCH_FAILED:
            return Object.assign({}, state, {
                flightSearchInProgress:false,
                flightSearchResults: null,
                flightError:error
            });
        case APPLY_FLIGHTS_FILTER:
            return Object.assign({}, state, {
                flightFilters: payload.flightFilters
            });
        case CLEAR_FLIGHTS_FILTER:
            return Object.assign({}, state, {
                flightFilters: null
            });
        case FLIGHTS_SEARCH_CRITERIA_CHANGED:
            return Object.assign({}, state, {
                flightSearchCriteria: payload.flightSearchCriteria,
                flightSearchFormValid:payload.flightSearchFormValid,
            });

        case SEARCH_FOR_HOTELS:
            return Object.assign({}, state, {
                hotelSearchInProgress:true
            });
        case HOTEL_SEARCH_COMPLETED:
            return Object.assign({}, state, {
                hotelSearchInProgress:false,
                hotelSearchResults: payload.hotelSearchResults
            });
        case HOTEL_SEARCH_FAILED:
            return Object.assign({}, state, {
                hotelSearchInProgress:false,
                hotelSearchResults: null,
                error:error
            });
        case APPLY_HOTELS_FILTER:
            return Object.assign({}, state, {
                hotelFilters: payload.hotelFilters
            });
        case CLEAR_HOTELS_FILTER:
            return Object.assign({}, state, {
                hotelFilters: null
            });
        case HOTELS_SEARCH_CRITERIA_CHANGED:
            return Object.assign({}, state, {
                hotelSearchCriteria: payload.hotelSearchCriteria,
                isHotelSearchFormValid:payload.isHotelSearchFormValid,
            });
        case REQUEST_RESTORE_RESULTS_FROM_CACHE:
            return Object.assign({}, state, {
                flightSearchInProgress: true,
                hotelSearchInProgress: true
            });

        default:
            return state
    }
}

// Actions

//search button clicked - trigger offers search action
export const searchForFlightsAction = () => {
    console.log('Searching')

    return {
        type: SEARCH_FOR_FLIGHTS
    }
};

export const flightSearchCompletedAction = results => ({
    type: FLIGHT_SEARCH_COMPLETED,
    payload: {
        flightSearchResults:results
    }});

export const flightSearchFailedAction = error => ({
    type: FLIGHT_SEARCH_FAILED,
    error: error
    });
export const applyFlightFilterAction = filters => ({
    type: APPLY_FLIGHTS_FILTER,
    payload: {
        flightFilters:filters
    }
});
export const clearFlightFilterAction = () => ({
    type: CLEAR_FLIGHTS_FILTER
});

export const flightSearchCriteriaChangedAction = (searchCriteria, isSearchFormValid) => ({
    type: FLIGHTS_SEARCH_CRITERIA_CHANGED,
    payload: {
        flightSearchCriteria:searchCriteria,
        flightSearchFormValid:isSearchFormValid
    }
});
export const errorAction= error => ({
    type: ERROR,
    error: error
});


//search button clicked - trigger offers search action
export const searchForHotelsAction = () => {
    console.log('Searching')
    return {
        type: SEARCH_FOR_HOTELS
    }
};

export const hotelSearchCompletedAction = results => ({
    type: HOTEL_SEARCH_COMPLETED,
    payload: {
        hotelSearchResults:results
    }});
export const hotelSearchFailedAction = error => ({
    type: HOTEL_SEARCH_FAILED,
    error
});
export const applyHotelFilterAction = filters => ({
    type: APPLY_HOTELS_FILTER,
    payload: {
        hotelFilters:filters
    }
});
export const clearHotelsFilterAction = () => ({
    type: CLEAR_HOTELS_FILTER
});

export const hotelSearchCriteriaChangedAction = (searchCriteria, isHotelSearchFormValid) => ({
    type: HOTELS_SEARCH_CRITERIA_CHANGED,
    payload: {
        hotelSearchCriteria:searchCriteria,
        isHotelSearchFormValid:isHotelSearchFormValid
    }
});


export const requestSearchResultsRestoreFromCache = () => ({
    type: REQUEST_RESTORE_RESULTS_FROM_CACHE
});



// Selectors
export const shoppingStateSelector = state => state[moduleName];

export const flightFiltersSelector = createSelector(
    shoppingStateSelector,
    ({ flightFilters }) => flightFilters
);

export const flightSearchCriteriaSelector = createSelector(
    shoppingStateSelector,
    ({ flightSearchCriteria }) => flightSearchCriteria
);

export const flightSearchResultsSelector = createSelector(
    shoppingStateSelector,
    ({ flightSearchResults }) => flightSearchResults
);

export const isFlightSearchInProgressSelector = createSelector(
    shoppingStateSelector,
    ({ flightSearchInProgress }) => flightSearchInProgress
);

export const flightsErrorSelector = createSelector(
    shoppingStateSelector,
    ({ flightsError }) => flightsError
);

export const isFlightSearchFormValidSelector = createSelector(
    shoppingStateSelector,
    ({ flightSearchFormValid }) => flightSearchFormValid
);



export const hotelsFiltersSelector = createSelector(
    shoppingStateSelector,
    ({ hotelFilters }) => hotelFilters
);

export const hotelSearchCriteriaSelector = createSelector(
    shoppingStateSelector,
    ({ hotelSearchCriteria }) => hotelSearchCriteria
);

export const hotelSearchResultsSelector = createSelector(
    shoppingStateSelector,
    ({ hotelSearchResults }) => hotelSearchResults
);

export const isHotelSearchInProgressSelector = createSelector(
    shoppingStateSelector,
    ({ hotelSearchInProgress }) => hotelSearchInProgress
);

export const hotelErrorSelector = createSelector(
    shoppingStateSelector,
    ({ hotelError }) => hotelError
);

export const isHotelSearchFormValidSelector = createSelector(
    shoppingStateSelector,
    ({ isHotelSearchFormValid }) => isHotelSearchFormValid
);



const delayCall = (ms) => new Promise(res => setTimeout(res, ms))




export async function searchForFlightsWithCriteria(criteria){
    return searchForFlights(criteria.origin.code, criteria.destination.code, criteria.departureDate, criteria.returnDate, criteria.adults, criteria.children, criteria.infants);
}

export async function searchForFlights(originCode, destinationCode, departureDate, returnDate, adults, children, infants){
    let searchRequest;
    // if(!config.OFFLINE_MODE) { //no need to fill search criteria in OFFLINE_MODE
    searchRequest = buildFlightsSearchCriteria(originCode, destinationCode, departureDate, returnDate, adults, children, infants);
    // }
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


const searchForFlightsAsync = (searchCriteria) => {
}

//saga

function* searchForFlightsSaga() {
    console.log('*searchForFlightsSaga')
    try {
        // yield put(searchForFlightsAction());
        const searchCriteria = yield select(flightSearchCriteriaSelector);
        console.log('*searchForFlightsSaga searchCriteria:',searchCriteria)
        const {origin:{code:originCode}, destination:{code:destinationCode}, departureDate, returnDate, adults, children, infants} = searchCriteria;
        let searchRequest = buildFlightsSearchCriteria(originCode, destinationCode, departureDate, returnDate, adults, children, infants);
        console.log('*searchForFlightsSaga searchRequest:',searchRequest)
        let results = yield call(findFlights,searchRequest);
        // yield delayC/**/all(1000);
        yield put(flightSearchCompletedAction(results));
    } catch (error) {
        yield put(flightSearchFailedAction(error))
    }
}

function* searchForHotelsSaga() {
    console.log('*searchForHotelsSaga')
    try {
        // yield put(searchForFlightsAction());
        const searchCriteria = yield select(hotelSearchCriteriaSelector);
        console.log('*searchForHotelsSaga searchCriteria:',searchCriteria)
        yield delayCall(1000);
        yield put(hotelSearchCompletedAction(dummyHotelResults));
    } catch (error) {
        yield put(hotelSearchFailedAction(error))
    }
}



function* restoreSearchResultsFromCache() {
    console.log('*restoreSearchResultsFromCache')
    try {
        // yield put(searchForFlightsAction());
        const flightSearchResults = yield call(getCachedSearchResults,'flights');
        console.log('*restoreSearchResultsFromCache - flight search results retrieved:',flightSearchResults)
        if(flightSearchResults){
            yield put(flightSearchCompletedAction(flightSearchResults.data));
        }
    } catch (error) {
        console.log('*restoreCartFromServerSideSaga failed, error:',error)
        yield put(flightSearchFailedAction(error))
        yield put(errorAction(error))
    }
    try {
        // yield put(searchForFlightsAction());
        const hotelSearchResults = yield call(getCachedSearchResults,'hotels');
        console.log('*restoreSearchResultsFromCache - hotel search results retrieved:',hotelSearchResults)
        if(hotelSearchResults){
            yield put(hotelSearchCompletedAction(hotelSearchResults.data));
        }
    } catch (error) {
        console.log('*restoreCartFromServerSideSaga failed, error:',error)
        yield put(hotelSearchFailedAction(error))
        yield put(errorAction(error))
    }
}


// Main saga
export const saga = function*() {
    yield all([
        takeEvery(SEARCH_FOR_FLIGHTS, searchForFlightsSaga),
        takeEvery(SEARCH_FOR_HOTELS, searchForHotelsSaga),
        takeEvery(REQUEST_RESTORE_RESULTS_FROM_CACHE, restoreSearchResultsFromCache)
    ]);
};
