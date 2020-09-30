import { spawn } from 'redux-saga/effects';
import { saga as web3Saga } from './sagas/web3';

//Add all sagas here
export default function* rootSaga() {
  yield spawn(web3Saga);
}
