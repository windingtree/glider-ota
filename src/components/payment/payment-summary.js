import React, {useState} from 'react'
import style from "./payment-summary.module.scss"
import {Accordion, Card, Col, Container, Form, Row, Tab, Tabs, Button} from "react-bootstrap";


export default function PaymentSummary({offer}) {
    const totalPrice = offer.price;
    const pricedItems = offer.pricedItems;
    const options = offer.options;

    let pricedItem=pricedItems[0];  //FIXME - may htere be more elements?
    return (
        <div>
            <Row noGutters={true}>
                <Col md={8}>
                    <Row noGutters={true}><h2 className={style.header}>Payment</h2></Row>
                    <Taxes items={pricedItem.taxes} title="Taxes, fees and charges" type="taxes"/>
                    <Fare items={pricedItem.fare} title="Air transportation taxes" type="fare"/>
                    {options && options.length >0 ? (<Options options={options}/>) : null}
                    <TermsFareRules offer={offer}/>
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
                items.map((item, idx)=>(
                   <div key={idx}>
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
                items.map((item, idx)=>(
                    <div key={idx}>
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

const replaceNewlineWithParagraph = (text) =>{
    let lines = text.split('\n');
    let result = [];
    lines.map((line,idx) =>{
        result.push(<p key={idx}>{line}</p>);
    })
    return result;
}



export function TermsFareRules({offer}){
    const terms = offer.terms;
    const components = [];
    if(offer.pricedItems && offer.pricedItems.length>0){
        offer.pricedItems.forEach(pricedItem=>{
            if(pricedItem.fare && pricedItem.fare.length>0){
                pricedItem.fare.forEach(fare=>{
                    if(fare.components && fare.components.length>0){
                        fare.components.forEach(component=>{
                            components.push(component);
                        })
                    }
                })
            }
        })
    }
    return (
        <Accordion className={'termsconditions'}>
            <Card>
                <Card.Header>
                    <Accordion.Toggle as={Button} variant="link" eventKey="0">
                        Terms & conditions
                    </Accordion.Toggle>
                </Card.Header>
                <Accordion.Collapse eventKey="0">
                    <Card.Body>
                        <div className={style.termsText}>{replaceNewlineWithParagraph(terms)}</div>
                    </Card.Body>
                </Accordion.Collapse>
            </Card>
            <Card>
                <Card.Header>
                    <Accordion.Toggle as={Button} variant="link" eventKey="1">
                        Fare rules
                    </Accordion.Toggle>
                </Card.Header>
                <Accordion.Collapse eventKey="1">
                    <Card.Body><FareRules components={components} /></Card.Body>
                </Accordion.Collapse>
            </Card>
        </Accordion>
    )
}


function FareRules({components=[]}) {
    let idx=0;
    return (
        <div className='fareRules'>
        <Tabs defaultActiveKey={idx} id="fare-rules" >
        {
            components.map((component)=>(
                <Tab title={component.name + '('+component.designator+')' } eventKey={idx++} key={idx}>
                    <div className={style.fareRulesText}>
                        {replaceNewlineWithParagraph(component.conditions)}
                    </div>
                </Tab>
            ))
        }
        </Tabs>
        </div>
    )
}
