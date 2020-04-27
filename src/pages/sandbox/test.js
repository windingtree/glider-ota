import React, {useState} from 'react';
import {Button, Container, Row, Col} from "react-bootstrap";
import "./test.scss"


export default function Sandbox() {
        return (
            <Container fluid={true}>
                <Row>
                    <Col sm={2}>c1</Col>
                    <Col className='border border-primary'>c2</Col>
                    <Col sm={2}>c3</Col>
                </Row>
            </Container>
        )
}

const hotel=()=>{
    return (
        <Container>
            <Row>

            </Row>
        </Container>
    )
}

