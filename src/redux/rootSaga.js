import { spawn } from 'redux-saga/effects';
import { saga as web3Saga } from './sagas/web3';
import { saga as txSaga } from './sagas/tx';

//Add all sagas here
export default function* rootSaga() {
    yield spawn(web3Saga);
    yield spawn(txSaga);
}
