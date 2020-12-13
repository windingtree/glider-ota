import { createSelector } from 'reselect';

import { all, call, put, takeEvery, select, delay } from 'redux-saga/effects';
import dummyResults from "../../dc/components/storybook-utils/mock-data/flight_search_BOGMIA.json";
import {searchCompletedAction, flightSearchCriteriaSelector, searchFailedAction} from "./shopping";
import {storeItemInCart, retrieveItemFromCart} from "../../utils/api-utils"
export const moduleName = 'cart';

const ADD_FLIGHT_TO_CART = `${moduleName}/ADD_FLIGHT_TO_CART`;
const ADD_HOTEL_TO_CART = `${moduleName}/ADD_HOTEL_TO_CART`;
const DELETE_FLIGHT_FROM_CART = `${moduleName}/DELETE_FLIGHT_FROM_CART`;
const DELETE_HOTEL_FROM_CART = `${moduleName}/DELETE_HOTEL_FROM_CART`;
const BOOK = `${moduleName}/BOOK`;
const STORE_CART_ON_SERVER = `${moduleName}/STORE_CART_ON_SERVER`;
const RESTORE_CART_FROM_SERVER = `${moduleName}/RESTORE_CART_FROM_SERVER`;
const RESTORE = `${moduleName}/RESTORE`;
const ERROR = `${moduleName}/ERROR`;

const initialState = {
    flightOffer: null,
    hotelOffer: null,
    error:null,
    paxSearchCriteria:null,
    isCartSynced:false
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
        case ERROR:
            return Object.assign({}, state, {
                error:error
            });
        case ADD_FLIGHT_TO_CART:
            return Object.assign({}, state, {
                flightOffer:payload.flightOffer,
                isCartSynced:false,
            });
        case ADD_HOTEL_TO_CART:
            return Object.assign({}, state, {
                hotelOffer:payload.hotelOffer,
                isCartSynced:false,
            });
        case DELETE_FLIGHT_FROM_CART:
            return Object.assign({}, state, {
                flightOffer:null,
                isCartSynced:false,
            });
        case DELETE_HOTEL_FROM_CART:
            return Object.assign({}, state, {
                hotelOffer: null,
                isCartSynced:false,
            });
        case RESTORE:
            return Object.assign({}, state, {
                flightOffer: payload.flightOffer,
                hotelOffer: payload.hotelOffer,
                isCartSynced:true
            });
        case BOOK:
            return state;
        default:
            return state
    }
}

// Actions

export const addFlightToCartAction = (offerId, offer, price, itineraries) => {
    console.log('addFlightToCartAction')
    const flightOffer = {
        offerId:offerId, offer:offer, price:price, itineraries:itineraries
    }
    return {
        type: ADD_FLIGHT_TO_CART,
        payload: {
            flightOffer:flightOffer
        }
    }
};

export const addHotelToCartAction = (offerId, room, hotel, price) => {
    const hotelOffer = {
        offerId:offerId,
        price:price,
        room: room,
        hotel: hotel
    }
    return {
        type: ADD_HOTEL_TO_CART,
        payload: {
            hotelOffer:hotelOffer
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


export const storeCartOnServerAction = () => {
    console.log('storeCartOnServerAction')
    return {
        type: STORE_CART_ON_SERVER
    }
};

export const restoreCartFromServerAction = () => {
    console.log('restoreCartFromServerAction')
    return {
        type: RESTORE_CART_FROM_SERVER
    }
};

export const restoreCartAction = (flightOffer, hotelOffer) => {
    console.log('restoreCart')
    return {
        type: RESTORE,
        payload: {
            flightOffer:flightOffer,
            hotelOffer: hotelOffer
        }
    }
};



export const errorAction= error => ({
    type: ERROR,
    error
});
// Selectors

export const shoppingCartStateSelector = state => state[moduleName];

export const flightOfferSelector = createSelector(
    shoppingCartStateSelector,
    ({ flightOffer }) => flightOffer
);

export const hotelOfferSelector = createSelector(
    shoppingCartStateSelector,
    ({ hotelOffer }) => hotelOffer
);

export const errorSelector = createSelector(
    shoppingCartStateSelector,
    ({ error }) => error
);

export const storeToSyncSelector = createSelector(
    shoppingCartStateSelector,
    ({flightOffer, hotelOffer}) => {
        return {flightOffer:flightOffer, hotelOffer:hotelOffer}
    }
);


//logic to store/retrieve cart to/from server side
const storeCartOnServerSide = async (itemsInCart) => {
    await storeItemInCart('cart', itemsInCart)
}

const restoreCartFromServerSide = async () => {
    let data = await retrieveItemFromCart('cart')
    return data;
}

//saga

function* storeCartOnServerSideSaga() {
    console.log('*storeCartOnServerSideSaga')
    try {
        // yield put(searchForFlightsAction());
        const data = yield select(storeToSyncSelector);
        console.log('*storeCartOnServerSideSaga data to sync:',data)
        yield call(storeCartOnServerSide, data);
        console.log('*storeCartOnServerSideSaga sync completed')
    } catch (error) {
        console.log('*storeCartOnServerSideSaga failed, error:',error)
        yield put(errorAction(error))
    }
}

function* restoreCartFromServerSideSaga() {
    console.log('*restoreCartFromServerSideSaga')
    try {
        // yield put(searchForFlightsAction());
        const data = yield call(restoreCartFromServerSide);
        console.log('*restoreCartFromServerSideSaga data retrieved:',data)
        if(data){
            // yield restoreCartAction(data);
            const {flightOffer, hotelOffer} = data;
            yield put(restoreCartAction(flightOffer, hotelOffer))
        }

    } catch (error) {
        console.log('*restoreCartFromServerSideSaga failed, error:',error)
        yield put(errorAction(error))
    }
}


// Main saga
export const saga = function*() {
    yield all([
        takeEvery(STORE_CART_ON_SERVER, storeCartOnServerSideSaga),
        takeEvery(RESTORE_CART_FROM_SERVER, restoreCartFromServerSideSaga)
    ]);
};

let a = {
    offerId: "42ad23de-fdf5-4bf2-8d85-9c6ad7f3539e",
    passengers: {
        F1A28DBA: {
            type: "ADT"
        }
    }

}
