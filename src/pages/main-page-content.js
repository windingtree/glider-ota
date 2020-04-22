import React, {useState} from 'react';
import {Container,Row,Col,ToggleButton, ToggleButtonGroup,Button} from 'react-bootstrap';

export default function MainPageContent() {
    return (
        <>
            <Container>
                <Row noGutters={true}>
                    <Col md={12} >
                        <div className='glider-font-h1-fg py-3'>This is special</div>
                        <Container className='p-0'>
                            <Row noGutters={true}>
                                <Col md={8} className='glider-font-text16-fg p-0' >Glider is Fair Trade Travel. That means no gatekeepers taking commissions or charging hidden fees. Book direct with hotels and airlines so that 100% of your money goes to the travel provider. The result is a fairer travel ecosystem for everyone.</Col>
                                <Col md={4}><img src='/images/zero-comission.png'/></Col>
                            </Row>
                        </Container>
                    </Col>
                </Row>
                <Row noGutters={true}>
                    <Col md={12} >
                        <div className='glider-font-h1-fg py-3'>Our partners</div>
                        <Container className='p-0'>
                            <Row className='my-5' noGutters={true}>
                                <Col md={6}><img width='500' src='/images/partner_nordic.png'/></Col>
                                <Col md={6}><img width='500' src='/images/partner_airnz.png'/></Col>
                            </Row>
                            <Row className='my-5' noGutters={true}>
                                <Col md={6}><img width='500' src='/images/partner_etihad.png'/></Col>
                                <Col md={6}><img width='500' src='/images/partner_zep.png'/></Col>
                            </Row>
                        </Container>
                    </Col>
                </Row>
                <Row className='justify-content-center'>
                    <Button variant={"outline-primary"} size={"lg"}>Become our partner</Button>
                </Row>
                <Row>
                    <br/><br/><br/>
                </Row>
            </Container>
        </>
    )
};


