import React from 'react';
import SeatCard from './seat-card'

export default {
  title: 'Seatmap/SeatCard',
};

export const inactive = () => (
    <SeatCard
        number={'23F'}
        available={true}
        characteristics={[]}
        onSelectionChange={console.log}
        price={{
            currency: 'CAD',
            public: '0.00',
            taxes: '0.00',
        }}
    ></SeatCard>
);

export const active = () => (
    <SeatCard
        number={'23F'}
        available={true}
        characteristics={[]}
        onSelectionChange={console.log}
        price={{
            currency: 'CAD',
            public: '0.00',
            taxes: '0.00',
        }}
    ></SeatCard>
);


