import React from 'react';
import './seat-card.scss';
import { mapSeatCharacteristicsDescription } from '../../utils/seat-utils';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card'

export default function SeatCard(props) {
    const {
        passengerName,
        passengerType,
        seatNumber,
        seatCharacteristics = [],
        priceAmount,
        priceCurrency,
        active = false,
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

    // Random seat description
    const randomDesc = "A random seat will be assigned to you at check-in based on the remaining availability.";

    // Render the React component
    return (
        <Card className={active ? 'seatcard-active' : 'seatcard-inactive'}>
            <Card.Body className='body'>
                <span
                    className='name'>
                        {seatAssigned ? `Seat ${seatNumber}` : 'Random Seat'}
                </span>
                <Button
                    variant="link"
                    className='remove'
                    disabled={!seatAssigned}>
                        Remove
                </Button>
                <span
                    className='price'>
                        {priceDescription()}
                </span>
                <span>
                    { seatAssigned ? mapSeatCharacteristicsDescription(seatCharacteristics).join(' — ') : randomDesc}
                </span>
                <span
                    className='type'>
                        {passengerTypeDescription()}
                </span>
                <span>{passengerName}</span>
            </Card.Body>
        </Card>
    )
}