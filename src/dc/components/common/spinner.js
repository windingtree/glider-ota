import React from "react";
import {PulseLoader} from "react-spinners";
import {Container, Row, Col} from "react-bootstrap";

export default function Spinner({enabled}){
    return (
        <Container fluid={true} >
            <Row >
                <Col>
                <PulseLoader size={20} color={"#7161D6"} loading={enabled}/>
                </Col>
            </Row>
        </Container>
        // <div className='align-self-center align-content-center d-flex ' ></div>
    )
}
