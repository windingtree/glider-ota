import React, {useState} from 'react'
import {Container, Row, Col, Table} from 'react-bootstrap'
import Seat from './seat'
import './seatmap.scss';

export default function Cabin(props) {
    // Destructure properties
    const {
        layout,
        name,
        firstRow,
        lastRow,
        wingFirst,
        wingLast,
        seats,
        prices,
    } = props;

    // Determine the columns and rows
    const columns = Array.from(layout);
    const rows = Array.from(
        {length:Number(lastRow) - Number(firstRow) + 1},
        (v,k)=> k + Number(firstRow)
    );

    // Index seats
    const indexedSeats = seats.reduce((acc, seat) => {
        acc[seat.number] = {
            ...seat,
            price: prices[seat.optionCode]
        };
        return acc;
    }, {});

    // The seats selected for the users
    // @TODO

    // Handle a change in seat selection
    const onSeatSelectionChange = (seatNumber, selected) => {
        console.log(`SEAT #${seatNumber} selected: ${selected}`);
        indexedSeats[seatNumber].selected = selected;
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

        // If the row is the first on the wing, it takes all the wing
        if(row === wingFirst) {
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
        <Container>
            <Row>
                <div className='plane'>
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
            </Row>
        </Container>
    );
};

