import { createSelector } from 'reselect';

import { all, call, put, takeEvery, select, delay } from 'redux-saga/effects';
export const moduleName = 'cart';

const ADD_FLIGHT_TO_CART = `${moduleName}/ADD_FLIGHT_TO_CART`;
const ADD_HOTEL_TO_CART = `${moduleName}/ADD_HOTEL_TO_CART`;
const DELETE_FLIGHT_FROM_CART = `${moduleName}/DELETE_FLIGHT_FROM_CART`;
const DELETE_HOTEL_FROM_CART = `${moduleName}/DELETE_HOTEL_FROM_CART`;
const BOOK = `${moduleName}/BOOK`;

const initialState = {
    flightOffer: null,
    hotelOffer: null,
    error:null,
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
        case ADD_FLIGHT_TO_CART:
            return Object.assign({}, state, {
                flightOffer:payload.offer
            });
        case ADD_HOTEL_TO_CART:
            return Object.assign({}, state, {
                hotelOffer:payload.offer
            });
        case DELETE_FLIGHT_FROM_CART:
            return Object.assign({}, state, {
                flightOffer:null
            });
        case DELETE_HOTEL_FROM_CART:
            return Object.assign({}, state, {
                hotelOffer: null
            });
        case BOOK:
            return state;
        default:
            return state
    }
}

// Actions

export const addFlightToCartAction = (offer) => {
    console.log('addFlightToCartAction')
    return {
        type: ADD_FLIGHT_TO_CART,
        payload: {
            offer:offer
        }
    }
};

export const addHotelToCartAction = (offer) => {
    return {
        type: ADD_HOTEL_TO_CART,
        payload: {
            offer:offer
        }
    }
};
export const deleteFlightFromCart = () => {
    return {
        type: DELETE_FLIGHT_FROM_CART
    }
};
export const deleteHotelFromCart = () => {
    return {
        type: DELETE_HOTEL_FROM_CART
    }
};

export const bookAction = () => {
    console.log('bookAction')
    return {
        type: BOOK
    }
};

// Selectors

const stateSelector = state => state[moduleName];

export const flightOfferSelector = createSelector(
    stateSelector,
    ({ flightOffer }) => flightOffer
);

export const hotelOfferSelector = createSelector(
    stateSelector,
    ({ hotelOffer }) => hotelOffer
);

export const errorSelector = createSelector(
    stateSelector,
    ({ error }) => error
);


