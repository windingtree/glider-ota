import React, {useState} from 'react';
import {Container, Row, Col, Button} from 'react-bootstrap';
import style from './landing-page.module.scss'

import SearchModeSelector from "../components/search-form/search-mode-selector";
import  FlightsShoppingComponent from "./flights-shopping-component"
import HotelsShoppingComponent from "./hotels-shopping-component"
import {SEARCH_TYPE} from "../components/search-form/search-mode-selector"


export default function DCLandingPage() {
    const [searchType,setSearchType] = useState(SEARCH_TYPE.FLIGHTS);




    return (
        <>
            <div>
                <SearchModeSelector selectedMode={searchType} onToggle={setSearchType}/>
                {searchType === SEARCH_TYPE.FLIGHTS && (<FlightsShoppingComponent/>)}
                {searchType === SEARCH_TYPE.HOTELS && (<HotelsShoppingComponent/>)}
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
