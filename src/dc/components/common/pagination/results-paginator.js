import React from 'react'
import style from './results-paginator.module.scss'
import Pagination from "react-js-pagination";
import {config} from "../../../../config/default";

export const ITEMS_PER_PAGE = config.FLIGHTS_PER_PAGE;

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


export function limitSearchResultsToCurrentPage(records, currentPage, itemsPerPage = ITEMS_PER_PAGE) {
    let totalCount = records.length;
    if (totalCount === 0)
        return [];

    let startIdx = (currentPage - 1) * itemsPerPage;
    let endIdx = currentPage * itemsPerPage;
    if (endIdx >= totalCount)
        endIdx = totalCount;
    return records.slice(startIdx, endIdx)
}
