import React, {useState} from 'react';
import "./flex.scss"
import {Container,Row,Col} from "react-bootstrap";


export default function Flex({}) {
    return (
        <>
            <h2>Flex</h2>
            <div>Flex row</div>
            <div className="d-flex flex-row flex-wrap border border-dark mb-3">
                <div className="p-2 bg-secondary min-width-item">Flex item 1</div>
                <div className="p-2 bg-secondary min-width-item">Flex item 2</div>
                <div className="p-2 bg-secondary min-width-item">Flex item 3</div>
                <div className="p-2 bg-secondary min-width-item">Flex item 3</div>
                <div className="p-2 bg-secondary min-width-item">Flex item 3</div>
                <div className="p-2 bg-secondary min-width-item">Flex item 3</div>
                <div className="p-2 bg-secondary min-width-item">Flex item 3</div>
                <div className="p-2 bg-secondary min-width-item">Flex item 3</div>
            </div>
            <div>Flex row (container)</div>
            <Container className=" border border-dark mb-3" fluid={true}>
                <Row>
                    <Col>
                <div className="p-2 bg-secondary min-width-item">Flex item 1</div>
                <div className="p-2 bg-secondary min-width-item">Flex item 2</div>
                <div className="p-2 bg-secondary min-width-item">Flex item 3</div>
                <div className="p-2 bg-secondary min-width-item">Flex item 3</div>
                <div className="p-2 bg-secondary min-width-item">Flex item 3</div>
                <div className="p-2 bg-secondary min-width-item">Flex item 3</div>
                <div className="p-2 bg-secondary min-width-item">Flex item 3</div>
                <div className="p-2 bg-secondary min-width-item">Flex item 3</div>
                    </Col>
                </Row>
            </Container>




            <div>Flex-row-reverse</div>
            <div className="d-flex flex-row-reverse border border-dark">
                <div className="p-2 bg-secondary">Flex item 1</div>
                <div className="p-2 bg-secondary">Flex item 2</div>
                <div className="p-2 bg-secondary">Flex item 3</div>
            </div>
        </>
    )
}
