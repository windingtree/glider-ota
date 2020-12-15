import React, {useState} from 'react'
import {config} from "../../config/default";
import style from './flights-search-results.module.scss'
import {Container} from 'react-bootstrap'
// import {FastCheapFilter} from "../filters/filters";
import {FastCheapFilter} from "../filters/fast-cheap-filter";
import {
    FlightSearchResultsFilterHelper
} from "../../utils/flight-search-results-filter-helper"
import ResultsPaginator from "../common/pagination/results-paginator";
import {Offer} from "./flights-offer";

const ITEMS_PER_PAGE = config.FLIGHTS_PER_PAGE;


export default function FlightsSearchResults({searchResults, onOfferDisplay, filters}) {
    const [currentPage, setCurrentPage] = useState(1);
    const [sortType, setSortType] = useState('PRICE');

    function handleOfferDisplay(offerId) {
        onOfferDisplay(offerId);
    }

    if (searchResults === undefined) {
        return (<></>)
    }

    function onActivePageChange(page) {
        setCurrentPage(page);
    }

    function limitSearchResultsToCurrentPage(records) {
        let totalCount = records.length;
        if (totalCount === 0)
            return [];



        let startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
        let endIdx = currentPage * ITEMS_PER_PAGE;
        if (endIdx >= totalCount)
            endIdx = totalCount;
        return records.slice(startIdx, endIdx)
    }

    const filterHelper = new FlightSearchResultsFilterHelper(searchResults);

    let trips = filterHelper.generateSearchResults(sortType, filters)
    let totalResultsCount = trips.length;
    trips = limitSearchResultsToCurrentPage(trips);

    return (<>
        <FastCheapFilter defaultValue={sortType} onToggle={setSortType}/>
        <Container fluid={true} className={style.flightssearchresultscontainer}>
            <div className='pt-3'>

                <div className='pt-5'/>
                {
                    trips.map(tripInfo => {
                        let offer = tripInfo.bestoffer;
                        let offerId = offer.offerId;
                        let itineraries = tripInfo.itineraries;
                        let price = offer.price;
                        return (<Offer itineraries={itineraries}
                                       offerId={offerId}
                                       price={price}
                                       key={offerId}
                                       onOfferDisplay={handleOfferDisplay}/>)

                    })
                }
                <ResultsPaginator activePage={currentPage} recordsPerPage={ITEMS_PER_PAGE}
                                  onActivePageChange={onActivePageChange} totalRecords={totalResultsCount}/>
            </div>
        </Container></>
    )

}

