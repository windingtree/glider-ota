import React from 'react'
import {Container, Row, Col, Table} from 'react-bootstrap'
import Seat from './seat'

const CabinLayout = (props) => {
    // Destructure properties
    const {
        layout,
        name,
        firstRow,
        lastRow,
    } = props.cabin;

    // Determine the columns
    const columns = Array.from(layout);
    const rows = Array.from(
        {length:Number(lastRow) - Number(firstRow) + 1},
        (v,k)=> k + Number(firstRow)
    );

    // Index seats
    const seats =  props.cabin.seats.reduce((acc, seat) => {
        acc[seat.number]=seat;
        return acc;
    }, {});

    // Get the display of a seat
    const getElement = (row, column) => {
        // Check if it is an Aisle
        if(column === ' ') {
            return (<span>{row}</span>);
        }
        
        // Another element
        else {
            // Retrieve the seat at this position
            const seat = seats[row+column];
            if(seat) {
                return (
                    <Seat
                        number={row+column}
                        available={seat.available}
                        characteristics={seat.characteristics}
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
                <Table bordered hover justify center size="sm">
                    <thead>
                        <tr>
                        { // Letters of the columns
                        columns.map(column => (
                            <th>{column}</th>
                        ))}
                        </tr>
                    </thead>
                    <tbody>
                    { // Draw the rows
                    rows.map(row => (
                        <tr>
                        { // Draw each element in the row
                        columns.map(column => (
                            <td>
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


export default function Cabin(props) {
    const {cabin} = props;

    // Render Component
    return (
        <Container>
            <Row>
                <Col xs lg="1">Left Wing</Col>
                <Col>
                    <CabinLayout cabin={cabin}/>
                </Col>
                <Col xs lg="1">Right Wing</Col>
            </Row>
        </Container>
    );
}