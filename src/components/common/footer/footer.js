import React from 'react'
import {Container,Row,Col,Nav} from 'react-bootstrap'
import css from './footer.scss'

export default function Footer (props) {
  return (
    <footer className="footer py-5">
      <Container fluid={true}>
        <Row>
          <Col md={4} sm={12} >

            <Container fluid={true}>
              <Row className='logo '>
                <div><img alt="logo" src="/images/logo_violet.png" /></div>
                <div className='logo_black'>Glider</div>
              </Row>
            </Container>

          </Col>
          <Col md={8} sm={12}>

            <Container>
              <Row>
                <Col md={3} >
                  <div className='footer__nav-title'>Airlines</div>
                  <div className='footer__nav-link'>Air France</div>
                  <div className='footer__nav-link'>Air Canada</div>
                </Col>
                <Col md={3}>
                  <div className='footer__nav-title'>Hotels</div>
                  <div className='footer__nav-link'>Nordic Choice Hotels</div>
                  <div className='footer__nav-link'>Machefert Hotels</div>
                </Col>
                <Col md={6}>
                  <div className='footer__nav-title'>Contact</div>
                  <div className='footer__nav-link'>
                    Harju maakond, Tallinn Kesklinna linnaosa, Tartu mnt 67/1-13b, 10115
                  </div>
                  <div className='footer__nav-link'><a href='mailto:info@windingtree.com'>info@windingtree.com</a></div>
                </Col>
              </Row>
            </Container>
          </Col>
        </Row>
        <Row>
          <Col md={4} sm={12}></Col>
          <Col className='footer__nav-link'>Operated by Simard OÜ</Col>
          <Col className='footer__nav-link'>Terms of use</Col>
        </Row>
      </Container>
    </footer>)
}
