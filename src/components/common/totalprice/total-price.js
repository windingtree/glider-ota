import React from 'react'
import style from './total-price.module.scss'
import { Row, Col, Button} from 'react-bootstrap'

export default function TotalPriceButton({
    price,
    proceedButtonTitle = 'Proceed',
    proceedCryptoTitle = 'Pay with Crypto',
    disabled = false,
    onProceedClicked,
    onProceedCryptoClicked,
    forPayment=false
}) {
    function click(){
        onProceedClicked();
    }
    return (
        <Row className='pt-5 pb-5' >
            <Col xs={12} md={6} className={style.priceContainer}>
                <span className={style.price}>Total price {price.public} {price.currency}</span>
            </Col>
            <Col xs={12} md={6} className={style.buttonContainer}>
                {forPayment &&
                    <Row>
                        <Col>
                            <Button
                                disabled={disabled}
                                variant={"primary"}
                                size={"lg"}
                                onClick={() => onProceedCryptoClicked()}
                            >
                                {proceedCryptoTitle}
                            </Button>
                        </Col>
                        <Col>
                            <Button disabled={disabled} variant={"primary"} size={"lg"}  onClick={click}>{proceedButtonTitle}</Button>
                        </Col>
                    </Row>
                }
                {!forPayment &&
                    <Button disabled={disabled} variant={"primary"} size={"lg"}  onClick={click}>{proceedButtonTitle}</Button>
                }
            </Col>
        </Row>
    )
}

