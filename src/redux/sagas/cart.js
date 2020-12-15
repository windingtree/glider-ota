import { createSelector } from 'reselect';
import { all, call, put, takeEvery, select} from 'redux-saga/effects';
import {
    shoppingStateSelector
} from "./shopping";
import {storeItemInCart, retrieveItemFromCart, storeOfferId, retrieveCart} from "../../utils/api-utils"

/**
 * Shopping cart & booking flow store
 */

export const moduleName = 'cart';

//cart related actions
const ADD_FLIGHT_TO_CART = `${moduleName}/ADD_FLIGHT_TO_CART`;
const ADD_HOTEL_TO_CART = `${moduleName}/ADD_HOTEL_TO_CART`;
const DELETE_FLIGHT_FROM_CART = `${moduleName}/DELETE_FLIGHT_FROM_CART`;
const DELETE_HOTEL_FROM_CART = `${moduleName}/DELETE_HOTEL_FROM_CART`;
const BOOK = `${moduleName}/BOOK`;
const STORE_CART_ON_SERVER = `${moduleName}/STORE_CART_ON_SERVER`;
const RESTORE_CART_FROM_SERVER = `${moduleName}/RESTORE_CART_FROM_SERVER`;
const RESTORE = `${moduleName}/RESTORE`;
const ERROR = `${moduleName}/ERROR`;

//booking flow related actions
const RETRIEVE_PASSENGER_DETAILS = `${moduleName}/RETRIEVE_PASSENGER_DETAILS`;
const STORE_PASSENGER_DETAILS = `${moduleName}/STORE_PASSENGER_DETAILS`;
const SELECT_FLIGHT_OFFER = `${moduleName}/SELECT_OFFER`;



const initialState = {
    flightOffer: null,
    hotelOffer: null,
    error:null,
    paxSearchCriteria:null,
    isUpdateInProgress:false,
    passengers:null
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
                isUpdateInProgress: true
            });
        case ADD_HOTEL_TO_CART:
            return Object.assign({}, state, {
                isUpdateInProgress: true
            });
        case DELETE_FLIGHT_FROM_CART:
            return Object.assign({}, state, {
                isUpdateInProgress: true
            });
        case DELETE_HOTEL_FROM_CART:
            return Object.assign({}, state, {
                isUpdateInProgress: true
            });
        case RESTORE:
            return Object.assign({}, state, {
                flightOffer: payload.flightOffer,
                hotelOffer: payload.hotelOffer,
                isUpdateInProgress: false,
            });
        case BOOK:
            return state;

        case RETRIEVE_PASSENGER_DETAILS:
            return Object.assign({}, state, {
                passengers: payload.passengers
            });

        default:
            return state
    }
}

// Actions

export const addFlightToCartAction = (offerId) => {
    const flightOffer = {
        offerId:offerId
    }
    return {
        type: ADD_FLIGHT_TO_CART,
        payload: {
            offerId:offerId,
            type:'TRANSPORTATION_OFFER',
            flightOffer:flightOffer
        }
    }
};

export const addHotelToCartAction = (offerId) => {
    const hotelOffer = {
        offerId:offerId
    }
    return {
        type: ADD_HOTEL_TO_CART,
        payload: {
            offerId:offerId,
            type:'ACCOMMODATION_OFFER',
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
    return {
        type: BOOK
    }
};


export const storeCartOnServerAction = () => {
    return {
        type: STORE_CART_ON_SERVER
    }
};

export const restoreCartFromServerAction = () => {
    return {
        type: RESTORE_CART_FROM_SERVER
    }
};

export const restoreCartAction = (flightOffer, hotelOffer) => {
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


export const flightResultsSelector = createSelector(
    shoppingStateSelector,
    ({flightSearchResults}) => flightSearchResults
);

export const isUpdateInProgressSelector = createSelector(
    shoppingStateSelector,
    ({isUpdateInProgress}) => isUpdateInProgress
);

export const isShoppingResultsRestoreInProgressSelector = createSelector(
    shoppingStateSelector,
    ({isRestoreInProgressSelector}) => isRestoreInProgressSelector
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
    try {
        // yield put(searchForFlightsAction());
        const data = yield select(storeToSyncSelector);
        yield call(storeCartOnServerSide, data);
    } catch (error) {
        console.log('*storeCartOnServerSideSaga failed, error:',error)
        yield put(errorAction(error))
    }
}

function* restoreCartFromServerSideSaga() {
    console.log('*restoreCartFromServerSideSaga')
    try {
        const itemsInCart = yield call(retrieveCart);
        console.log('Response from itemsInCart:',itemsInCart)
        let flightOffer=null;
        let hotelOffer=null;
        if(itemsInCart && itemsInCart.items){
            let items = itemsInCart.items;
            flightOffer = items['TRANSPORTATION_OFFER'] ? items['TRANSPORTATION_OFFER'].item:null;
            hotelOffer = items['ACCOMMODATION_OFFER'] ? items['ACCOMMODATION_OFFER'].item:null;
        }
        yield put(restoreCartAction(flightOffer, hotelOffer))

    } catch (error) {
        console.log('*restoreCartFromServerSideSaga failed, error:',error)
        yield put(errorAction(error))
    }
}

function* addOfferIdToCart({payload}) {
    console.log('*addOfferIdToCart, payload=',payload)
    try {
        const {offerId, type} = payload;
        const data = yield call(storeOfferId, offerId, type );
        console.log('Response from add to cart:',data)
        const itemsInCart = yield call(retrieveCart);
        console.log('Response from itemsInCart:',itemsInCart)
        let flightOffer=null;
        let hotelOffer=null;
        if(itemsInCart && itemsInCart.items){
            let items = itemsInCart.items;
             flightOffer = items['TRANSPORTATION_OFFER'] ? items['TRANSPORTATION_OFFER'].item:null;
             hotelOffer = items['ACCOMMODATION_OFFER'] ? items['ACCOMMODATION_OFFER'].item:null;
        }
        yield put(restoreCartAction(flightOffer, hotelOffer))
    } catch (error) {
        console.log('*restoreCartFromServerSideSaga failed, error:',error)
        // yield put(errorAction(error))
    }
}


// Main saga
export const saga = function*() {
    yield all([
        takeEvery(STORE_CART_ON_SERVER, storeCartOnServerSideSaga),
        takeEvery(ADD_FLIGHT_TO_CART, addOfferIdToCart),
        takeEvery(ADD_HOTEL_TO_CART, addOfferIdToCart),
        takeEvery(RESTORE_CART_FROM_SERVER, restoreCartFromServerSideSaga)
    ]);
};


