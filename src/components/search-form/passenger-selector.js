import React, {useState} from 'react'
import './passenger-selector.scss'
import {Button, Dropdown, Container,Row,Col} from 'react-bootstrap'

export default function PassengerSelector({adults, childrn, infants, onAdultsChange, onChildrenChange, onInfantsChange}) {

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
        }
    }

    function getTotal() {
        return adults + childrn;
    }

    const total = getTotal();
    return (
        <>
            <Dropdown bsPrefix='passenger-selector'>
                <Dropdown.Toggle className='passenger-selector__dropdown' id='dropdown-basic' as="button">
                    {total} passenger{total > 1 ? 's' : ''}
                </Dropdown.Toggle>
                <Dropdown.Menu className='passenger-selector__container' >
                    <Container>
                        <Row className='passenger-selector__row'>
                            <Col xs={6}>
                                <div className='passenger-selector__title'>
                                    Adults
                                </div>
                                <div className='passenger-selector__subtitle'>
                                    over 12
                                </div>
                            </Col>
                            <Col xs={6} className='passenger-selector__buttons'>
                                <Button onClick={() => decrease('adults')} variant='light' size='sm'>-</Button>
                                <span className='passenger-selector__pax-count px-2'>{adults}</span>
                                <Button onClick={() => increase('adults')} variant='primary' size='sm'>+</Button>
                            </Col>
                        </Row>
                        <Row className='passenger-selector__row'>
                            <Col xs={6}>
                                <div className='passenger-selector__title'>
                                    Children
                                </div>
                                <div className='passenger-selector__subtitle'>
                                    2-12
                                </div>
                            </Col>
                            <Col xs={6} className='passenger-selector__buttons'>
                                <Button onClick={() => decrease('children')} variant='light' size='sm'>-</Button>
                                <span className='passenger-selector__pax-count px-2'>{childrn}</span>
                                <Button onClick={() => increase('children')} variant='primary' size='sm'>+</Button>
                            </Col>
                        </Row>
                        <Row className='passenger-selector__row'>
                            <Col xs={6}>
                                <div className='passenger-selector__title'>
                                    Infants
                                </div>
                                <div className='passenger-selector__subtitle'>
                                    Under 2, lap infant
                                </div>
                            </Col>
                            <Col xs={6} className='passenger-selector__buttons'>
                                <Button onClick={() => decrease('infants')} variant='light' size='sm'>-</Button>
                                <span className='passenger-selector__pax-count px-2'>{infants}</span>
                                <Button onClick={() => increase('infants')} variant='primary' size='sm'>+</Button>
                            </Col>
                        </Row>
                    </Container>
                </Dropdown.Menu>
            </Dropdown>
        </>
    )
}
