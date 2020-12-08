import React, {useState} from 'react';
import Header  from '../../components/common/header/header';
import Footer from '../../components/common/footer/footer';
import {Container, Row, Col, Button} from 'react-bootstrap';
import style from './landing-page.module.scss'

import SearchModeSelector from "../components/search-form/search-mode-selector";
import FlightsSearchResults from "../components/flightresults/flights-search-results";
import FlightsSearchForm from "../components/search-form/flight-search-form";


export default function DCLandingPage() {

    return (
        <>
            <div>
                <SearchModeSelector/>
                <FlightsSearchForm/>
                <FlightsSearchResults/>
                <div className='root-container-searchpage'>
                    <Row>
                        <Col xs={0} md={3} xl={2} className='d-none d-md-block'>
                        </Col>
                        <Col xs={12} md={9} xl={10}>

                        </Col>
                    </Row>
                </div>
                {/*<Footer/>*/}

            </div>
        </>)
}
