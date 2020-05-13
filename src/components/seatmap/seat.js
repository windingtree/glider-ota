import React, {useState, useEffect} from 'react';
import {ToggleButton} from 'react-bootstrap'
//import {ReactComponent as Tick} from '../../assets/tick.svg'
//import {ReactComponent as Cross} from '../../assets/cross.svg'
import '../../styles/seatmap.scss';

export default function Seat(props) {
    const {
        number,
        available,
        selected,
        disabled,
        characteristics,
        onSelectionChange,
    } = props;

    const handleSelectionChange = () => {
        onSelectionChange(number, !selected);
    };

    return (
        <div className='seat'>
            <input
                type='checkbox'
                name='seat'
                id={number}
                value={number}
                disabled={disabled || !available}
                checked={selected}
                onChange={handleSelectionChange}
            />
            <label htmlFor={number}>
                <div/>
            </label>
        </div>
    )
}