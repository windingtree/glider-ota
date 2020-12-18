import { createSelector } from 'reselect';
import { all, call, put, takeEvery, select} from 'redux-saga/effects';
import {
    shoppingFlowStateSelector
} from "./shopping-flow-store";
import {
    storeItemInCart,
    retrieveItemFromCart,
    storeOfferId,
    retrieveCart,
    deleteItemInCart
} from "../../utils/api-utils"

/**
 * Shopping cart & booking flow store
 */

export const moduleName = 'cart';

//cart related actions
const ADD_FLIGHT_TO_CART = `${moduleName}/ADD_FLIGHT_TO_CART`;
const ADD_HOTEL_TO_CART = `${moduleName}/ADD_HOTEL_TO_CART`;
const DELETE_FLIGHT_FROM_CART = `${moduleName}/DELETE_FLIGHT_FROM_CART`;
const DELETE_HOTEL_FROM_CART = `${moduleName}/DELETE_HOTEL_FROM_CART`;
const CLEAR_CART = `${moduleName}/CLEAR_CART`;
const BOOK = `${moduleName}/BOOK`;
const STORE_CART_ON_SERVER = `${moduleName}/STORE_CART_ON_SERVER`;
const REQUEST_RESTORE_CART_FROM_SERVER = `${moduleName}/REQUEST_RESTORE_CART_FROM_SERVER`;
const CART_RESTORED_FROM_SERVER = `${moduleName}/CART_RESTORED_FROM_SERVER`;
const CART_ACTION_FAILED = `${moduleName}/CART_ACTION_FAILED`;
const ERROR = `${moduleName}/ERROR`;

//booking flow related actions
const RETRIEVE_PASSENGER_DETAILS = `${moduleName}/RETRIEVE_PASSENGER_DETAILS`;



const initialState = {
    flightOffer: null,
    hotelOffer: null,
    error:null,
    paxSearchCriteria:null,
    isUpdateInProgress:false,
    isShoppingCartInitialized:false,
    passengers:null
};

// reducer
export default (state = initialState, action) => {
    const {
        type,
        payload,
        error
    } = action;
    // console.log(`Reducer:${moduleName}, action:`,action)
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
        case CLEAR_CART:
            return Object.assign({}, state, {
                isUpdateInProgress: true
            });
        case CART_RESTORED_FROM_SERVER:
            return Object.assign({}, state, {
                flightOffer: payload.flightOffer,
                hotelOffer: payload.hotelOffer,
                totalPrice: payload.totalPrice,
                isUpdateInProgress: false,
                isShoppingCartInitialized:true
            });
        case REQUEST_RESTORE_CART_FROM_SERVER:
            return Object.assign({}, state, {
                isUpdateInProgress: true,
            });
        case CART_ACTION_FAILED:
            return Object.assign({}, state, {
                isUpdateInProgress: false,
                error:error
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
export const clearCart = () => {
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

export const requestCartRestoreFromServer = () => {
    return {
        type: REQUEST_RESTORE_CART_FROM_SERVER
    }
};

export const cartRestorecFromServer = (flightOffer, hotelOffer,totalPrice) => {
    return {
        type: CART_RESTORED_FROM_SERVER,
        payload: {
            flightOffer:flightOffer,
            hotelOffer: hotelOffer,
            totalPrice: totalPrice
        }
    }
};
export const cartUpdateFailedAction = (error) => {
    return {
        type: CART_ACTION_FAILED,
        error:error
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
export const totalPriceSelector = createSelector(
    shoppingCartStateSelector,
    ({ totalPrice }) => totalPrice
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


export const isShoppingCartUpdateInProgress = createSelector(
    shoppingCartStateSelector,
    ({isUpdateInProgress}) => isUpdateInProgress
);

export const isShoppingCartInitializedSelector = createSelector(
    shoppingCartStateSelector,
    ({ isShoppingCartInitialized }) => isShoppingCartInitialized
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
        let totalPrice=null;
        if(itemsInCart && itemsInCart.items){
            let items = itemsInCart.items;

            // Retrieve flight offer
            if(items['TRANSPORTATION_OFFER'] !== undefined) {
                flightOffer = items['TRANSPORTATION_OFFER'].item;
                if(items['TRANSPORTATION_OFFER'].price !== undefined) {
                    flightOffer.price = items['TRANSPORTATION_OFFER'].price;
                }
            }

            // Retrieve Hotel offer
            if(items['ACCOMMODATION_OFFER'] !== undefined) {
                hotelOffer = items['ACCOMMODATION_OFFER'].item;
                if(items['ACCOMMODATION_OFFER'].price !== undefined) {
                    hotelOffer.price = items['ACCOMMODATION_OFFER'].price;
                }
            }

            // Retrieve Total price
            totalPrice = itemsInCart.totalPrice;


        }
        yield put(cartRestorecFromServer(flightOffer, hotelOffer, totalPrice))

    } catch (error) {
        console.log('*restoreCartFromServerSideSaga failed, error:',error)
        yield put(cartUpdateFailedAction(error))
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
        let totalPrice=null;
        if(itemsInCart && itemsInCart.items){
            let items = itemsInCart.items;
            // Retrieve flight offer
            if(items['TRANSPORTATION_OFFER'] !== undefined) {
                flightOffer = items['TRANSPORTATION_OFFER'].item;
                if(items['TRANSPORTATION_OFFER'].price !== undefined) {
                    flightOffer.price = items['TRANSPORTATION_OFFER'].price;
                }
            }

            // Retrieve Hotel offer
            if(items['ACCOMMODATION_OFFER'] !== undefined) {
                hotelOffer = items['ACCOMMODATION_OFFER'].item;
                if(items['ACCOMMODATION_OFFER'].price !== undefined) {
                    hotelOffer.price = items['ACCOMMODATION_OFFER'].price;
                }
            }

            // Retrieve Total price
            totalPrice = itemsInCart.totalPrice;
        }
        yield put(cartRestorecFromServer(flightOffer, hotelOffer, totalPrice))
    } catch (error) {
        console.log('*restoreCartFromServerSideSaga failed, error:',error)
        yield put(cartUpdateFailedAction(error))
    }
}
const clearCartApiCall = () =>{
    deleteItemInCart(['ACCOMMODATION_OFFER','TRANSPORTATION_OFFER'])
}
function* deleteCartItemSaga({payload}) {
    console.log('*deleteCartItemSaga, payload=',payload)
    try {
        yield call(clearCartApiCall);
        yield call(requestCartRestoreFromServer)
    } catch (error) {
        console.log('*deleteCartItemSaga failed, error:',error)
        yield put(cartUpdateFailedAction(error))
    }
}


// Main saga
export const saga = function*() {
    yield all([
        takeEvery(STORE_CART_ON_SERVER, storeCartOnServerSideSaga),
        takeEvery(ADD_FLIGHT_TO_CART, addOfferIdToCart),
        takeEvery(ADD_HOTEL_TO_CART, addOfferIdToCart),
        takeEvery(REQUEST_RESTORE_CART_FROM_SERVER, restoreCartFromServerSideSaga),
        takeEvery(DELETE_FLIGHT_FROM_CART, deleteCartItemSaga,['ACCOMMODATION_OFFER']),
        takeEvery(DELETE_HOTEL_FROM_CART, deleteCartItemSaga,['TRANSPORTATION_OFFER']),
        takeEvery(CLEAR_CART, deleteCartItemSaga,['TRANSPORTATION_OFFER','ACCOMMODATION_OFFER']),
    ]);
};


