import React, {useState} from 'react'
import style from "./payment-summary.module.scss"
import {Col, Container, Form, Row} from "react-bootstrap";


export default function PaymentSummary({totalPrice, pricedItems=[]}) {
    let pricedItem=pricedItems[0];  //FIXME - may htere be more elements?
    return (
        <Col md={8}>
            <Row noGutters={true}><h2 className={style.header}>Payment</h2></Row>
            <Taxes items={pricedItem.taxes} title="Taxes, fees and charges" type="taxes"/>
            <Fare items={pricedItem.fare} title="Air transportation taxes" type="fare"/>
            <div className={style.totalTitle}>GRAND TOTAL</div>
            <div className={style.totalPrice}>{totalPrice.public}</div>
        </Col>
    )
}

function Taxes({items, title, type}) {
    return (
        <>
            <div className={style.itemTitle}>{title}</div>
            {
                items.map((item)=>(
                   <>
                       <div className={style.itemName}>{item.description}</div>
                       <div className={style.itemPrice}>{item.amount}</div>
                   </>
                ))
            }
        </>
    )
}

const fareTypeMap={
    'base':'Base fare',
    'surcharge':' Surcharges'
}

function Fare({items, title, type}) {
    return (
        <>
            <div className={style.itemTitle}>{title}</div>
            {
                items.map((item)=>(
                    <>
                        <div className={style.itemName}>{fareTypeMap[item.usage]?fareTypeMap[item.usage]:item.usage}</div>
                        <div className={style.itemPrice}>{item.amount}</div>
                    </>
                ))
            }
        </>
    )
}
