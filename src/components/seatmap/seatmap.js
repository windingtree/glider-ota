import React from 'react'
import {Container, Row, Col} from 'react-bootstrap'
import {sample1} from './sample'
import Cabin from './cabin'

export default function SeatMap(props) {

    const cabins = sample1.SEG1.cabins;
    return (
        <Container>
        {
            cabins.map(cabin => (
                <Row>
                    <Cabin cabin={cabin}/>
                </Row>
            ))
        }
        </Container>
    );
}