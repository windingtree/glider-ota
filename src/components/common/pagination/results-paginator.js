import React from 'react'
import style from './results-paginator.module.scss'
import Pagination from "react-js-pagination";

export default function ResultsPaginator({activePage, recordsPerPage, totalRecords, onActivePageChange}) {
    function onPageChange(page){
        onActivePageChange(page)
    }
    return (
            <div className={style.paginatorContainer}>
                <Pagination
                    activePage={activePage}
                    itemsCountPerPage={recordsPerPage}
                    totalItemsCount={totalRecords}
                    pageRangeDisplayed={5}
                    onChange={onPageChange} itemClass="page-item"
                    linkClass="page-link"/>
            </div>
    )
}


