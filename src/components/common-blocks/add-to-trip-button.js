import React from 'react';
import style from "./add-to-trip.module.scss";
import classNames from 'classnames/bind';
import {Col, Row, Spinner} from "react-bootstrap";

let cx = classNames.bind(style);


export const AddToTrip = ({priceAmount, numberOfNights, priceCurrency, isAlreadyAdded, onAdd, isProgress}) => {

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
        addButton: true,
        addButtonActive:!isAlreadyAdded,
        addButtonInactive:isAlreadyAdded,
        addIcon: !isAlreadyAdded && !isProgress,
        addedIcon: isAlreadyAdded && !isProgress,
        addProgress: isProgress
    });

    return (
        <div>
            <Row className={style.priceRow}>
                <Col className={style.priceWrapper}>
                    {numberOfNights>0 && <div className={style.numberOfNights}>Price for {numberOfNights} night{numberOfNights>1?'s':''}</div>}
                    <div className={priceClassnames}>{priceAmount} {priceCurrency}</div>
                </Col>
                <Col className={style.addButtonWrapper}>
                    <button
                        title={isAlreadyAdded
                            ? 'Added to trip'
                            : 'Add to trip'}
                        className={buttonClassnames}
                        onClick={!isProgress ? handleButtonClick: () => {}}
                    >
                        {isAlreadyAdded
                            ? !isProgress ? 'Added to trip' : 'Removing from trip'
                            : !isProgress ? 'Add to trip' : 'Adding to trip'}
                        {isProgress &&
                            <Spinner
                                className={style.btnSpinner}
                                enabled="true"
                                animation="border"
                                size='sm'
                                variant='primary'
                            />
                        }
                    </button>
                </Col>
            </Row>
        </div>
    );
}

