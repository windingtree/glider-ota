import React from 'react'
import style from './total-price.module.scss'
import {Container, Row, Col, Image, Button} from 'react-bootstrap'

export default function TotalPriceButton({price, proceedButtonTitle = 'Proceed', disabled=false, onProceedClicked}) {
    function click(){
        onProceedClicked();
    }
    return (
        <Row className='pt-5' >
            <Col xs={12} md={6} className={style.priceContainer}>
                <span className={style.price}>Total price {price.public} {price.currency}</span>
            </Col>
            <Col xs={12} md={6} className={style.buttonContainer}>
                <Button disabled={disabled} variant={"primary"} size={"lg"}  onClick={click}>{proceedButtonTitle}</Button>
            </Col>
        </Row>
    )
}

