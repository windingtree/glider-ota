import React from 'react'
import style from './results-pager.module.scss'
import {Container, Row, Col, Image, Button} from 'react-bootstrap'
import Pagination from "react-js-pagination";
const DEFAULT_PAGE_SIZE=10;

export default function ResultsPaginator({activePage, recordsPerPage, totalRecords, onActivePageChange}) {
    function onPageChange(page){
        console.log("onPageChange")
        onActivePageChange(page)
    }
    return (
        <Container fluid={true} >
            <Row>
            <Col className={style.paginatorContainer}>
                <Pagination
                    activePage={activePage}
                    itemsCountPerPage={recordsPerPage}
                    totalItemsCount={totalRecords}
                    pageRangeDisplayed={5}
                    onChange={onPageChange} itemClass="page-item"
                    linkClass="page-link"/>
            </Col>
            </Row>
        </Container>
    )
}


