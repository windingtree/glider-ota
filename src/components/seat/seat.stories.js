import React from 'react';
import Seat from './seat'

export default {
  title: 'Seatmap/Seat',
};

export const availableFreeSeat = () => (
    <Seat
        number={'23F'}
        available={true}
        characteristics={[]}
        onSelectionChange={console.log}
        price={{
            currency: 'CAD',
            public: '0.00',
            taxes: '0.00',
        }}
    ></Seat>
);

export const availableFreePremiumSeat = () => (
    <Seat
        number={'23F'}
        available={true}
        characteristics={['PS']}
        onSelectionChange={console.log}
        price={{
            currency: 'CAD',
            public: '0.00',
            taxes: '0.00',
        }}
    ></Seat>
);

export const selectedFreeSeat = () => (
    <Seat
        number='23F'
        available={true}
        characteristics={[]}
        onSelectionChange={console.log}
        price={{
            currency: 'CAD',
            public: '0.00',
            taxes: '0.00',
        }}
        initiallySelected={true}
    ></Seat>
);

export const occupiedFreeSeat = () => (
    <Seat
        number='23F'
        available={false}
        characteristics={[]}
        onSelectionChange={console.log}
        price={{
            currency: 'CAD',
            public: '0.00',
            taxes: '0.00',
        }}
    ></Seat>
);

export const availableChargeableSeat = () => {

    return (
        <Seat
            number={'23F'}
            available={true}
            characteristics={[]}
            onSelectionChange={console.log}
            price={{
                currency: 'CAD',
                public: '20.00',
                taxes: '5.00',
            }}
        ></Seat>
    );
};

export const selectedChargeableSeat = () => (
    <Seat
        number='23F'
        available={true}
        characteristics={[]}
        onSelectionChange={console.log}
        price={{
            currency: 'CAD',
            public: '20.00',
            taxes: '5.00',
        }}
        initiallySelected={true}
    ></Seat>
);

export const occupiedChargeableSeat = () => (
    <Seat
        number='23F'
        available={false}
        characteristics={[]}
        onSelectionChange={console.log}
        price={{
            currency: 'CAD',
            public: '20.00',
            taxes: '5.00',
        }}
    ></Seat>
);

