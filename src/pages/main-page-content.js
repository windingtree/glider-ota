import React, {useState} from 'react';
import {Container,Row,Col,ToggleButton, ToggleButtonGroup,Button} from 'react-bootstrap';
import style from './main-page-content.module.css'

export default function MainPageContent() {
    return (
        <>
            <Container className={style.content}>
                <Row >
                    <Col md={9} >
                        <Container>
                            <Row className='glider-font-h1-fg '>
                                No hidden fees, no data selling. <br/>
                                Book flights and hotels direct. <br/>
                                It's 100% fair trade travel.
                            </Row>
                            <Row className='glider-font-text16-fg py-5'>
                                That means no gatekeepers taking commissions or charging hidden fees. Book direct with hotels and airlines so that 100% of your money goes to the travel provider. The result is a fairer travel ecosystem for everyone
                            </Row>
                        </Container>

                    </Col>
                    <Col md={3} className='justify-content-center align-self-center'>
                        <img className={style.imgmain} src='/images/zero-comission.png'/>
                    </Col>
                </Row>
                <Row className='py-5'>
                    <Col  md={6} >

                        <Container>
                            <Row className='glider-font-h2-fg'>
                                Conventional system
                            </Row>
                            <Row className='glider-font-text18medium-fg'>
                                Gatekeepers taking commissions or charging hidden fees so you pay more
                            </Row>
                            <Row className='justify-content-center'>
                                <img className={style.imgmain} src='/images/main-img-left.png'/>
                            </Row>
                        </Container>
                    </Col>
                    <Col  md={6} >
                        <Container >
                            <Row className='glider-font-h2-fg'>
                                Glider
                            </Row>
                            <Row className='glider-font-text18medium-fg'>
                                You pay less, because 100% of your money goes to the travel supplier
                            </Row>
                            <Row className='justify-content-center'>
                                <img className={style.imgmain} src='/images/main-img-right.png'/>
                            </Row>
                        </Container>
                    </Col>
                </Row>
            </Container>


        </>
    )
};
