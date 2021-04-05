import React from 'react';
import style from "./cookie-consent-banner.module.scss";
import {Button, Container} from "react-bootstrap";
import {useCookies} from 'react-cookie'
import {gaUserEvent} from "./google-analytics"
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

export const COOKIE_NAME='cookie-consent'

export const CookieConsentBanner = () => {
    const [cookies, setCookie] = useCookies([COOKIE_NAME]);


    const onAgreeClick = () =>{
        setCookie(COOKIE_NAME, true)
        gaUserEvent('cookie-consent','enabled')
    }


    const showBanner = () => {
        return cookies[COOKIE_NAME] === undefined
    }
    if(!showBanner())
        return null;

    return (
        <Container className={style.cookiealert}  fluid>
            <Row>
                <Col xs={0} md={3}>

                </Col>
                <Col xs={12} md={6}>
                    <Container fluid >
                        <Row  className="justify-content-md-center">
                            <Col xs={12} className={style.banner} >
                                <Row>
                                    <Col xs={7} md={8}>
                                        🍪 🍪 🍪 🍪 🍪 🍪 🍪 🍪 🍪 🍪 🍪 🍪 🍪
                                    </Col>
                                    <Col xs={5} md={4}>
                                        <Button onClick={onAgreeClick} bsPrefix={'cookiebtn'}>Ah, cookies... Fine</Button>
                                    </Col>
                                </Row>
                            </Col>
                        </Row> </Container>
                </Col>
                <Col xs={0} md={3}>

                </Col>
            </Row>
        </Container>
    );
}



