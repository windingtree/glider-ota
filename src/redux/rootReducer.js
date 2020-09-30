import { combineReducers } from "redux";
import web3Reducer, { moduleName as web3Module } from './sagas/web3';

export default combineReducers({
  [web3Module]: web3Reducer
});
