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


const initialState = {
    filters: null,
    searchCriteria: null,
    searchResults: null,
    searchInProgress:false,
    error:null,
    isSearchFormValid:false
};

// reducer
export default (state = initialState, action) => {
    const {
        type,
        payload,
        error
    } = action;
    console.log('Reducer, action:',action)
    switch (type) {
        case SEARCH_FOR_FLIGHTS:
            return Object.assign({}, state, {
                searchInProgress:true
            });
        case SEARCH_COMPLETED:
            return Object.assign({}, state, {
                searchInProgress:false,
                searchResults: payload.searchResults
            });
        case SEARCH_FAILED:
            return Object.assign({}, state, {
                searchInProgress:false,
                searchResults: null,
                error:error
            });
        case APPLY_FLIGHTS_FILTER:
            return Object.assign({}, state, {
                filters: payload.filters
            });
        case CLEAR_FLIGHTS_FILTER:
            return Object.assign({}, state, {
                filters: null
            });
        case FLIGHTS_SEARCH_CRITERIA_CHANGED:
            return Object.assign({}, state, {
                searchCriteria: payload.searchCriteria,
                isSearchFormValid:payload.isSearchFormValid,
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

export const searchCompletedAction = results => ({
    type: SEARCH_COMPLETED,
    payload: {
        searchResults:results
    }});
export const searchFailedAction = error => ({
    type: SEARCH_FAILED,
    error
    });
export const applyFilterAction = filters => ({
    type: APPLY_FLIGHTS_FILTER,
    payload: {
        filters:filters
    }
});
export const clearFilterAction = () => ({
    type: CLEAR_FLIGHTS_FILTER
});

export const searchCriteriaChangedAction = (searchCriteria, isSearchFormValid) => ({
    type: FLIGHTS_SEARCH_CRITERIA_CHANGED,
    payload: {
        searchCriteria:searchCriteria,
        isSearchFormValid:isSearchFormValid
    }
});

// Selectors

const stateSelector = state => state[moduleName];

export const flightFiltersSelector = createSelector(
    stateSelector,
    ({ filters }) => filters
);

export const searchCriteriaSelector = createSelector(
    stateSelector,
    ({ searchCriteria }) => searchCriteria
);

export const searchResultsSelector = createSelector(
    stateSelector,
    ({ searchResults }) => searchResults
);

export const isSearchInProgressSelector = createSelector(
    stateSelector,
    ({ searchInProgress }) => searchInProgress
);

export const errorSelector = createSelector(
    stateSelector,
    ({ error }) => error
);

export const isSearchFormValidSelector = createSelector(
    stateSelector,
    ({ isSearchFormValid }) => isSearchFormValid
);

const delayCall = (ms) => new Promise(res => setTimeout(res, ms))

//saga

function* searchForFlightsSaga() {
    console.log('*searchForFlightsSaga')
    try {
        // yield put(searchForFlightsAction());
        const searchCriteria = yield select(searchCriteriaSelector);
        console.log('*searchForFlightsSaga searchCriteria:',searchCriteria)
        yield delayCall(1000);
        yield put(searchCompletedAction(dummyResults));
    } catch (error) {
        yield put(searchFailedAction(error))
    }
}


// Main saga
export const saga = function*() {
    yield all([
        takeEvery(SEARCH_FOR_FLIGHTS, searchForFlightsSaga)
    ]);
};
