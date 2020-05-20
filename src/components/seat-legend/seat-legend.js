import React from 'react';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import './seat-legend.scss';

export default function SeatLegend(props) {
    return (
        <Container>
            <Row noGutters='true'>
                <Col xs={12} md={6}>
                    <Card body>
                        <div class='icon-selected'/>
                        <span>Selected Seat</span>
                    </Card>
                </Col>
                <Col xs={12} md={6}>
                    <Card body>
                        <div class='icon-available'/>
                        <span>Available Seat</span>
                    </Card>
                </Col>
            </Row>
            <Row noGutters='true'>
                <Col xs={12} md={6}>
                    <Card body>
                        <div class='icon-premium'/>
                        <span>Premium Seat</span>
                    </Card>
                </Col>
                <Col xs={12} md={6}>
                    <Card body>
                        <div class='icon-occupied'/>
                        <span>Occupied Seat</span>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};