import React, {useState} from 'react';
import './seat.scss';

export default function Seat(props) {
    const {
        number,
        available,
        characteristics,
        price,
        onSelectionChange,
        selected = false,
        selectionAllowed = true,
    } = props;

    // Manage React states    
    const handleSelectionChange = () => {
        if(selected || selectionAllowed) {
            onSelectionChange(number, !selected);
        } else {
            console.info('[SEAT] Selection not allowed');
        }
    };


    // Helper functions
    const getPriceDisplay = () => {
        if(price && Number(price.public) > 0) {
            return Number(price.public).toFixed(0);
        } else {
            return '';
        }
    }

    // Define when to show/hide components
    const showPrice = (selectionAllowed && available && !selected);
    const showPremium = (selectionAllowed && available && (characteristics.includes('PS')));
    const disabled = (!selected && (!selectionAllowed || !available))

    return (
        <div className='seat'>
            <input
                type='checkbox'
                name='seat'
                id={number}
                value={number}
                disabled={disabled}
                checked={selected}
                onChange={handleSelectionChange}
            />
            <label htmlFor={number}>
                {showPrice ? (<div className='price'>{getPriceDisplay()}</div>) : null}
                {showPremium ? (<div className='premium'/>) : null}
            </label>
        </div>
    )
}