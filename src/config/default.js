import {
    networkIdByName
} from '../utils/web3-utils';
import tokenList from './tokenList.json';
const {
    addresses: { PaymentManager: PAYMENT_MANAGER }
} = require('@windingtree/payment-manager');

export const config = {
    SEARCH_OFFERS_URL: "/api/searchOffers",
    LOCATION_BOUNDING_BOX_IN_KM: 30,
    DEV_MODE: (process.env.REACT_APP_DEV_MODE === 'yes'),
    OFFLINE_MODE: false,
    FLIGHTS_PER_PAGE: 10,
    CACHE_SIZE_IN_KB: 2 * 1024, //in KB (2024KB = 2MB)
    CACHE_EXPIRY_IN_SECONDS: 60 * 60 //600 sec = 10 min
};

export const DEFAULT_NETWORK = process.env.REACT_APP_DEFAULT_NETWORK;
export const PORTIS_ID = process.env.REACT_APP_PORTIS_ID;
export const INFURA_ENDPOINT = process.env.REACT_APP_INFURA_ENDPOINT;
export const UNISWAP_ROUTER_ADDRESS = process.env.REACT_APP_UNISWAP_ROUTER_ADDRESS;
export const BASE_PRICE_TOKEN = process.env.REACT_APP_BASE_PRICE_TOKEN;

export const DEFAULT_DEFAULT_NETWORK_ID = networkIdByName(DEFAULT_NETWORK);
export const DEFAULT_DEFAULT_NETWORK_ID_HEX = networkIdByName(DEFAULT_NETWORK, true);
export const tokens = tokenList.tokens.filter(
    t => t.chainId === DEFAULT_DEFAULT_NETWORK_ID
);

export const GLIDER_ORGID = DEFAULT_NETWORK !== 'ropsten'
    ? process.env.REACT_APP_PRODUCTION_GLIDER_ORGID
    : process.env.REACT_APP_GLIDER_ORGID;

export const PAYMENT_MANAGER_ADDRESS = PAYMENT_MANAGER[DEFAULT_NETWORK];

export const storageKeys = {
    flights: {
        origin: 'origin-airport',
        destination: 'destination-airport'
    },
    hotels: {
        destination: 'destination-city'
    },
    common: {
        adults: 'adults',
        children: 'children',
        infants: 'infants',
        departureDate: 'departureDate',
        returnDate: 'returnDate'
    }
};
