import React from "react";
import {Col, Container, Row} from "react-bootstrap";
import './your-choice.scss'
import _ from 'lodash'


const YourChoice = ({hotel, price, room}) => {
    const hotelPolicies = hotel.otherPolicies;
    return (
        <Container>
            <Row className='glider-font-h2-fg pb-4'>
                Your choice
            </Row >
            <Row className='glider-font-text24medium-fg  pb-2'>
                {room.name}
            </Row>
            <Row className='glider-font-text18medium-fg pb-5'>
                {price.public} {price.currency} for [X] nights
            </Row>
            <Row className='glider-font-text24medium-fg  pb-2'>
               Guest 1
            </Row>
            <Row className='glider-font-caps18-fg pb-2 flex-column flex-wrap d-flex'>
                    <div className='mr-5'> <span className='glider-font-text24medium-fg'>Check-in:</span> 15Jun 2pm</div>
                    <div><span className='glider-font-text24medium-fg'>Check-out:</span> 18Jun 11am</div>
            </Row>
            <Row className='glider-font-regular18-fg  pb-5'>
                Hotel policies
            </Row>
            <Row>
                <Col className='glider-font-regular18-fg'>
                    {_.map(hotelPolicies, (policy, id) => {
                        return (
                            <div className='pb-2' key={id}>{policy}</div>
                        )
                    })}
                </Col>
            </Row>
        </Container>
    )
}
export default YourChoice