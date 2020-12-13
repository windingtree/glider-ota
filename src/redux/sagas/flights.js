import { createSelector } from 'reselect';

import { all, call, put, takeEvery, select, delay } from 'redux-saga/effects';
import dummyResults from "../../dc/components/storybook-utils/mock-data/flight_search_BOGMIA.json"
export const moduleName = 'flights';

const FLIGHTS_SEARCH_CRITERIA_CHANGED = `${moduleName}/FLIGHTS_SEARCH_CRITERIA_CHANGED`;
const SEARCH_FOR_FLIGHTS = `${moduleName}/SEARCH_FOR_FLIGHTS`;
const SEARCH_COMPLETED = `${moduleName}/SEARCH_COMPLETED`;
const SEARCH_FAILED = `${moduleName}/SEARCH_FAILED`;
const APPLY_FLIGHTS_FILTER = `${moduleName}/APPLY_FLIGHTS_FILTER`;
const CLEAR_FLIGHTS_FILTER = `${moduleName}/CLEAR_FLIGHTS_FILTER`;
const ERROR = `${moduleName}/ERROR`;


const initialState = {
    flightFilters: null,
    flightSearchCriteria: null,
    flightSearchResults: null,
    flightSearchInProgress:false,
    flightError:null,
    flightSearchFormValid:false
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
        case SEARCH_COMPLETED:
            return Object.assign({}, state, {
                flightSearchInProgress:false,
                flightSearchResults: payload.flightSearchResults
            });
        case SEARCH_FAILED:
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
        case ERROR:
            return Object.assign({}, state, {
                flightError: error
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
    type: SEARCH_COMPLETED,
    payload: {
        flightSearchResults:results
    }});
export const flightSearchFailedAction = error => ({
    type: SEARCH_FAILED,
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

const delayCall = (ms) => new Promise(res => setTimeout(res, ms))

//saga

function* searchForFlightsSaga() {
    console.log('*searchForFlightsSaga')
    try {
        // yield put(searchForFlightsAction());
        const searchCriteria = yield select(flightSearchCriteriaSelector);
        console.log('*searchForFlightsSaga searchCriteria:',searchCriteria)
        yield delayCall(1000);
        yield put(flightSearchCompletedAction(dummyResults));
    } catch (error) {
        yield put(flightSearchFailedAction(error))
    }
}


// Main saga
export const saga = function*() {
    yield all([
        takeEvery(SEARCH_FOR_FLIGHTS, searchForFlightsSaga)
    ]);
};
