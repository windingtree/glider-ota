import React from 'react'
import style from './results-paginator.module.scss'
import Pagination from "react-js-pagination";

export default function ResultsPaginator({activePage, recordsPerPage, totalRecords, onActivePageChange}) {
    function onPageChange(page){
        console.log("onPageChange")
        onActivePageChange(page)
    }
    return (
        // <Container fluid={true} >
        //     <Row>
            <div className={style.paginatorContainer}>
                <Pagination
                    activePage={activePage}
                    itemsCountPerPage={recordsPerPage}
                    totalItemsCount={totalRecords}
                    pageRangeDisplayed={5}
                    onChange={onPageChange} itemClass="page-item"
                    linkClass="page-link"/>
            </div>
            // </Row>
        // </Container>
    )
}


