import React, {useState,useEffect} from 'react';
import Header from '../components/common/header/header';
import {useHistory} from "react-router-dom";
import {retrieveOfferFromLocalStorage} from "../utils/search"
import Button from "react-bootstrap/Button";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Cabin from '../components/cabin/cabin';
import SegmentSelector from '../components/segment-selector';
import SeatLegend from '../components/seat-legend';
import SeatCard from '../components/seat-card'
import CardDeck from 'react-bootstrap/CardDeck'

export default function FlightSeatmapPage({match}) {
    let history = useHistory();
    let offerId = match.params.offerId;
    let segmentId = match.params.segmentId;
    let offer = retrieveOfferFromLocalStorage(offerId);

    function onProceedButtonClick(){
        let url='/flights/summary/'+offerId
        history.push(url);
    }

    return (
        <>
            <div>
                <Header violet={true}/>
                <div className='root-container-subpages'>
                    <div>Seatmap for offer: {offerId}, segmentId:{segmentId}</div>
                    <Container fluid>
                        <Row>
                            <Col>Departure Flight: Moscow - Phuket</Col>
                        </Row>
                        <Row>
                            <Col>
                                <SegmentSelector
                                    stops={['Moscow','Doha','Puhket']}
                                    flightTime='1h 15min'
                                    segmentIndex='0'
                                />
                                <SeatLegend/>
                            </Col>
                            <Col>
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
                        </Row>
                        <Row>
                            <Col>
                                <CardDeck>
                                    <SeatCard
                                        priceAmount='180'
                                        priceCurrency='CAD'
                                        passengerName='Doe John'
                                        passengerType='ADT'
                                        seatNumber='10H'
                                        seatCharacteristics={['K','W','LA']}
                                        active={true}
                                    />
                                    <SeatCard
                                        priceAmount='180'
                                        priceCurrency='CAD'
                                        passengerName='Doe John'
                                        passengerType='CHD'
                                        seatNumber='10K'
                                        seatCharacteristics={['K','W','LA']}
                                        active={true}
                                    />
                                </CardDeck>
                            </Col>
                        </Row>
                        <Row>
                            <Col>Total Price: $1164</Col>
                            <Col>
                                <Button 
                                    className='secondary'
                                    onClick={onProceedButtonClick}
                                >
                                    Skip
                                </Button>
                                <Button
                                    className='primary'
                                    onClick={onProceedButtonClick}
                                >
                                    Continue
                                </Button>
                            </Col>
                        </Row>
                    </Container>
                    
                </div>
            </div>
        </>
    )
}
