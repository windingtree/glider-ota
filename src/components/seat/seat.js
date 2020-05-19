import React, {useState} from 'react';
import './seat.scss';

export default function Seat(props) {
    const {
        number,
        available,
        characteristics,
        price,
        onSelectionChange,
        initiallySelected = false,
    } = props;

    // Manage React states
    const [selected, setSelected] = useState(initiallySelected);
    
    const handleSelectionChange = () => {
        setSelected(!selected);
        onSelectionChange(number, !selected);
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
    const showPrice = (available && !selected);
    const showPremium = (available && (characteristics.includes('PS')));

    return (
        <div className='seat'>
            <input
                type='checkbox'
                name='seat'
                id={number}
                value={number}
                disabled={!available}
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