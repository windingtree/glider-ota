import React from 'react'
import {Row,Col, Image,Container} from 'react-bootstrap/'
import logo from "../../../assets/glider-logo.png";

import './header.scss'

export default function Header (props) {
  return (
    <header className="header">
      <Container fluid={true}>
         <img alt="logo" src={logo} className="logo-small"/>
      </Container>
    </header>
  )
}
