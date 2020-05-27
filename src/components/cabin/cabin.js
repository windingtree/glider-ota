import React, {useState}  from 'react'
import Seat from '../seat/seat'
import { isSeatRestrictedForPassenger } from '../../utils/seat-utils'
import './cabin.scss';

export default function Cabin(props) {
    // Destructure properties
    const {
        layout,
        firstRow,
        lastRow,
        wingFirst,
        wingLast,
        seats,
        prices,
        maxSelection,
        passengerType = 'ADT',
        selectedSeats = [],
        handleSeatSelectionChange,
    } = props;

    // Determine the columns and rows
    const columns = Array.from(layout);
    const rows = Array.from(
        {length:Number(lastRow) - Number(firstRow) + 1},
        (v,k)=> k + Number(firstRow)
    );

    // Determine if a seat is selected
    const isSeatSelected = (seatNumber) => {
        return (selectedSeats.find(s => s === seatNumber) !== undefined);
    };

    // Determine if we can select a given seat
    const isSeatSelectionAllowed = (seatCharacteristics) => {
        // Check if the maxium selection is reached
        if(maxSelection && (selectedSeats.length >= maxSelection)) {
            return false;
        }

        // Check seat characteristics restrictions
        return !isSeatRestrictedForPassenger(
            seatCharacteristics,
            passengerType
        );
    };

    // Index seats by seat number
    const indexedSeats = seats.reduce((acc, seat) => {
        acc[seat.number] = {
            ...seat,
            price: prices[seat.optionCode],
            selected: isSeatSelected(seat.number),
            selectionAllowed: isSeatSelectionAllowed(seat.characteristics),
        };
        return acc;
    }, {});

    // Handle a change in seat selection
    const onSeatSelectionChange = (seatNumber, selected) => {
        console.log(`SEAT #${seatNumber} selected: ${selected}`);
        handleSeatSelectionChange(seatNumber, selected);
    }

    // Get the display of an element at a given position
    const getElement = (row, column) => {
        // Check if it is an Aisle
        if(column === ' ') {
            return (<span className='aisle'>{row}</span>);
        }
        
        // Another element
        else {
            // Retrieve the seat at this position
            const seatNumber = `${row}${column}`;
            const seat = indexedSeats[seatNumber];
            if(seat) {
                return (
                    <Seat
                        number={seatNumber}
                        available={seat.available}
                        characteristics={seat.characteristics}
                        price={seat.price}
                        onSelectionChange={onSeatSelectionChange}
                        selected={seat.selected}
                        selectionAllowed={seat.selectionAllowed}
                    />
                );
            }

            // No seat is there
            return null;
        }
    }

    // Determine the Wing Cell
    const getWingCell = (row, isLeft) => {
        const wingClass = isLeft ? 'wing-left' : 'wing-right';
        const airClass = isLeft ? 'air-left' : 'air-right';

        // If wing is unset, everything is air
        if((wingFirst === 0) && (wingLast === 0) && (row === firstRow )) {
            return (<td rowSpan={lastRow - firstRow + 1} className={airClass}></td>);
        }

        // If the row is the first on the wing, it takes all the wing
        else if(row === wingFirst) {
            // Wing starts from first row
            return (<td rowSpan={wingLast - wingFirst + 1} className={wingClass}></td>);
        }

        // If the row is the first row, it takes until the beginning of the wing
        else if(row === firstRow) {
            // Row is before the wing
            if(firstRow < wingFirst) {
                return (<td rowSpan={wingFirst - firstRow} className={airClass}></td>);
            }
            
            // Row is already on the wing
            else {
                return (<td rowSpan={wingLast - firstRow + 1} className={wingClass}></td>);
            }
            
        }

        // If the row is just after the wing, it takes the rest of the rows
        else if(row === wingLast + 1) {
            return (<td rowSpan={lastRow - wingLast} className={airClass}></td>);
        }

        // Otherwise, no cell
        return null;
    };

    // Render Component
    return (

        <div className='cabin'>
            <table /*bordered*/ size="sm">
                <thead>
                    <tr>
                    <th/>
                    { // Letters of the columns
                    columns.map((column, c) => (
                        <th key={c}>{column}</th>
                    ))}
                    <th/>
                    </tr>
                </thead>
                <tbody>
                    { // Draw the rows
                    rows.map((row, r) => (
                        <tr key={r}>
                            {getWingCell(row, true)}
                            { // Draw each element in the row
                            columns.map((column,c) => (
                                
                                <td key={c}>
                                    {getElement(row, column)}
                                </td>
                                
                            ))}
                            {getWingCell(row, false)}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

    );
};

