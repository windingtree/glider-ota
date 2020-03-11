import React from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'

import './header.scss'

export default function Header (props) {
  return (
    <header className="header">
      <Container fluid={false}>
        <Row noGutters>
          <Col>
            <img alt="logo" src="https://windingtree.com/assets/img/logo/sm-color.svg" />
          </Col>
          <Col />
          <Col sm={4} md={3} lg={2}>
            <Button className="header__button" variant="outline-dark">Sign up</Button>
            <Button className="header__button" variant="dark">Sign in</Button>
          </Col>
        </Row>
      </Container>
    </header>
  )
}
