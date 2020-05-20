import React, {useState} from 'react';
import './seat-card.scss';
import { mapSeatCharacteristicsDescription } from '../../utils/seat-utils';
import Button from 'react-bootstrap/Button';

export default function SeatCard(props) {
    const {
        passengerName,
        passengerType,
        seatNumber,
        seatCharacteristics = [],
        priceAmount,
        priceCurrency,
    } = props;

    // Map passenger type with the type to display
    const passengerTypeDescription = () => {
        switch(passengerType) {
            // Infants
            case 'INF':
                console.warn('INF type has not seat and should be seated with adult');
                return 'Infant without Seat';
            case 'INS':
                return 'Infant'; // with seat
            
            // Childs
            case 'CHD':
                return 'Child';
            case 'UNN':
                return 'Unaccompanied Child';

            // Adults
            case 'ADT':
            default:
                return 'Adult' 
        }
    }

    // Define a state for the seat assigned
    const seatAssigned = (seatNumber !== undefined);

    // Build the price description
    const priceDescription = () => {
        if(seatAssigned && priceAmount && priceCurrency && Number(priceAmount)>0) {
            return `${priceCurrency} ${priceAmount}`;
        } else {
            return `Free`;
        }
    }

    // Render the React component
    return (
        <div className='seatcard'>
            <span className='name'>{seatAssigned ? `Seat ${seatNumber}` : 'Random Seat'}</span>
            {/*<span className='remove'>Remove</span>*/}
            <Button variant="link" className='remove' disabled={!seatAssigned}>Remove</Button>
            <span className='price'>{priceDescription()}</span>
            <span>{mapSeatCharacteristicsDescription(seatCharacteristics).join(' — ')}</span>
            <span className='type'>{passengerTypeDescription()}</span>
                <span>{passengerName}</span>
        </div>
    )
}