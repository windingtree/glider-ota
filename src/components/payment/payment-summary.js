import React from 'react'
import style from "./payment-summary.module.scss"
import {Accordion, Button, Card, Col, Row, Tab, Tabs} from "react-bootstrap";
import linkifyHtml from 'linkifyjs/html';


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
                    <OpcFee opcFee={totalPrice.opcFee}/>
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
function OpcFee({opcFee}) {
    return (
        <>
            <div className={style.itemTitle}>Fees</div>
                    <div>
                        <div className={style.itemName}>Card processing fee</div>
                        <div className={style.itemPrice}>{opcFee}</div>
                    </div>
        </>
    )
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
    //find fare basis codes(aka 'components') which have fare rules populated (aka 'conditions')
    let componentsWithConditions = components.filter(c => (c.conditions && c.conditions.trim().length > 0));
    //only display terms & conditions when they exist
    //only display fare rules when they exist
    return (
        <Accordion className={'termsconditions'}>
            {terms && terms.length>0 && (
            <Card>
                <Card.Header>
                    <Accordion.Toggle as={Button} variant="link" eventKey="0">
                        Terms & conditions
                    </Accordion.Toggle>
                </Card.Header>
                <Accordion.Collapse eventKey="0">
                    <Card.Body>
                        <div className={style.termsText} dangerouslySetInnerHTML={convertToParagraphsAndRemoveDupes(terms)}></div>
                    </Card.Body>
                </Accordion.Collapse>
            </Card>)}
            {componentsWithConditions.length>0 && (
            <Card>
                <Card.Header>
                    <Accordion.Toggle as={Button} variant="link" eventKey="1">
                        Fare rules
                    </Accordion.Toggle>
                </Card.Header>
                <Accordion.Collapse eventKey="1">
                    <Card.Body><FareRules components={componentsWithConditions} /></Card.Body>
                </Accordion.Collapse>
            </Card>
            )}
        </Accordion>
    )
}


function FareRules({components=[]}) {
    let idx=0;
    components=removeDuplicateFareRules(components);        //if there are two same rules (having same booking class, fare basis code, conditoions text and name) - keep only one
    return (
        <div className='fareRules'>
        <Tabs defaultActiveKey={idx} id="fare-rules" >
        {
            components.map((component)=>(
                <Tab title={ component.basisCode+" - "+component.name } eventKey={idx++} key={idx}>
                    <div className={style.fareRulesText} dangerouslySetInnerHTML={convertToParagraphsAndRemoveDupes(component.conditions)}>
                    </div>
                </Tab>
            ))
        }
        </Tabs>
        </div>
    )
}


const convertToParagraphsAndRemoveDupes = (text) =>{
    text = replaceTextLinksWithHrefs(text);     //convert "http://aircanada.com/blahblah" to "<a href='http://aircanada.com/blahblah' target=_blank>http://aircanada.com/blahblah</a>"
    let lines = text.split('\n');
    let result = [];
    lines.forEach((line,idx) =>{
        result.push("<p >"+line+"</p>");
    })
    // return result;
    return {__html: result.join("")};
}


function replaceTextLinksWithHrefs(inputText){
    return linkifyHtml(inputText)
}

function removeDuplicateFareRules(components)
{
    const uniqueComponents=[];
    const isFareRuleAlreadyExisting = (component) => {
        for(let i=0;i<uniqueComponents.length;i++){
            const rule = uniqueComponents[i];
            if(rule.name === component.name && rule.basisCode === component.basisCode && rule.designator === component.designator && rule.conditions === component.conditions)
                return true;
        }
        return false;
    }

    components.forEach(component=>{
        if(!isFareRuleAlreadyExisting(component))
            uniqueComponents.push(component)
    })
    return uniqueComponents;
}
