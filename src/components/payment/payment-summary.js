import React, {useState} from 'react'
import style from "./payment-summary.module.scss"
import {Col, Container, Form, Row} from "react-bootstrap";


export default function PaymentSummary({totalPrice, pricedItems=[], options=[]}) {
    let pricedItem=pricedItems[0];  //FIXME - may htere be more elements?
    return (
        <div>
            <Row noGutters={true}>
                <Col md={8}>
                    <Row noGutters={true}><h2 className={style.header}>Payment</h2></Row>
                    <Taxes items={pricedItem.taxes} title="Taxes, fees and charges" type="taxes"/>
                    <Fare items={pricedItem.fare} title="Air transportation taxes" type="fare"/>
                    {options && options.length >0 ? (<Options options={options}/>) : null}
                    <div className={style.totalTitle}>GRAND TOTAL</div>
                    <div className={style.totalPrice}>{totalPrice.public}</div>
                </Col>
            </Row>
        </div>
    )
}

function Taxes({items, title, type}) {
    return (
        <>
            <div className={style.itemTitle}>{title}</div>
            {
                items.map((item)=>(
                   <div key={item.code}>
                       <div className={style.itemName}>{item.description} {item.code}</div>
                       <div className={style.itemPrice}>{item.amount}</div>
                   </div>
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
                    <div key={item.usage}>
                        <div className={style.itemName}>{fareTypeMap[item.usage]?fareTypeMap[item.usage]:item.usage}</div>
                        <div className={style.itemPrice}>{item.amount}</div>
                    </div>
                ))
            }
        </>
    )
}

function Options({options}) {
    // Get the base price of an option
    const getOptionBasePrice = (option) => {
        return Number(
            Number(option.price.public) - Number(option.price.taxes) 
        ).toFixed(2);
    };

    // Render component
    return (
        <>
            <div className={style.itemTitle}>Options</div>
            {
                options.map((option, key)=>(
                    <div key={key}>
                        <div className={style.itemName}>{option.name}</div>
                        <div className={style.itemPrice}>{getOptionBasePrice(option)}</div>
                    </div>
                ))
            }
        </>
    )
}
