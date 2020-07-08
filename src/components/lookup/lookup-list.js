import React, {useState} from 'react'
import {Overlay, Popover, ListGroup, Form, Col,Row, Container} from 'react-bootstrap'
import style from './lookup-list.module.scss'
import PropTypes from 'prop-types'

export default function LookupList({locations=[], onLocationSelected}){
    let key = 0;
    function selected(rec){
        onLocationSelected(rec)
    }
    return (
        <Container className={style.list}>
            {locations.map(rec=>{
                return (
                    <Row noGutters={true} className={style.row} key={createKey(rec.primary,rec.secondary,rec.code)} onClick={event => selected(rec)}>
                        <Col xs={9}  className={style.primaryText}>
                            {rec.indent && <span className={style.indent}/>}
                            {rec.primary} <span className={style.secondaryText}>{rec.secondary}</span>
                        </Col>
                        <Col xs={3} className={style.codeText}>{rec.code}</Col>
                    </Row>
                )
            })}
        </Container>)
}

function createKey(a,b,c){
    return a+b+c;
}

LookupList.propTypes = {
    locations:PropTypes.array
}
