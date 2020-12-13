import { spawn } from 'redux-saga/effects';
import { saga as web3Saga } from './sagas/web3';
import { saga as txSaga } from './sagas/tx';
import { saga as flightsSaga } from './sagas/flights';
import { saga as hotelsSaga } from './sagas/hotels';
import { saga as cartSaga } from './sagas/cart';
import { saga as bookingSaga } from './sagas/booking';

//Add all sagas here
export default function* rootSaga() {
    yield spawn(web3Saga);
    yield spawn(txSaga);
    yield spawn(flightsSaga);
    yield spawn(hotelsSaga);
    yield spawn(cartSaga);
    yield spawn(bookingSaga);
}
