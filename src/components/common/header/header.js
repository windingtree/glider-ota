import React from 'react'
import {Row, Col, Image, Container} from 'react-bootstrap/'
import style from './header.module.scss'
import Logo from "../logo";

export default function Header({violet = false}) {
    return (
        <header className={style.header}>
            <Container fluid={true}>
                <Row noGutters={true}>
                    <Col className={style.logocontainer}>
                        <div className={style.logo}><Logo violet={violet}/></div>
                    </Col>
                </Row>
            </Container>
        </header>
    )
}

