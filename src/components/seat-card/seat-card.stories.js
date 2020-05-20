import React from 'react';
import SeatCard from './seat-card'

export default {
  title: 'Seatmap/SeatCard',
};

export const activeChargeableSelected = () => (
    <SeatCard
        priceAmount='180'
        priceCurrency='CAD'
        passengerName='Doe John'
        passengerType='ADT'
        seatNumber='10H'
        seatCharacteristics={['K','W','LA']}
        active={true}
    ></SeatCard>
);

export const activeFreeSelected = () => (
    <SeatCard
        priceAmount='0'
        priceCurrency='CAD'
        passengerName='Doe John'
        passengerType='ADT'
        seatNumber='10H'
        seatCharacteristics={['K','W','LA']}
        active={true}
    ></SeatCard>
);

export const activeNotSelected = () => (
    <SeatCard
        passengerName='Doe John'
        passengerType='ADT'
        active={true}
    ></SeatCard>
);

export const inactiveChargeableSelected = () => (
    <SeatCard
        priceAmount='180'
        priceCurrency='CAD'
        passengerName='Doe John'
        passengerType='ADT'
        seatNumber='10H'
        seatCharacteristics={['K','W','LA']}
        active={false}
    ></SeatCard>
);

export const inactiveFreeSelected = () => (
    <SeatCard
        priceAmount='0'
        priceCurrency='CAD'
        passengerName='Doe John'
        passengerType='ADT'
        seatNumber='10H'
        seatCharacteristics={['K','W','LA']}
        active={false}
    ></SeatCard>
);

export const inactiveNotSelected = () => (
    <SeatCard
        passengerName='Doe John'
        passengerType='ADT'
        active={false}
    ></SeatCard>
);
