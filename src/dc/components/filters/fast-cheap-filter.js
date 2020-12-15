import React, {useState} from 'react';
import style from "./fast-cheap-filter.module.scss"
import {Row, Col, Button} from "react-bootstrap";

const VALUE_PRICE = 'PRICE';
const VALUE_DURATION = 'DURATION';

export function FastCheapFilter({defaultValue = VALUE_PRICE, onToggle}) {

    const [value, setValue] = useState(defaultValue);
    const onPriceClick = () => {
        setValue(VALUE_PRICE);
        onToggle(VALUE_PRICE);
    }
    const onDurationClick = () => {
        setValue(VALUE_DURATION);
        onToggle(VALUE_DURATION);
    }
    return (
        <div className={style.fastCheapFilterToggle}>
            <Row className={style.fastCheapFilterContainer} noGutters={true}>
                <Col xs={6}>
                    <Button className={style.fastCheapFilterToggleBtnCheapest}
                            variant={value === VALUE_PRICE ? "primary" : "outline-primary"}
                            onClick={onPriceClick}>Cheapest</Button>
                </Col>
                <Col xs={6}>
                    <Button className={style.fastCheapFilterToggleBtnFastest}
                            variant={value === VALUE_DURATION ? "primary" : "outline-primary"}
                            onClick={onDurationClick}>Fastest</Button>
                </Col>
            </Row>
        </div>)
}
