import { createSelector } from 'reselect';

import { all, call, put, takeEvery, select, delay } from 'redux-saga/effects';
import dummyResults from "../../dc/components/storybook-utils/mock-data/hotel_search_OSLO.json"
export const moduleName = 'hotels';

const HOTELS_SEARCH_CRITERIA_CHANGED = `${moduleName}/HOTELS_SEARCH_CRITERIA_CHANGED`;
const SEARCH_FOR_HOTELS = `${moduleName}/SEARCH_FOR_HOTELS`;
const SEARCH_COMPLETED = `${moduleName}/SEARCH_COMPLETED`;
const SEARCH_FAILED = `${moduleName}/SEARCH_FAILED`;
const APPLY_HOTELS_FILTER = `${moduleName}/APPLY_HOTELS_FILTER`;
const CLEAR_HOTELS_FILTER = `${moduleName}/CLEAR_HOTELS_FILTER`;


const initialState = {
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
        case SEARCH_FOR_HOTELS:
            return Object.assign({}, state, {
                hotelSearchInProgress:true
            });
        case SEARCH_COMPLETED:
            return Object.assign({}, state, {
                hotelSearchInProgress:false,
                hotelSearchResults: payload.hotelSearchResults
            });
        case SEARCH_FAILED:
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
export const searchForHotelsAction = () => {
    console.log('Searching')
    return {
        type: SEARCH_FOR_HOTELS
    }
};

export const hotelSearchCompletedAction = results => ({
    type: SEARCH_COMPLETED,
    payload: {
        hotelSearchResults:results
    }});
export const hotelSearchFailedAction = error => ({
    type: SEARCH_FAILED,
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

function* searchForHotelsSaga() {
    console.log('*searchForHotelsSaga')
    try {
        // yield put(searchForFlightsAction());
        const searchCriteria = yield select(hotelSearchCriteriaSelector);
        console.log('*searchForHotelsSaga searchCriteria:',searchCriteria)
        yield delayCall(1000);
        yield put(hotelSearchCompletedAction(dummyResults));
    } catch (error) {
        yield put(hotelSearchFailedAction(error))
    }
}


// Main saga
export const saga = function*() {
    yield all([
        takeEvery(SEARCH_FOR_HOTELS, searchForHotelsSaga)
    ]);
};
