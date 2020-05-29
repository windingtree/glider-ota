import React, {useState} from 'react'
import {config} from "../../config/default";
import style from './flights-search-results.module.scss'
import {Container} from 'react-bootstrap'
import {FastCheapFilter} from "../filters/filters";
import {
    createAirlinePredicate, createLayoverDurationPredicate,
    createMaxStopsPredicate,
    createPricePredicate,
    FlightSearchResultsFilterHelper
} from "../../utils/flight-search-results-filter-helper"
import ResultsPaginator from "../common/pagination/results-paginator";
import {Offer} from "./flights-offer";

const ITEMS_PER_PAGE = config.FLIGHTS_PER_PAGE;


export default function FlightsSearchResults({searchResults, onOfferDisplay, filtersStates}) {
    const [currentPage, setCurrentPage] = useState(1);
    const [sortType, setSortType] = useState('PRICE');
    function handleOfferDisplay(offerId) {
        console.log("handleOfferDisplay", offerId);
        onOfferDisplay(offerId);
    }

    if (searchResults === undefined) {
        return (<>Nothing was found</>)
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
        console.debug(`Paging, total:${totalCount}, active page:${currentPage}, items per page:${ITEMS_PER_PAGE}, startIdx:${startIdx}, endIdx:${endIdx}`);
        return records.slice(startIdx, endIdx)
    }

    const filterHelper = new FlightSearchResultsFilterHelper(searchResults);
    let predicates = createFilterPredicates(filtersStates);

    let trips=filterHelper.generateSearchResults(sortType, predicates)
    let totalResultsCount = trips.length;
    trips = limitSearchResultsToCurrentPage(trips);

    return (
        <Container fluid={true} className={style.flightssearchresultscontainer}>
            <div className='pt-3'>
                <FastCheapFilter defaultValue={sortType} onToggle={setSortType}/>
                <ResultsPaginator activePage={currentPage} recordsPerPage={ITEMS_PER_PAGE}
                                  onActivePageChange={onActivePageChange} totalRecords={totalResultsCount}/>
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
            </div>
        </Container>
    )

}



function createFilterPredicates(filterStates){
    if(!filterStates) {
        return [];
    }
    let predicates=[];

    //create predicate to filter offers by price range
    let priceRangeFilter = filterStates.priceRange;
    console.debug("Price range criteria:", priceRangeFilter)
    predicates.push({
        predicate: createPricePredicate(priceRangeFilter),
        type: 'offer'
    });

    //create predicate to filter offers by layover duration
    let layoverDurationFilter = filterStates.layoverDuration;
    console.debug("Layover duration criteria:", layoverDurationFilter)
    predicates.push({
        predicate: createLayoverDurationPredicate(layoverDurationFilter),
        type: 'trip'
    });


    //create predicate to filter trips by number of stops
    let maxStopsFilter = filterStates.maxStops;
    console.debug("stops criteria:", maxStopsFilter);
    let maxStopsCriteria={};
    maxStopsFilter.map(rec=>{
        if(rec.key === 'all'){
            maxStopsCriteria['ALL'] = rec.selected;
        }else{
            maxStopsCriteria[rec.key] = rec.selected;
        }
    })
    predicates.push({
        predicate: createMaxStopsPredicate(maxStopsCriteria),
        type: 'trip'
    });


    //create predicate to filter trips by operating carriers
    let carriersFilter=filterStates.airlines;
    console.debug("carriers criteria:", carriersFilter);
    let carriersCriteria={};
    carriersFilter.map(rec=>{
        if(rec.key === 'all'){
            carriersCriteria['ALL'] = rec.selected;
        }else{
            carriersCriteria[rec.key] = rec.selected;
        }
    })

    predicates.push({
        predicate: createAirlinePredicate(carriersCriteria),
        type: 'trip'
    });
    return predicates;
}
