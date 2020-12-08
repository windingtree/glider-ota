import { combineReducers } from "redux";
import web3Reducer, { moduleName as web3Module } from './sagas/web3';
import txReducer, { moduleName as txModule } from './sagas/tx';
import flightsReducer, { moduleName as flightsModule } from './sagas/flights';

export default combineReducers({
    [web3Module]: web3Reducer,
    [txModule]: txReducer,
    [flightsModule]: flightsReducer
});
