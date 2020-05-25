import React from 'react';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import './seat-legend.scss';

const legendItems = [
    [
        {title: 'Selected Seat', icon: 'selected'},
        {title: 'Unavailable Seat', icon: 'occupied'},
    ],
    [
        {title: 'Available Seat', icon: 'available'},
        {title: 'Premium Seat', icon: 'premium'},
    ],
];

export default function SeatLegend(props) {

    return (
        <Container className='seat-legend'>
            {legendItems.map(legendRow => (
                <Row noGutters='true'>
                    {legendRow.map(({title, icon}, index) => (
                        <Col xs={12} sm={6}>
                            <Card className='seat-legend-card' body>
                                <div class={`icon-${icon}`}/>
                                <span>{title}</span>
                            </Card>
                        </Col>
                    ))}
                </Row>
            ))}
        </Container>
    );
};