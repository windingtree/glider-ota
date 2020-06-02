import React, {useState} from 'react'
import style from './passenger-selector.module.scss'

import {Button, Dropdown, Container, Row, Col, Form, FormCheck} from 'react-bootstrap'
import {InputGroupRadio} from "react-bootstrap/InputGroup";
import Alert from 'react-bootstrap/Alert';

export default function PassengerSelector({adults, childrn, infants, onAdultsChange, onChildrenChange, onInfantsChange, placeholder = 'passenger',cabin='economy', showCabin = false}) {

    function handleChange(evt){
        console.log("handleChange",evt.target)
        console.log("handleChange state",evt.target.state)
        console.log("handleChange value",evt.target.value)
        console.log("handleChange id",evt.target.id)
        let id = evt.target.id;
        let value = evt.target.value;

    }
    function increase(type) {
        switch (type) {
            case 'adults':
                if (adults < 9) onAdultsChange(adults + 1);
                break;
            case 'children':
                if (childrn < 9) onChildrenChange(childrn + 1);
                break;
            case 'infants':
                if (infants < 9) onInfantsChange(infants + 1);
                break;
            default:
                console.log("Passenger type not implemented");
        }
    }

    function decrease(type) {
        switch (type) {
            case 'adults':
                if (adults > 0) onAdultsChange(adults - 1);
                break;
            case 'children':
                if (childrn > 0) onChildrenChange(childrn - 1);
                break;
            case 'infants':
                if (infants > 0) onInfantsChange(infants - 1);
                break;
            default:
                console.log("Passenger type not implemented");
        }
    }

    function getTotal() {
        return adults + childrn + infants;
    }

    // Display a warning when attempting to book infant
    // As Air Canada does not support it yet
    const infantWarning = () => {
        return (
            <Row>
                <Alert variant='warning' className={style.passengerWarning}>
                    We are sorry, we do not support bookings with infants right now!
                    We invite you to make a booking without infants and then
                    call the Air Canada service center to add the infant ticket.
                </Alert>
            </Row>
        );
    };

    const total = getTotal();
    return (
        <>
            <Dropdown bsPrefix={style.paxSelector}>
                <Dropdown.Toggle className={style.paxSelectorDropdown} id='dropdown-basic' as="button">
                    {total} {placeholder}{total > 1 ? 's' : ''}
                </Dropdown.Toggle>
                <Dropdown.Menu className={style.paxSelectorContainer} >
                    <Container>
                        <Row className={style.paxSelectorRow}>
                            <Col xs={6}>
                                <div className={style.paxSelectorTitle}>
                                    Adults
                                </div>
                                <div className={style.paxSelectorSubtitle}>
                                    over 12
                                </div>
                            </Col>
                            <Col xs={6} className={style.paxSelectorButtons}>
                                <Button className={style.paxSelectorButton} onClick={() => decrease('adults')} variant=' pax-btn-circle pax-btn-decrease' size='sm'>—</Button>
                                <span className={style.paxSelectorPaxCount}>{adults}</span>
                                <Button className={style.paxSelectorButton} onClick={() => increase('adults')} variant=' pax-btn-circle pax-btn-increase' size='sm'>+</Button>
                            </Col>
                        </Row>
                        <Row className={style.paxSelectorRow}>
                            <Col xs={6}>
                                <div className={style.paxSelectorTitle}>
                                    Children
                                </div>
                                <div className={style.paxSelectorSubtitle}>
                                    2-12
                                </div>
                            </Col>
                            <Col xs={6} className={style.paxSelectorButtons}>
                                <Button onClick={() => decrease('children')} variant=' pax-btn-circle pax-btn-decrease' size='sm'>—</Button>
                                <span className={style.paxSelectorPaxCount}>{childrn}</span>
                                <Button onClick={() => increase('children')} variant=' pax-btn-circle pax-btn-increase' size='sm'>+</Button>
                            </Col>
                        </Row>
                        <Row className={style.paxSelectorRow}>
                            <Col xs={6}>
                                <div className={style.paxSelectorTitle}>
                                    Infants
                                </div>
                                <div className={style.paxSelectorSubtitle}>
                                    Under 2, lap infant
                                </div>
                                
                            </Col>
                            <Col xs={6} className={style.paxSelectorButtons}>
                                <Button onClick={() => decrease('infants')} variant=' pax-btn-circle pax-btn-decrease' size='sm'>—</Button>
                                <span className={style.paxSelectorPaxCount}>{infants}</span>
                                <Button onClick={() => increase('infants')} variant=' pax-btn-circle pax-btn-increase' size='sm'>+</Button>
                            </Col>
                        </Row>
                        { infants > 0 && infantWarning()}
                        {showCabin && (
                        <Row >
                            <Col className={style.divider}>
                                <div className={style.radioLabel}>
                                    <input type="radio"  className={style.radio} id="economy_cabin" name="cabin" checked={true}/>Economy
                                </div>

                                <div className={style.radioLabel}>
                                    <input type="radio" className={style.radio} id="business_cabin" name="cabin" disabled={true}/><label> Business</label>
                                </div>
                            </Col>
                        </Row>)}
                    </Container>
                </Dropdown.Menu>
            </Dropdown>
        </>
    )
}
