import Web3 from 'web3';
import detectEthereumProvider from '@metamask/detect-provider';
import Portis from '@portis/web3';
import { createSelector } from 'reselect';
import { eventChannel, END } from 'redux-saga';
import { all, call, put, takeLatest, select, take, delay } from 'redux-saga/effects';
import {
    DEFAULT_NETWORK,
    PORTIS_ID,
    INFURA_ENDPOINT
} from '../../config/default';

const networkIdParser = id => {
    id = parseInt(id);
    switch (id) {
        case 1:
            return 'main';
        case 3:
            return 'ropsten';
        case 4:
            return 'rinkeby';
        case 5:
            return 'goerli';
        case 42:
            return 'kovan';
        default:
            throw new Error('Unknown network Id');
    }
};

const defaultWeb3 = new Web3(INFURA_ENDPOINT);
const portis = new Portis(PORTIS_ID, DEFAULT_NETWORK);

export const moduleName = 'web3';
const SIGN_IN_REQUEST = `${moduleName}/SIGN_IN_REQUEST`;
const SIGN_IN_SUCCESS = `${moduleName}/SIGN_IN_SUCCESS`;
const SIGN_IN_FAILURE = `${moduleName}/SIGN_IN_FAILURE`;
const LOGOUT_REQUEST = `${moduleName}/LOGOUT_REQUEST`;
const LOGOUT_REQUEST_SUCCESS = `${moduleName}/LOGOUT_REQUEST_SUCCESS`;
const ACCOUNT_CHANGE = `${moduleName}/ACCOUNT_CHANGE`;
const OPEN_PORTIS_WALLET = `${moduleName}/OPEN_PORTIS_WALLET`;

const initialState = {
    isSigningIn: false,
    provider: null,
    web3: defaultWeb3,
    address: null,
    signInError: null
};

// reducer
export default (state = initialState, action) => {
    const {
        type,
        payload,
        error
    } = action;

    switch (type) {
        case SIGN_IN_REQUEST:
            return Object.assign({}, state, {
                isSigningIn: true,
                provider: null,
                address: null,
                signInError: null
            });
        case SIGN_IN_SUCCESS:
            return Object.assign({}, state, {
                isSigningIn: false,
                provider: payload.provider,
                web3: payload.web3,
                address: payload.address,
                signInError: null
            });
        case SIGN_IN_FAILURE:
            return Object.assign({}, state, {
                isSigningIn: false,
                address: null,
                signInError: error
            });
        case LOGOUT_REQUEST:
            return Object.assign({}, state, {
                isSigningIn: true
            });
        case LOGOUT_REQUEST_SUCCESS:
            return Object.assign({}, state, {
                isSigningIn: false,
                provider: null,
                web3: defaultWeb3,
                address: null
            });
        case ACCOUNT_CHANGE:
            return Object.assign({}, state, {
                address: payload.address
            });
        default:
            return state
    }
}

// Actions

export const signInRequest = provider => ({
    type: SIGN_IN_REQUEST,
    provider
});

export const signInSuccess = payload => ({
    type: SIGN_IN_SUCCESS,
    payload
});

export const signInFailure = error => ({
    type: SIGN_IN_FAILURE,
    error
});

export const logOutRequest = () => ({
    type: LOGOUT_REQUEST
});

export const logOutSuccess = () => ({
    type: LOGOUT_REQUEST_SUCCESS
});

export const accountChangeRequest = payload => ({
    type: ACCOUNT_CHANGE,
    payload
});

export function openPortis() {
    return {
        type: OPEN_PORTIS_WALLET
    }
}

// Selectors

const stateSelector = state => state[moduleName];

export const web3 = createSelector(
    stateSelector,
    ({ web3 }) => web3
);

export const isSigningIn = createSelector(
    stateSelector,
    ({ isSigningIn }) => isSigningIn
);

export const isLoggedIn = createSelector(
    stateSelector,
    ({ address }) => !!address
);

export const web3ProviderType = createSelector(
    stateSelector,
    ({ provider }) => provider
);

export const walletAddress = createSelector(
    stateSelector,
    ({ address }) => address
);

export const signInError = createSelector(
    stateSelector,
    ({ signInError }) => signInError
);

// Event Channels and APIs

export const subscribePortisEventChannel = () => {
    return eventChannel(emitter => {
        if (networkIdParser(portis.config.network.chainId) !== DEFAULT_NETWORK) {
            throw new Error(`Please connect to ${DEFAULT_NETWORK}`);
        }
        const web3 = new Web3(portis.provider);
        const emitLogin = address => emitter(signInSuccess({
            provider: 'portis',
            web3,
            address
        }));
        if (portis.isLoggedIn()) {
            web3.eth.getAccounts()
                .then(accounts => emitLogin(accounts[0]))
                .catch(error => emitter(signInFailure(error)));
        }
        portis.onError(error => emitter(signInFailure(error)));
        portis.onLogin(address => emitLogin(address));
        portis.onLogout(() => {
            emitter(logOutSuccess());
            emitter(END)
        });
        portis.onActiveWalletChanged(address => emitter(accountChangeRequest(address)));

        return () => {};
    });
};

export const subscribeMetamaskEventChannel = (ethereumProvider, web3, accounts) => {
    return eventChannel(emitter => {
        if (!ethereumProvider) {
            throw new Error('Ethereum provider not found');
        }
        if (networkIdParser(ethereumProvider.chainId) !== DEFAULT_NETWORK) {
            throw new Error(`Please connect to ${DEFAULT_NETWORK}`);
        }
        const handleNewAccounts = accounts => {
            if (accounts.length === 0) {
                emitter(logOutRequest());
                emitter(END);
            } else {
                emitter(accountChangeRequest(accounts[0]));
            }
        };
        const handleChainChange = chainId => {
            emitter(logOutRequest());
            emitter(END);
        };
        const handleLogOut = () => {
            emitter(logOutSuccess());
            emitter(END);
        };

        ethereumProvider.on('accountsChanged', handleNewAccounts);
        ethereumProvider.on('chainChanged', handleChainChange);
        ethereumProvider.on('customLogout', handleLogOut); // ethereumProvider is the event emitter

        setTimeout(() => emitter(signInSuccess({
            provider: 'metamask',
            address: accounts[0],
            web3
        })), 10);

        return () => {
            ethereumProvider.off('accountsChanged', handleNewAccounts);
            ethereumProvider.off('chainChanged', handleChainChange);
            ethereumProvider.off('customLogout', handleLogOut);
        };
    });
};

export const openPortisPopUp = async () => {
    portis.showPortis();
};

export const logoutPortis = async () => {
    portis.logout();
};

export const logoutMetamask = async ethereumProvider => {
    ethereumProvider.emit('customLogout');
};

// Sagas

function* subscribePortisSaga() {
    const portisEvents = yield call(subscribePortisEventChannel);
    yield call(openPortisPopUp);

    let address;
    let signingIn;

    do {
        const eventAction = yield take(portisEvents);
        yield put(eventAction);
        yield delay(300);
        address = yield select(walletAddress);
        signingIn = yield select(isSigningIn);
    } while (address || signingIn);
}

function* subscribeMetamaskSaga() {
    const ethereumProvider = yield detectEthereumProvider();
    let web3;
    let accounts;

    if (typeof ethereumProvider !== 'undefined') {
        ethereumProvider.autoRefreshOnNetworkChange = false;
        const connectMethod = typeof ethereumProvider.request === 'function'
            ? () => ethereumProvider.request({ method: 'eth_requestAccounts' })
            : () => ethereumProvider.enable();
        accounts = yield connectMethod();
        if (accounts.length === 0) {
            throw new Error('You must connect at least one account address in the MetaMask wallet');
        }
        web3 = new Web3(ethereumProvider);
    }

    // Check for injected web3 (old browsers or extensions)
    else if (typeof window.web3 !== 'undefined') {
        web3 = new Web3(window.web3.currentProvider);
    }

    // Web3 provider not detected
    else {
        throw new Error('Ethereum provider not found');
    }

    const metamaskEvents = yield call(
        subscribeMetamaskEventChannel,
        ethereumProvider,
        web3,
        accounts
    );

    let address;
    let signingIn;

    do {
        const eventAction = yield take(metamaskEvents);
        yield put(eventAction);
        yield delay(300);
        address = yield select(walletAddress);
        signingIn = yield select(isSigningIn);
    } while (address || signingIn);
}

function* signInSaga({ provider }) {
    try {
        switch (provider) {
            case 'portis':
                yield subscribePortisSaga();
                break;
            case 'metamask':
                yield subscribeMetamaskSaga();
                break;
            default:
                throw new Error('Unknown provider');
        }
    } catch (error) {
        yield put(signInFailure(error));
    }
}

function* logoutSaga() {
    try {
        const provider = yield select(web3ProviderType);
        let ethereumProvider;

        switch (provider) {
            case 'portis':
                yield call(logoutPortis);
                break;
            case 'metamask':
                ethereumProvider = yield detectEthereumProvider();
                yield call(logoutMetamask, ethereumProvider);
                break;
            default:
                throw new Error('Unknown provider');
        }
    } catch (error) {
        yield put(signInFailure(error));
    }
}

function* openPortisSaga() {
    try {
        yield call(openPortisPopUp);
    } catch (error) {
        yield put(signInFailure(error));
    }
}

// Main saga
export const saga = function*() {
    yield all([
        takeLatest(SIGN_IN_REQUEST, signInSaga),
        takeLatest(LOGOUT_REQUEST, logoutSaga),
        takeLatest(OPEN_PORTIS_WALLET, openPortisSaga)
    ]);
};