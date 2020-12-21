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
    deleteItemFromCartByOfferId
} from "../../utils/api-utils"

/**
 * Shopping cart & booking flow store
 */

export const moduleName = 'cart';

//cart related actions
const ADD_FLIGHT_TO_CART = `${moduleName}/ADD_FLIGHT_TO_CART`;
const ADD_HOTEL_TO_CART = `${moduleName}/ADD_HOTEL_TO_CART`;

//delete specific item (offerId) from cart
const DELETE_ITEM_FROM_CART = `${moduleName}/DELETE_ITEM_FROM_CART`;
//clear contents of shopping cart at all
const CLEAR_CART = `${moduleName}/CLEAR_CART`;

const REQUEST_RESTORE_CART_FROM_SERVER = `${moduleName}/REQUEST_RESTORE_CART_FROM_SERVER`;
const CART_RESTORED_FROM_SERVER = `${moduleName}/CART_RESTORED_FROM_SERVER`;
const CART_ACTION_FAILED = `${moduleName}/CART_ACTION_FAILED`;
const ERROR = `${moduleName}/ERROR`;

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
        case DELETE_ITEM_FROM_CART:
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
export const deleteOfferFromCartAction = (offerId) => {
    return {
        type: DELETE_ITEM_FROM_CART,
        offerId
    }
};
export const clearCartAction = () => {
    return {
        type: CLEAR_CART
    }
};


export const requestCartUpdateAction = () => {
    return {
        type: REQUEST_RESTORE_CART_FROM_SERVER
    }
};

export const cartSuccessfullyUpdatedAction = (flightOffer, hotelOffer, totalPrice) => {
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

const shoppingCartStateSelector = state => state[moduleName];

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

//saga

function* restoreCartFromServerSideSaga() {
    console.log('*restoreCartFromServerSideSaga')
    try {
        const itemsInCart = yield call(retrieveCart);
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
        yield put(cartSuccessfullyUpdatedAction(flightOffer, hotelOffer, totalPrice))

    } catch (error) {
        console.log('*restoreCartFromServerSideSaga failed, error:',error)
        yield put(cartUpdateFailedAction(error))
    }
}

function* addOfferIdToCart({payload}) {
    try {
        const {offerId, type} = payload;
        const data = yield call(storeOfferId, offerId, type );
        const itemsInCart = yield call(retrieveCart);
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
        yield put(cartSuccessfullyUpdatedAction(flightOffer, hotelOffer, totalPrice))
    } catch (error) {
        console.log('*restoreCartFromServerSideSaga failed, error:',error)
        yield put(cartUpdateFailedAction(error))
    }
}

function* deleteCartItemSaga({offerId}) {
    try {
        yield call(()=>deleteItemFromCartByOfferId(offerId));
        yield put(requestCartUpdateAction())
    } catch (error) {
        console.log('*deleteCartItemSaga failed, error:',error)
        yield put(cartUpdateFailedAction(error))
    }
}
function* clearCartSaga() {
    console.log('*clearCartSaga');
}


// Main saga
export const saga = function*() {
    yield all([
        takeEvery(ADD_FLIGHT_TO_CART, addOfferIdToCart),
        takeEvery(ADD_HOTEL_TO_CART, addOfferIdToCart),
        takeEvery(REQUEST_RESTORE_CART_FROM_SERVER, restoreCartFromServerSideSaga),
        takeEvery(DELETE_ITEM_FROM_CART, deleteCartItemSaga),
        takeEvery(CLEAR_CART, clearCartSaga),
    ]);
};


