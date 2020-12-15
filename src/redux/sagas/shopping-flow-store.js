import { createSelector } from 'reselect';

import { all, call, put, takeEvery, select, delay } from 'redux-saga/effects';
import {findFlights, findHotels} from "../../utils/search";
import {getCachedSearchResults} from "../../utils/api-utils";
import {config} from "../../config/default";
import {uiEvent} from "../../utils/events";
import SearchCriteriaBuilder from "../../utils/search-criteria-builder";

/**
 * Search/filtering/results store
 */


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
const RESTORE_RESULTS_FROM_CACHE_COMPLETED = `${moduleName}/RESTORE_RESULTS_FROM_CACHE_COMPLETED`;


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
    isHotelSearchFormValid:false,

    isStoreInitialized: false,
    isRestoreInProgress: false
};

// reducer
export default (state = initialState, action) => {
    const {
        type,
        payload,
        error
    } = action;
    switch (type) {
        case SEARCH_FOR_FLIGHTS:
            return Object.assign({}, state, {
                flightSearchInProgress:true,
                flightSearchResults:null        //remove old search results
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
                hotelSearchInProgress:true,
                hotelSearchResults:null        //remove old search results
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
                isStoreInitialized:true,
                isRestoreInProgress:true,
            });
        case RESTORE_RESULTS_FROM_CACHE_COMPLETED:
            return Object.assign({}, state, {
                isStoreInitialized:true,
                isRestoreInProgress:false,
                hotelSearchResults: payload.hotelSearchResults,
                flightSearchResults: payload.flightSearchResults
            });

        default:
            return state
    }
}

// Actions

//search button clicked - trigger flights search
export const searchForFlightsAction = () => {
    return {
        type: SEARCH_FOR_FLIGHTS
    }
};

//flight search completed - populate results
export const flightSearchCompletedAction = results => ({
    type: FLIGHT_SEARCH_COMPLETED,
    payload: {
        flightSearchResults:results
    }});

//flight search failed - populate results
export const flightSearchFailedAction = error => ({
    type: FLIGHT_SEARCH_FAILED,
    error: error
    });

//flight filters changed
export const applyFlightFilterAction = filters => ({
    type: APPLY_FLIGHTS_FILTER,
    payload: {
        flightFilters:filters
    }
});
//clear filters
export const clearFlightFilterAction = () => ({
    type: CLEAR_FLIGHTS_FILTER
});


//flight search criteria changed (user changed text in search form
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


//hotel search button clicked - trigger offers search action
export const searchForHotelsAction = () => {
    return {
        type: SEARCH_FOR_HOTELS
    }
};
//hotel search completed
export const hotelSearchCompletedAction = results => ({
    type: HOTEL_SEARCH_COMPLETED,
    payload: {
        hotelSearchResults:results
    }});

//hotel search failed
export const hotelSearchFailedAction = error => ({
    type: HOTEL_SEARCH_FAILED,
    error
});

//hotel filters changed
export const applyHotelFilterAction = filters => ({
    type: APPLY_HOTELS_FILTER,
    payload: {
        hotelFilters:filters
    }
});
export const clearHotelsFilterAction = () => ({
    type: CLEAR_HOTELS_FILTER
});

//hotel search criteria changed (user made changed in search form)
export const hotelSearchCriteriaChangedAction = (searchCriteria, isHotelSearchFormValid) => ({
    type: HOTELS_SEARCH_CRITERIA_CHANGED,
    payload: {
        hotelSearchCriteria:searchCriteria,
        isHotelSearchFormValid:isHotelSearchFormValid
    }
});
//request restore search results from server side cache
export const requestSearchResultsRestoreFromCache = () => ({
    type: REQUEST_RESTORE_RESULTS_FROM_CACHE
});

//populate restored search results (from cache) into store
export const searchResultsRestoredFromCache = (flightSearchResults, hotelSearchResults) => {
    return {
        type: RESTORE_RESULTS_FROM_CACHE_COMPLETED,
        payload: {
            flightSearchResults: flightSearchResults,
            hotelSearchResults: hotelSearchResults
        }
    }
}


// Selectors
export const shoppingFlowStateSelector = state => state[moduleName];

export const flightFiltersSelector = createSelector(
    shoppingFlowStateSelector,
    ({ flightFilters }) => flightFilters
);

export const flightSearchCriteriaSelector = createSelector(
    shoppingFlowStateSelector,
    ({ flightSearchCriteria }) => flightSearchCriteria
);

export const flightSearchResultsSelector = createSelector(
    shoppingFlowStateSelector,
    ({ flightSearchResults }) => flightSearchResults
);

export const isFlightSearchInProgressSelector = createSelector(
    shoppingFlowStateSelector,
    ({ flightSearchInProgress }) => flightSearchInProgress
);

export const flightsErrorSelector = createSelector(
    shoppingFlowStateSelector,
    ({ flightsError }) => flightsError
);

export const isFlightSearchFormValidSelector = createSelector(
    shoppingFlowStateSelector,
    ({ flightSearchFormValid }) => flightSearchFormValid
);


export const hotelsFiltersSelector = createSelector(
    shoppingFlowStateSelector,
    ({ hotelFilters }) => hotelFilters
);

export const hotelSearchCriteriaSelector = createSelector(
    shoppingFlowStateSelector,
    ({ hotelSearchCriteria }) => hotelSearchCriteria
);

export const hotelSearchResultsSelector = createSelector(
    shoppingFlowStateSelector,
    ({ hotelSearchResults }) => hotelSearchResults
);

export const isHotelSearchInProgressSelector = createSelector(
    shoppingFlowStateSelector,
    ({ hotelSearchInProgress }) => hotelSearchInProgress
);

export const hotelErrorSelector = createSelector(
    shoppingFlowStateSelector,
    ({ hotelError }) => hotelError
);

export const isHotelSearchFormValidSelector = createSelector(
    shoppingFlowStateSelector,
    ({ isHotelSearchFormValid }) => isHotelSearchFormValid
);


export const isShoppingFlowStoreInitialized = createSelector(
    shoppingFlowStateSelector,
    ({ isStoreInitialized }) => isStoreInitialized
);
export const isShoppingResultsRestoreInProgressSelector = createSelector(
    shoppingFlowStateSelector,
    ({ isRestoreInProgress }) => isRestoreInProgress
);


export function buildFlightsSearchCriteria(origin,destination,departureDate,returnDate, adults,children,infants) {
    const criteriaBuilder = new SearchCriteriaBuilder();
    criteriaBuilder
        .withTransportDepartureFromLocation(origin)
        .withTransportDepartureDate(departureDate)
        .withTransportReturnFromLocation(destination)
        .withPassengers(adults,children,infants);
    if(returnDate) {
        criteriaBuilder.withTransportReturnDate(returnDate);
    }
    const searchCriteria = criteriaBuilder.build();
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
    return searchCriteria;
}


//saga
//call to backend API to search for flights
function* searchForFlightsSaga() {
    try {
        const searchCriteria = yield select(flightSearchCriteriaSelector);
        const {origin:{code:originCode}, destination:{code:destinationCode}, departureDate, returnDate, adults, children, infants} = searchCriteria;
        let searchRequest = buildFlightsSearchCriteria(originCode, destinationCode, departureDate, returnDate, adults, children, infants);
        let results = yield call(findFlights,searchRequest);
        yield put(flightSearchCompletedAction(results));
    } catch (error) {
        console.warn('Failure while searching for flights',error);
        yield put(flightSearchFailedAction(error))
    }
}
//call to backend to search for hotels
function* searchForHotelsSaga() {
    try {
        const searchCriteria = yield select(hotelSearchCriteriaSelector);
        const {destination:{latitude,longitude}, departureDate,returnDate, adults, children, infants} = searchCriteria;
        let searchRequest = buildHotelsSearchCriteria(latitude,longitude,departureDate,returnDate, adults,children,infants)
        let results = yield call(findFlights,searchRequest);
        yield put(hotelSearchCompletedAction(results));
    } catch (error) {
        console.warn('Failure while searching for hotels',error);
        yield put(hotelSearchFailedAction(error))
    }
}
//retrieve search results (flights & hotels) from server side cache (redis)
function* restoreSearchResultsFromCache() {
    console.log('Restore search results')
    //TODO - make it parallel iso sequential
    //restore flight search results
    let flightSearchResults;
    let hotelSearchResults;
    try {
        flightSearchResults = yield call(getCachedSearchResults,'flights');
        // yield put(flightSearchCompletedAction(flightSearchResults?flightSearchResults.data:null));
    } catch (error) {
        //no resuls in cache will also throw error - we can ignore it
    }

    //restore hotel search results
    try {
        hotelSearchResults = yield call(getCachedSearchResults,'hotels');
        // yield put(hotelSearchCompletedAction(hotelSearchResults?hotelSearchResults.data:null));
    } catch (error) {
        //no results in cache will also throw error - we can ignore it
    }
    yield put(searchResultsRestoredFromCache(
        flightSearchResults?flightSearchResults.data:null,
        hotelSearchResults?hotelSearchResults.data:null
        ));
}


// Main saga
export const saga = function*() {
    yield all([
        takeEvery(SEARCH_FOR_FLIGHTS, searchForFlightsSaga),
        takeEvery(SEARCH_FOR_HOTELS, searchForHotelsSaga),
        takeEvery(REQUEST_RESTORE_RESULTS_FROM_CACHE, restoreSearchResultsFromCache)
    ]);
};
