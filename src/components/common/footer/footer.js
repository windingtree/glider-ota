import React from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Nav from 'react-bootstrap/Nav'

import css from './footer.scss'

export default function Footer (props) {
  return (
    <footer className="footer">
      <Container>
        <Row>
          <Col sm={2}><img alt="logo" src="https://windingtree.com/assets/img/logo/sm-color.svg" /></Col>
          <Col>
            <Nav defaultActiveKey="/" className="footer__nav flex-column">
              <Nav.Link disabled className="footer__nav-title">Solutions</Nav.Link>
              <Nav.Link className="footer__nav-link">Hotels</Nav.Link>
              <Nav.Link className="footer__nav-link">Avia</Nav.Link>
              <Nav.Link className="footer__nav-link">OTA</Nav.Link>
              <Nav.Link className="footer__nav-link">Insurance company</Nav.Link>
            </Nav>
          </Col>
          <Col>
            <Nav defaultActiveKey="/" className="footer__nav flex-column">
              <Nav.Link disabled className="footer__nav-title">Foundation</Nav.Link>
              <Nav.Link className="footer__nav-link">About</Nav.Link>
              <Nav.Link className="footer__nav-link">Team</Nav.Link>
              <Nav.Link className="footer__nav-link">Events</Nav.Link>
              <Nav.Link className="footer__nav-link">Services</Nav.Link>
              <Nav.Link className="footer__nav-link">Roadmap</Nav.Link>
              <Nav.Link className="footer__nav-link">White paper</Nav.Link>
            </Nav>
          </Col>
          <Col>
            <Nav defaultActiveKey="/" className="footer__nav flex-column">
              <Nav.Link disabled className="footer__nav-title">Community</Nav.Link>
              <Nav.Link className="footer__nav-link">Official page</Nav.Link>
              <Nav.Link className="footer__nav-link">Blog</Nav.Link>
              <Nav.Link className="footer__nav-link">Developer portal</Nav.Link>
              <Nav.Link className="footer__nav-link">Github</Nav.Link>
            </Nav>
          </Col>
          <Col>
            <Nav defaultActiveKey="/" className="footer__nav flex-column">
              <Nav.Link disabled className="footer__nav-title">Solutions</Nav.Link>
              <Nav.Link disabled>Gubelstrasse 11, 6300 Zug, Switzerland</Nav.Link>
              <Nav.Link className="footer__nav-link" href="mailto:info@windingtree.com">info@windingtree.com</Nav.Link>
            </Nav>
          </Col>
          <Col sm={2} />
        </Row>
      </Container>
    </footer>
  )
}
