import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import React from "react";

export default function ContentWrapper(props){
    return (
        <Container>
            <Row noGutters>
                <Col className="content-wrapper">
                    {props.children}
                </Col>
            </Row>
        </Container>
    )
}
