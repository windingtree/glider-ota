import React from 'react'
import {Row,Col, Image,Container} from 'react-bootstrap/'

import './header.scss'

export default function Header ({type}) {
    if(type === 'white'){
        return (
            <header className="header">
                <Container fluid={true}>
                    <Row className='logo logo_white'>
                        <div><img alt="logo" src="/images/logo_white.png" /></div>
                        <div className='logo_white'>Glider</div>
                    </Row>
                </Container>
            </header>
        )
    }

    if(type === 'violet'){
        return (
            <header className="header ">
                <Container fluid={true} className=" flight-results-outer-boundary">
                    <Row className='logo '>
                        {/*<Col className='logo'>*/}
                            <div><img alt="logo" src="/images/logo_violet.png" /></div>
                            <div className='logo_black'>Glider</div>
                        {/*</Col>*/}
                    </Row>
                </Container>
            </header>
        )
    }
}

