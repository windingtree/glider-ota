import React, {useState} from 'react';
import Header  from '../../components/common/header/header';
import Footer from '../../components/common/footer/footer';
import {Container, Row, Col, Button} from 'react-bootstrap';
import {FlightsSearchForm,HotelsSearchForm} from '../../components/search-form/search-form';
import style from './landing-page.module.scss'
import Filters from "../../components/filters/filters";
import Spinner from "../../components/common/spinner";
import FlightsSearchResults from "../../components/flightresults/flights-search-results";
import SearchModeSelector from "../components/search-form/search-mode-selector";




export default function DCLandingPage() {
    return (
        <>
            <div>
                <SearchModeSelector/>
                <div className='root-container-searchpage'>
                    <Row>
                        <Col xs={0} md={3} xl={2} className='d-none d-md-block'>
                        </Col>
                        <Col xs={12} md={9} xl={10}>

                        </Col>
                    </Row>
                </div>
                <Footer/>

            </div>
        </>)
}
