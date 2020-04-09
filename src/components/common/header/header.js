import React from 'react'
import {Row,Col, Image,Container} from 'react-bootstrap/'

import './header.scss'

export default function Header (props) {
  return (
    <header className="header">
      <Container fluid={true}>
         <img alt="logo" src="/images/logo.png" className="logo-small"/>
      </Container>
    </header>
  )
}
