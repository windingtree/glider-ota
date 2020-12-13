import { createSelector } from 'reselect';

import { all, call, put, takeEvery, select, delay } from 'redux-saga/effects';
import {errorAction, restoreCartAction, shoppingCartStateSelector} from './cart'
import {retrievePassengerDetails, getOffer} from "../../utils/api-utils";
export const moduleName = 'booking';

const RETRIEVE_PASSENGER_DETAILS = `${moduleName}/RETRIEVE_PASSENGER_DETAILS`;
const STORE_PASSENGER_DETAILS = `${moduleName}/STORE_PASSENGER_DETAILS`;
const TEST = `${moduleName}/STORE_PASSENGER_DETAILS`;

const initialState = {
    flightOffer: null,
    hotelOffer: null,
    error:null,
    currentStep:null,
    passengers:null,
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
        case RETRIEVE_PASSENGER_DETAILS:
            return Object.assign({}, state, {
                passengers:payload.passengers
            });
        default:
            return state
    }
}

// Actions

export const setCurrentStepAction = (currentStep) => {
    console.log('setCurrentStepAction')
    return {
        type: TEST,
        payload: {
            currentStep:currentStep
        }
    }
};

// Selectors

const stateSelector = state => {
    console.log(`stateSelector for module ${moduleName}, state:`,state)
    return state[moduleName];
}

export const currentStepSelector = createSelector(
    stateSelector,
    ({ step }) => step
);
export const cartContentsSelector = createSelector(
    shoppingCartStateSelector,
    ({flightOffer, hotelOffer}) => {
        return {flightOffer: flightOffer, hotelOffer: hotelOffer}
    }
);

//retrieving passengers from either search results(in case passenger did not fill pax details) or cart (in case pax details were provided already)

const fetchPaxDetails = async (offerId) => {
    let cartPassengerDetails;
    try {
        cartPassengerDetails = await retrievePassengerDetails();
    }catch(err){
        console.error('Cannot retrieve passenger details from cart',err);
    }
    let searchCriteriaPassengerDetails;
    try {
        // cartPassengerDetails = await retrievePassengerDetails();
    }catch(err){
        console.error('Cannot retrieve passenger details from cart',err);
    }


}

//saga

// Main saga
export const saga = function*() {
    yield all([
        // takeEvery(RETRIEVE_PASSENGER_DETAILS, restoreCartFromServerSideSaga)
    ]);
};

