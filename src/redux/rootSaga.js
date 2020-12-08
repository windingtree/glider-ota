import { spawn } from 'redux-saga/effects';
import { saga as web3Saga } from './sagas/web3';
import { saga as txSaga } from './sagas/tx';
import { saga as flightsSaga } from './sagas/flights';
import { saga as hotelsSage } from './sagas/hotels';

//Add all sagas here
export default function* rootSaga() {
    yield spawn(web3Saga);
    yield spawn(txSaga);
    yield spawn(flightsSaga);
    yield spawn(hotelsSage);
}
