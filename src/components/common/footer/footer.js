import React from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Nav from 'react-bootstrap/Nav'

import './footer.css'

export default function Footer (props) {
  return (
    <footer className='footer'>
      <Container>
        <Row>
          <Col sm={2}><img alt='logo' src='https://windingtree.com/assets/img/logo/sm-color.svg' /></Col>
          <Col>
            <Nav defaultActiveKey='/' className='flex-column footernav'>
              <Nav.Link disabled className='nav-title'>Solutions</Nav.Link>
              <Nav.Link>Hotels</Nav.Link>
              <Nav.Link>Avia</Nav.Link>
              <Nav.Link>OTA</Nav.Link>
              <Nav.Link>Insurance company</Nav.Link>
            </Nav>
          </Col>
          <Col>
            <Nav defaultActiveKey='/' className='flex-column footernav'>
              <Nav.Link disabled className='nav-title'>Foundation</Nav.Link>
              <Nav.Link>About</Nav.Link>
              <Nav.Link>Team</Nav.Link>
              <Nav.Link>Events</Nav.Link>
              <Nav.Link>Services</Nav.Link>
              <Nav.Link>Roadmap</Nav.Link>
              <Nav.Link>White paper</Nav.Link>
            </Nav>
          </Col>
          <Col>
            <Nav defaultActiveKey='/' className='flex-column footernav'>
              <Nav.Link disabled className='nav-title'>Community</Nav.Link>
              <Nav.Link>Official page</Nav.Link>
              <Nav.Link>Blog</Nav.Link>
              <Nav.Link>Developer portal</Nav.Link>
              <Nav.Link>Github</Nav.Link>
            </Nav>
          </Col>
          <Col>
            <Nav defaultActiveKey='/' className='flex-column footernav'>
              <Nav.Link disabled className='nav-title'>Solutions</Nav.Link>
              <Nav.Link disabled>Gubelstrasse 11, 6300 Zug, Switzerland</Nav.Link>
              <Nav.Link href='mailto:info@windingtree.com'>info@windingtree.com</Nav.Link>
            </Nav>
          </Col>
          <Col sm={2} />
        </Row>
      </Container>
    </footer>
  // <div style={{border: "solid 1px blue" }}>footer</div>
  )
}
