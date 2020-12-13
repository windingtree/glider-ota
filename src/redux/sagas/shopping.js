import { createSelector } from 'reselect';

import { all, call, put, takeEvery, select, delay } from 'redux-saga/effects';
import dummyFlightResults from "../../dc/components/storybook-utils/mock-data/flight_search_BOGMIA.json"
import dummyHotelResults from "../../dc/components/storybook-utils/mock-data/hotel_search_OSLO.json"

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



// Selectors
const stateSelector = state => state[moduleName];

export const flightFiltersSelector = createSelector(
    stateSelector,
    ({ flightFilters }) => flightFilters
);

export const flightSearchCriteriaSelector = createSelector(
    stateSelector,
    ({ flightSearchCriteria }) => flightSearchCriteria
);

export const flightSearchResultsSelector = createSelector(
    stateSelector,
    ({ flightSearchResults }) => flightSearchResults
);

export const isFlightSearchInProgressSelector = createSelector(
    stateSelector,
    ({ flightSearchInProgress }) => flightSearchInProgress
);

export const flightsErrorSelector = createSelector(
    stateSelector,
    ({ flightsError }) => flightsError
);

export const isFlightSearchFormValidSelector = createSelector(
    stateSelector,
    ({ flightSearchFormValid }) => flightSearchFormValid
);



export const hotelsFiltersSelector = createSelector(
    stateSelector,
    ({ hotelFilters }) => hotelFilters
);

export const hotelSearchCriteriaSelector = createSelector(
    stateSelector,
    ({ hotelSearchCriteria }) => hotelSearchCriteria
);

export const hotelSearchResultsSelector = createSelector(
    stateSelector,
    ({ hotelSearchResults }) => hotelSearchResults
);

export const isHotelSearchInProgressSelector = createSelector(
    stateSelector,
    ({ hotelSearchInProgress }) => hotelSearchInProgress
);

export const hotelErrorSelector = createSelector(
    stateSelector,
    ({ hotelError }) => hotelError
);

export const isHotelSearchFormValidSelector = createSelector(
    stateSelector,
    ({ isHotelSearchFormValid }) => isHotelSearchFormValid
);



const delayCall = (ms) => new Promise(res => setTimeout(res, ms))

//saga

function* searchForFlightsSaga() {
    console.log('*searchForFlightsSaga')
    try {
        // yield put(searchForFlightsAction());
        const searchCriteria = yield select(flightSearchCriteriaSelector);
        console.log('*searchForFlightsSaga searchCriteria:',searchCriteria)
        yield delayCall(1000);
        yield put(flightSearchCompletedAction(dummyFlightResults));
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


// Main saga
export const saga = function*() {
    yield all([
        takeEvery(SEARCH_FOR_FLIGHTS, searchForFlightsSaga),
        takeEvery(SEARCH_FOR_HOTELS, searchForHotelsSaga)
    ]);
};
