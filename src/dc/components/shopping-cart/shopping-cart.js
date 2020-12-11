import React from 'react'
import style from './shopping-cart.module.scss'
import {HorizontalDottedLine} from "../common-blocks/horizontal-line"
import {Col, Container, Row} from 'react-bootstrap'
import _ from 'lodash'
import classNames from 'classnames/bind';
let cx = classNames.bind(style);

const SubTotal = ({title,price, currency}) =>{
    let cls=cx({
        subtotalItem:true,
        'float-right':true,
    })
    return (
        <div className={'pt-2 pb-2'}>
            <Row >
                <Col >
                    <div className={style.subtotalItem}>{title}</div>
                </Col>
                <Col >
                    <div className={cls}>{price}{currency}</div>
                </Col>
            </Row>
        </div>)
}

const Total = ({title,price, currency}) =>{
    let cls=cx({
        totalItem:true,
        'float-right':true,
    })
    return (
        <div  className={'pt-2 pb-2'}>
            <Row >
                <Col >
                    <div className={style.totalItem}>{title}</div>
                </Col>
                <Col >
                    <div className={cls}>{price}{currency}</div>
                </Col>
            </Row>
        </div>)
}

export const ShoppingCart = ({flightOffer, hotelOffer, onBook}) =>{

    const onBookHandler = (e) => {
        e.preventDefault();
        if(onBook) {
            onBook()
        }
        else{
            console.warn('onBook is not defined!')
        }
    }
    let bookButtonClassnames=cx({
        btn:true,
        'btn-primary':true,
        'btn-block':true
    })

    return (
        <div className={style.cartContainer}>
            <div className={style.cartHeader}>Your trip so far</div>
            <HorizontalDottedLine/>
            <HorizontalDottedLine/>
            <SubTotal price={123} currency={"$"} title={"Flights:"}/>
            <SubTotal price={123} currency={"$"} title={"Hotels:"}/>
            <Total price={123} currency={"$"} title={"Total:"}/>
            <div className={'pt-2'}/>
            <a href={"#"} className={bookButtonClassnames} onClick={onBookHandler}>Book</a>
        </div>

    )
}

