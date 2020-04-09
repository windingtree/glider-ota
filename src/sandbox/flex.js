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


            <div>Fill</div>
            <div className="d-flex flex-row flex-wrap  border border-dark">
                <div className="flex-fill p-2 border border-dark">
                    <div className="w300">300px</div>
                    <div className="w50">50px</div>
                </div>
                <div className="flex-fill p-2 border border-danger">
                    <div className="w50">50px</div>
                </div>
                <div className="flex-fill p-2 border border-warning">Flex item 3</div>
                <div className="p-2 border border-dark">
                    <div className="w300">300px</div>
                    <div className="w50">50px</div>
                </div>
            </div>

            <div>Fill</div>
            <div className="d-flex flex-row flex-wrap  border border-dark">
                <div className="flex-sm-fill p-2 border border-dark">
                    <div className="w300">300px</div>
                    <div className="w50">50px</div>
                </div>
                <div className="flex-lg-fill p-2 border border-danger">
                    <div className="w50">50px</div>
                </div>
                <div className="flex-fill p-2 border border-warning">Flex item 3</div>
                <div className="p-2 border border-dark">
                    <div className="w300">300px</div>
                    <div className="w50">50px</div>
                </div>
            </div>

            <div>container-fluid</div>
            <div className="container-fluid border border-dark d-flex justify-content-center">
                <div className="w300 border border-danger">300px</div>
                <div className="w50 border border-warning">50px</div>
                <div className="d-flex align-items-start">...</div>
                <div className="d-flex align-items-end">...</div>
                <div className="d-flex align-items-center">...</div>
                <div className="d-flex align-items-baseline">...</div>
                <div className="d-flex align-items-stretch">...</div>
            </div>
        </>
    )
}
