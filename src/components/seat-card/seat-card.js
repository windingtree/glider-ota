import React from 'react';
import { 
    mapSeatCharacteristicsDescription,
    mapPassengerTypeDescription,
} from '../../utils/seat-utils';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import './seat-card.scss';

export default function SeatCard(props) {
    const {
        passengerName,
        passengerType,
        seatNumber,
        seatCharacteristics = [],
        priceAmount,
        priceCurrency,
        active = false,
        handleSelect,
        handleRemove,
    } = props;

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
        <Card className={active ? 'seat-card-active' : 'seat-card-inactive'}>
            <Card.Body onClick={handleSelect}>
                <span
                    className='name'>
                        {seatAssigned ? `Seat ${seatNumber}` : 'Random Seat'}
                </span>
                <Button
                    variant="link"
                    className='remove'
                    disabled={!seatAssigned}
                    // Clicking on button also propagates to the Card.Body onClick
                    onClick={handleRemove}
                    >
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
                        {mapPassengerTypeDescription(passengerType)}
                </span>
                <span>{passengerName}</span>
            </Card.Body>
        </Card>
    )
}