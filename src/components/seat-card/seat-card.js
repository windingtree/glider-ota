import React, {useState} from 'react';
import './seat-card.scss';

export default function SeatCard(props) {
    const {
        price,
        passenger,
        seatNumber,
        seatCharacteristics,
    } = props;

    // Manage React states    

    return (
        <div className='seatcard'>
            <span className='name'>Seat 10H</span>
            <span className='remove'>Remove</span>
            <span className='price'>180 $</span>
            <span>In flight entertainment — Next to lavatory — Power port — Bulkhead row — Extra space</span>
            <span className='type'>Adult</span>
            <span>John Doe</span>
        </div>
    )
}