import { createSelector } from 'reselect';
import { all, call, put, takeEvery, select, delay } from 'redux-saga/effects';

import { web3 } from './web3';

export const moduleName = 'tx';
const COMMON_ERROR = `${moduleName}/COMMON_ERROR`;
const TX_ERROR = `${moduleName}/TX_ERROR`;
const POLLING_START = `${moduleName}/POLLING_START`;
const POLLING_STOP = `${moduleName}/POLLING_STOP`;
const TX_REGISTER = `${moduleName}/TX_REGISTER`;
const TX_MINED = `${moduleName}/TX_MINED`;
const INVALIDATE_TX_ERRORS = `${moduleName}/INVALIDATE_TX_ERRORS`;

const initialState = {
    isPolling: false,
    pending: [],
    mined: [],
    txErrors: {}, // hash => Error
    error: null
};

// reducer
export default (state = initialState, action) => {
    const {
        type,
        payload,
        error
    } = action;

    switch (type) {
        case COMMON_ERROR:
            return {
                ...state,
                error
            };
        case TX_ERROR:
            return {
                ...state,
                txErrors: {
                    ...state.txErrors,
                    [payload.hash]: payload.error
                }
            };
        case INVALIDATE_TX_ERRORS:
            return {
                ...state,
                txErrors: {}
            };
        case TX_REGISTER:
            console.log();
            return {
                ...state,
                pending: [
                    ...state.pending,
                    payload.hash
                ]
            };
        case TX_MINED:
            return {
                ...state,
                pending: state.pending.filter(
                    hash => hash !== payload.hash
                ),
                mined: [
                    ...state.mined,
                    payload.hash
                ]
            };
        case POLLING_START:
            return {
                ...state,
                isPolling: true,
                error: null
            };
        case POLLING_STOP:
            return {
                ...state,
                isPolling: false
            };
        default:
            return state;
    }
};

// Actions

export const commonError = error => ({
    type: COMMON_ERROR,
    error
});

export const txError = (hash, error) => ({
    type: COMMON_ERROR,
    payload: {
        hash,
        error
    }
});

export const invalidateTxErrors = () => ({
    type: INVALIDATE_TX_ERRORS
});

export const txRegister = hash => ({
    type: TX_REGISTER,
    payload: {
        hash
    }
});

export const txMined = hash => ({
    type: TX_MINED,
    payload: {
        hash
    }
});

export const pollingStart = () => ({
    type: POLLING_START
});

export const pollingStop = () => ({
    type: POLLING_STOP
});

// Selectors

const stateSelector = state => state[moduleName];

export const isPolling = createSelector(
    stateSelector,
    ({ isPolling }) => isPolling
);

export const pendingTxRaw = createSelector(
    stateSelector,
    ({ pending }) => pending
);

export const pendingTx = createSelector(
    stateSelector,
    ({ pending }) => pending.reduce(
        (a, v) => ({
            ...a,
            [v]: true
        }),
        {}
    )
);

export const minedTx = createSelector(
    stateSelector,
    ({ mined }) => mined.reduce(
        (a, v) => ({
            ...a,
            [v]: true
        }),
        {}
    )
);

export const error = createSelector(
    stateSelector,
    ({ error }) => error
);

export const txErrors = createSelector(
    stateSelector,
    ({ txErrors }) => txErrors
);

// APIs

const fetchTx = (web3, hash) => web3.eth.getTransaction(hash);

// Sagas

function* pollingSaga() {
    try {
        const polling = yield select(isPolling);

        if (polling) {
            return;
        }

        const web3Instance = yield select(web3);
        let pending = yield select(pendingTxRaw);
        let count = 0;
        let tx;

        yield put(pollingStart());

        while (pending.length > 0 && count < 7200) {
            for (let hash of pending) {
                try {
                    tx = yield call(fetchTx, web3Instance, hash);
                    if (tx.blockHash !== null && tx.blockNumber !== null) {
                        yield put(txMined(hash));
                    }
                } catch (error) {
                    yield put(txError(hash, error));
                }
                yield delay(5000);
            }
            pending = yield select(pendingTxRaw);
            count++;
            if (Object.keys(pending).length === 0) {
                yield put(pollingStop());
            }
            if (count === 7200) {
                yield put(commonError(new Error('Too much polling requests')));
                yield put(pollingStop());
            }
        };
    } catch (error) {
        yield put(commonError(error))
    }
}

// Main saga
export const saga = function*() {
    yield all([
        takeEvery(TX_REGISTER, pollingSaga)
    ]);
};