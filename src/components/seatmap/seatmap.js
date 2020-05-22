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
    // Destructure the seatmap properties
    const {
        cabin,
    } = props;

    return (
        <Container fluid>
            <Row>
                <Col><h2 className='seatmap-h2'>Departure Flight: Moscow - Phuket</h2></Col>
            </Row>
            <Row>
                <Col xs={12} md={6}>
                    <Row>
                        <Col>
                            <SegmentSelector
                                stops={['Moscow','Doha','Puhket']}
                                flightTime='1h 15min'
                                segmentIndex='0'
                            />
                            <SeatLegend/>
                        </Col>
                    </Row>
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
                <Col xs={12} md={6}>
                    <Cabin {...cabin} />
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