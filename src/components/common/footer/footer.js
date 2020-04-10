import React from 'react'
import {Container,Row,Col,Nav} from 'react-bootstrap'
import css from './footer.scss'

export default function Footer (props) {
  return (
    <footer className="footer">
      <Container fluid={false}>
        <Row>
          <Col md={4}>
            <img alt="logo" src="/images/logo_primary.png" className="logo-small"/>
            <div className='glider-font-text18medium-fg pt-5 mt-2'>Operated by Simard OÜ</div>
          </Col>
          <Col md={8}>
            <Container>
              <Row>
                <Col md={3}>
                  <Nav defaultActiveKey="/" className="footer__nav flex-column">
                    <Nav.Link disabled className="footer__nav-link">Solutions</Nav.Link>
                    <Nav.Link className="footer__nav-link">Hotels</Nav.Link>
                    <Nav.Link className="footer__nav-link">Avia</Nav.Link>
                    <Nav.Link className="footer__nav-link">OTA</Nav.Link>
                    <Nav.Link className="footer__nav-link">Insurance company</Nav.Link>
                  </Nav>
                </Col>
                <Col md={3}>
                  <Nav defaultActiveKey="/" className="footer__nav flex-column">
                    <Nav.Link disabled className="footer__nav-link">Foundation</Nav.Link>
                    <Nav.Link className="footer__nav-link">About</Nav.Link>
                    <Nav.Link className="footer__nav-link">Team</Nav.Link>
                    <Nav.Link className="footer__nav-link">Events</Nav.Link>
                    <Nav.Link className="footer__nav-link">Services</Nav.Link>
                    <Nav.Link className="footer__nav-link">Roadmap</Nav.Link>
                    <Nav.Link className="footer__nav-link">White paper</Nav.Link>
                  </Nav>
                </Col>
                <Col md={3}>
                  <Nav defaultActiveKey="/" className="footer__nav flex-column">
                    <Nav.Link disabled className="footer__nav-link">Community</Nav.Link>
                    <Nav.Link className="footer__nav-link">Official page</Nav.Link>
                    <Nav.Link className="footer__nav-link">Blog</Nav.Link>
                    <Nav.Link className="footer__nav-link">Developer portal</Nav.Link>
                    <Nav.Link className="footer__nav-link">Github</Nav.Link>
                  </Nav>
                </Col>
                <Col md={3}>
                  <Nav defaultActiveKey="/" className="footer__nav flex-column">
                    <Nav.Link disabled className="footer__nav-link">Solutions</Nav.Link>
                    <Nav.Link disabled>Harju maakond, <br/>Tallinn Kesklinna linnaosa, <br/>Tartu mnt 67/1-13b, 10115</Nav.Link>
                    <Nav.Link className="footer__nav-link" href="mailto:info@windingtree.com">info@windingtree.com</Nav.Link>
                  </Nav>
                </Col>
              </Row>
            </Container>
          </Col>

        </Row>
      </Container>
    </footer>
  )
}
