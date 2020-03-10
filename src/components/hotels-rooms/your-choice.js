import React from "react";
import {Col, Container, Row} from "react-bootstrap";
import './your-choice.css'
import _ from 'lodash'


const YourChoice = ({hotel, price, room}) => {
    const hotelPolicies = hotel.otherPolicies;
    return (
        <Container>
            <Row>
                <Col>Your choice</Col>
            </Row>
            <Row>
                <Col>
                    Room: {room.name} - {price.public} {price.currency} for [X] nights
                </Col>
            </Row>
            <Row>
                <Col>
                    [X] Guest | Check-in: [15Feb] 2pm | Check-out: 12pm
                </Col>
            </Row>
            <Row>
                <Col>
                    {_.map(hotelPolicies, (policy, id) => {
                        return (
                            <div key={id}>{policy}</div>
                        )
                    })}
                </Col>
            </Row>
        </Container>
    )
}
export default YourChoice