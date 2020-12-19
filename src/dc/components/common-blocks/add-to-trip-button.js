import React,{useState} from 'react';
import style from "./add-to-trip.module.scss"
import {FaPlus, FaCheck} from "react-icons/fa";
import classNames from 'classnames/bind';
import {Col, Container, Row} from "react-bootstrap";
let cx = classNames.bind(style);


export const AddToTrip = ({priceAmount, priceCurrency, isAlreadyAdded, onAdd}) => {

    const handleButtonClick = () => {
        if(onAdd){
            onAdd()
        }else{
            console.warn('onAdd is not defined1')
        }
    }

    let priceClassnames=cx({
        priceActive:!isAlreadyAdded,
        priceInactive:isAlreadyAdded,
    })
    let buttonClassnames=cx({
        btn:true,
        'btn-outline-primary':true,
        'float-right':true,
        addButtonActive:!isAlreadyAdded,
        addButtonInactive:isAlreadyAdded,
    })

    const alreadyAdded = () => {
        return (<>Already added <FaCheck/></>)
    }
    const notYetAdded = () => {
        return (<> Add to trip <FaPlus/></>)
    }

    return (
        <div>
            <Row className={style.priceRow}>
                <Col className={style.priceWrapper}>
                    <div className={priceClassnames}>{priceAmount} {priceCurrency}</div>
                </Col>
                <Col className={style.addButtonWrapper}>
                    <button className={buttonClassnames} onClick={handleButtonClick}>
                        {(isAlreadyAdded===true) && alreadyAdded()}
                        {(isAlreadyAdded===false) && notYetAdded()}
                    </button>
                </Col>
            </Row>
        </div>
    );
}

