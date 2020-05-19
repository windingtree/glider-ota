import React from 'react'
import {Container, Row} from 'react-bootstrap'
import Cabin from '../cabin/cabin'

export default function SeatMap(props) {

    const {cabins} = props;
    return (
        <Container>
        {
            cabins.map((cabin, c) => (
                <Row key={c}>
                    <Cabin cabin={cabin}/>
                </Row>
            ))
        }
        </Container>
    );
}