import React, {useState} from 'react'
import {config} from "../../config/default";
import style from './flights-search-results.module.scss'
import {Container, Row, Col, Image, Button} from 'react-bootstrap'
import {FastCheapFilter} from "../filters/filters";
import {SearchResultsWrapper} from "../../utils/flight-search-results-transformer"
import ResultsPaginator from "../common/pagination/results-paginator";
import {Offer} from "./flights-offer";

const ITEMS_PER_PAGE = config.FLIGHTS_PER_PAGE;


export default function FlightsSearchResults({searchResults, onOfferDisplay}) {
    const [currentPage, setCurrentPage] = useState(1);

    function handleOfferDisplay(offerId) {
        console.log("handleOfferDisplay", offerId);
        onOfferDisplay(offerId);
    }

    if (searchResults === undefined) {
        return (<>Nothing was found</>)
    }

    function cheapFastFilterTogggle() {

    }

    function onActivePageChange(page) {
        setCurrentPage(page);
    }

    function limitSearchResultsToCurrentPage(records) {
        let totalCount = records.length;
        if (totalCount == 0)
            return [];

        let startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
        let endIdx = currentPage * ITEMS_PER_PAGE - 1;
        if (endIdx >= totalCount)
            endIdx = totalCount - 1;
        return records.slice(startIdx, endIdx)
    }

    const searchResultsWrapper = new SearchResultsWrapper(searchResults);
    let offers = searchResults.offers;
    let offerIds = Object.keys(offers);
    let totalResultsCount = offerIds.length;
    offerIds = limitSearchResultsToCurrentPage(Object.keys(offers));

    return (
        <Container fluid={true} className={style.flightssearchresultscontainer}>
            <div className='pt-3'>
                <FastCheapFilter onToggle={cheapFastFilterTogggle}/>
                <ResultsPaginator activePage={currentPage} recordsPerPage={ITEMS_PER_PAGE}
                                  onActivePageChange={onActivePageChange} totalRecords={totalResultsCount}/>
                {/*    <FastCheapFilter/>*/}
                {
                    offerIds.map(offerId => {
                        // let cheapestOffer = OfferUtils.getCheapestOffer(offer);
                        let offer = searchResultsWrapper.getOffer(offerId)
                        let itineraries = searchResultsWrapper.getOfferItineraries(offerId)
                        let price = offer.price;
                        return (<Offer itineraries={itineraries}
                                       offerId={offerId}
                                       price={price}
                                       key={offerId}
                                       onOfferDisplay={handleOfferDisplay}/>)

                    })
                }
            </div>
        </Container>
    )

}
