import React, { useEffect, useState } from 'react'
import style from './passenger-selector.module.scss'

import {Button, Dropdown, Container, Row, Col} from 'react-bootstrap'
import Alert from 'react-bootstrap/Alert';

export default function PassengerSelector(props) {
    const {
        adults,
        children,
        infants,
        onAdultsChange,
        onChildrenChange,
        onInfantsChange,
        placeholder = 'passenger',
        cabin = 'economy',
        showCabin = false,
        maxPassengers,
        infantsAllowed = true,
        label
    } = props;
    const [passengers, setPassengers] = useState({
        adults, children, infants
    });

    console.log('$$$', passengers);

    // useEffect(() => {
    //     setPassengers({
    //         adults, children, infants
    //     });
    // }, [adults, children, infants]);

    useEffect(() => {
        // console.log('Passengers updated', passengers);
        sessionStorage.setItem(`inputfield-passengers-count`, JSON.stringify(passengers));
    }, [passengers]);

    function increase(type) {
        if (!maxPassengers || (getTotal() < maxPassengers)) {
            switch (type) {
                case 'adults':
                    setPassengers(p => {
                        p.adults += 1;
                        onAdultsChange(p.adults);
                        return p;
                    });
                    break;
                case 'children':
                    setPassengers(p => {
                        p.children += 1;
                        onChildrenChange(p.children);
                        return p;
                    });
                    break;
                case 'infants':
                    setPassengers(p => {
                        p.infants += 1;
                        onInfantsChange(p.infants);
                        return p;
                    });
                    break;
                default:
                    console.log("Passenger type not implemented");
                }
        }
    }

    function decrease(type) {
        switch (type) {
            case 'adults':
                setPassengers(p => {
                    if (adults > 0) {
                        p.adults -= 1;
                    }
                    onAdultsChange(p.adults);
                    return p;
                });
                break;
            case 'children':
                setPassengers(p => {
                    if (children > 0) {
                        p.children -= 1;
                    }
                    onChildrenChange(p.children);
                    return p;
                });
                break;
            case 'infants':
                setPassengers(p => {
                    if (infants > 0) {
                        p.infants -= 1;
                    }
                    onInfantsChange(p.infants);
                    return p;
                });
                break;
            default:
                console.log("Passenger type not implemented");
        }
    }

    function getTotal() {
        return adults + children + infants;
    }

    // Display a warning when attempting to book infant
    // As Air Canada does not support it yet
    const infantWarning = () => {
        return (
            <Row>
                <Alert variant='warning' className={style.passengerWarning}>
                    We are sorry, we do not support flight bookings with infants online right now!
                </Alert>
            </Row>
        );
    };

    // Display a warning when attempting to book children alone
    const unaccompaniedMinorWarning = () => {
        return (
            <Row>
                <Alert variant='warning' className={style.passengerWarning}>
                    We are sorry, we do not support unaccompanied minors
                    bookings! We invite you to make a booking with an adult
                    or call the service center for this specific service.
                </Alert>
            </Row>
        );
    };

    // Display a warning if two many passengers are selected
    const maxPassengersWarning = () => {
        return (
            <Row>
                <Alert variant='warning' className={style.passengerWarning}>
                    You have reached the maximum number of {maxPassengers} passengers for this booking!
                    If you want to book for more passengers, please create separate bookings.
                </Alert>
            </Row>
        );
    }

    const total = getTotal();
    const maxPassengerReached = maxPassengers && (total >= maxPassengers);
    const hasOnlyMinors = (children > 0) && (adults === 0);

    return (
        <>
            {label && <div className={style.label}>{label}</div>}
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
                                <Button className={style.paxSelectorButton} onClick={() => decrease('adults')} variant=' pax-btn-circle pax-btn-decrease' size='sm'><span>—</span></Button>
                                <span className={style.paxSelectorPaxCount}>{passengers.adults}</span>
                                <Button className={style.paxSelectorButton} onClick={() => increase('adults')} variant=' pax-btn-circle pax-btn-increase' size='sm'><span>+</span></Button>
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
                                <Button onClick={() => decrease('children')} variant=' pax-btn-circle pax-btn-decrease' size='sm'><span>—</span></Button>
                                <span className={style.paxSelectorPaxCount}>{passengers.children}</span>
                                <Button onClick={() => increase('children')} variant=' pax-btn-circle pax-btn-increase' size='sm'><span>+</span></Button>
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
                                <Button onClick={() => decrease('infants')} variant=' pax-btn-circle pax-btn-decrease' size='sm'><span>—</span></Button>
                                <span className={style.paxSelectorPaxCount}>{passengers.infants}</span>
                                <Button onClick={() => increase('infants')} variant=' pax-btn-circle pax-btn-increase' size='sm'><span>+</span></Button>
                            </Col>
                        </Row>
                        { !infantsAllowed && infants > 0 && infantWarning()}
                        { maxPassengerReached && maxPassengersWarning() }
                        { hasOnlyMinors && unaccompaniedMinorWarning() }
                        { showCabin && (
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
