import React, {useState} from 'react'
import {Container, Row, Col, Table} from 'react-bootstrap'
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup'
import Seat from './seat'


export default function Cabin(props) {
    // Destructure properties
    const {
        layout,
        name,
        firstRow,
        lastRow,
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
            return (<span>{row}</span>);
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

    // Render Component
    return (
        <Container>
            <Row>{name}</Row>
            <Row>{layout}</Row>
            <Row>
                <Table bordered hover justify="true" center="true" size="sm">
                    <thead>
                        <tr>
                        { // Letters of the columns
                        columns.map((column, c) => (
                            <th key={c}>{column}</th>
                        ))}
                        </tr>
                    </thead>
                    <tbody>
                        
                        { // Draw the rows
                        rows.map((row, r) => (
                            <tr key={r}>
                            { // Draw each element in the row
                            columns.map((column,c) => (
                                <td key={c}>
                                    {getElement(row, column)}
                                </td>
                            ))}
                            </tr>
                        ))}
                        
                    </tbody>
                </Table>
            </Row>
        </Container>
    );
};

