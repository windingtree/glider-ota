import React from 'react'
import Button from "react-bootstrap/Button";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Cabin from '../cabin';
import SegmentSelector from '../segment-selector';
import SeatLegend from '../seat-legend';
import SeatCard from '../seat-card'
import './seatmap.scss';

export default function SeatMap(props) {

    return (
        <Container fluid>
            <Row>
                <Col><h2 className='seatmap-h2'>Departure Flight: Moscow - Phuket</h2></Col>
            </Row>
            <Row>
                <Col xs={12} md={6}>
                    <SegmentSelector
                        stops={['Moscow','Doha','Puhket']}
                        flightTime='1h 15min'
                        segmentIndex='0'
                    />
                    <SeatLegend/>
                </Col>
                <Col xs={12} md={6}>
                    <Cabin
                        layout='ABC DEF'
                        name='VIP'
                        firstRow={1}
                        lastRow={2}
                        wingFirst={1}
                        wingLast={2}
                        seats={[
                            {
                                "number": "1A",
                                "available": true,
                                "characteristics": [
                                    "PS",
                                    "W"
                                ],
                                "optionCode": "A0"
                            },
                            {
                                "number": "1B",
                                "available": false,
                                "characteristics": [
                                    "PS",
                                    "W"
                                ]
                            },
                            {
                                "number": "1C",
                                "available": false,
                                "characteristics": [
                                    "PS",
                                    "W"
                                ]
                            },
                            {
                                "number": "1D",
                                "available": false,
                                "characteristics": [
                                    "PS",
                                    "W"
                                ]
                            },
                            {
                                "number": "1E",
                                "available": false,
                                "characteristics": [
                                    "PS",
                                    "W"
                                ]
                            },
                            {
                                "number": "1F",
                                "available": false,
                                "characteristics": [
                                    "PS",
                                    "W"
                                ]
                            },
                            {
                                "number": "2B",
                                "available": true,
                                "characteristics": [
                                    "PS",
                                    "W"
                                ],
                                "optionCode": "A1"
                            },
                            {
                                "number": "2C",
                                "available": true,
                                "characteristics": [
                                    "PS",
                                    "W"
                                ],
                                "optionCode": "A1"
                            },
                            {
                                "number": "2D",
                                "available": true,
                                "characteristics": [
                                    "PS",
                                    "W"
                                ],
                                "optionCode": "A1"
                            },
                            {
                                "number": "2E",
                                "available": true,
                                "characteristics": [
                                    "PS",
                                    "W"
                                ],
                                "optionCode": "A1"
                            },
                        ]}
                        prices={{
                            "A0": {
                                "currency": "CAD",
                                "public": "0.00",
                                "taxes": "0.00"
                            },
                            "A1": {
                                "currency": "CAD",
                                "public": "50.00",
                                "taxes": "0.00"
                            },
                        }}
                    />
                </Col>
                <Col xs={12} md={6}>
                    <Row className='seatcard-row'>
                        <Col xs={12} sm={6} md={12} lg={6} xl={4} className='seatcard-col'>
                            <SeatCard
                                priceAmount='180'
                                priceCurrency='CAD'
                                passengerName='Doe John'
                                passengerType='ADT'
                                seatNumber='10H'
                                seatCharacteristics={['K','W','LA']}
                                active={true}
                            />
                        </Col>
                        <Col xs={12} sm={6} md={12} lg={6} xl={4} className='seatcard-col'>
                            <SeatCard
                                priceAmount='180'
                                priceCurrency='CAD'
                                passengerName='Doe John'
                                passengerType='CHD'
                                seatNumber='10K'
                                seatCharacteristics={['K','W','LA']}
                                active={true}
                            />
                        </Col>
                    </Row>
                </Col>
            </Row>
            <Row>
                <Col xs={12} md={6}>
                    <h2 className='seatmap-h2-price'>Total Price: CAD 1164</h2>
                </Col>
                <Col xs={12} md={6}>
                    <Row>
                        <Col xs={6}>
                            <Button 
                                className='seatmap-btn-secondary'
                                onClick={console.log}
                            >
                                Skip
                            </Button>
                        </Col>
                        <Col xs={6}>
                            <Button
                                className='seatmap-btn-primary'
                                onClick={console.log}
                            >
                                Continue
                            </Button>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Container>
    );
}