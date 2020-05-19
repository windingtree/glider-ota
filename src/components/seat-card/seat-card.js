import React, {useState} from 'react';
import './seatmap.scss';

export default function SeatCard(props) {
    const {
        price,
        passenger,
        seatNumber,
        seatCharacteristics,
    } = props;

    // Manage React states    

    return (
        <div>
            <div>Seat 10H</div>
            <div>Remove</div>
            <div>180 $</div>
            <div>In flight entertainment — Next to lavatory — Power port — Bulkhead row — Extra space</div>
            <div>Adult</div>
            <div>John Doe</div>
        </div>
    )
}