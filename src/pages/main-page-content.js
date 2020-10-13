import React from 'react';
import {Container,Row,Col} from 'react-bootstrap';
import style from './main-page-content.module.css'

export default function MainPageContent() {
    return (
        <>
            <Container className='root-container-mainpage' >
                <Row className={style.padding}></Row>
                <Row >
                    <Col xs={12} md={6} lg={9}>
                        <div className='glider-font-h1-fg '>
                            No hidden fees, no data selling. <br/>
                            Book flights and hotels direct. <br/>
                            It's 100% fair trade travel.
                        </div>
                        <div className='glider-font-text16-fg py-5'>
                            That means no gatekeepers taking commissions or charging hidden fees. Book direct with hotels and airlines so that 100% of your money goes to the travel provider. The result is a fairer travel ecosystem for everyone
                        </div>
                    </Col>
                    <Col xs={12} md={6} lg={3} className={style.alignCenter}>
                        <img src='/images/zero-comission.png'/>
                    </Col>
                </Row>
                <Row  className='py-5'>
                    <Col  md={6} className='pb-5'>
                        <div className='glider-font-h2-fg'>
                            Conventional system
                        </div>
                        <div className='pb-5 glider-font-text18medium-fg'>
                            Gatekeepers taking commissions or charging hidden fees so you pay more
                        </div>
                        <div >
                            <img className={style.imgmain} src='/images/main-img-left.png'/>
                        </div>
                    </Col>
                    <Col  md={6} className='pr-5'>
                        <div className='glider-font-h2-fg'>
                            Glider
                        </div>
                        <div className='pb-5 glider-font-text18medium-fg'>
                            You pay less, because 100% of your money goes to the travel supplier
                        </div>
                        <div >
                            <img className={style.imgmain} src='/images/main-img-right.png'/>
                        </div>
                    </Col>
                </Row>
            </Container>


        </>
    )
};
