import React, {useEffect, useState} from 'react'
import {config} from "../../../config/default";
import style from './flights-search-results.module.scss'
import {
    FlightSearchResultsFilterHelper
} from '../../../utils/flight-search-results-filter-helper'
import ResultsPaginator, {
    limitSearchResultsToCurrentPage,
    ITEMS_PER_PAGE
} from '../../components/common/pagination/results-paginator';
import Offer from './flights-offer';
import SearchButton from '../search-form/search-button';

import {connect} from 'react-redux';
import {
    searchForFlightsAction,
    flightSearchCriteriaSelector,
    flightFiltersSelector,
    isFlightSearchInProgressSelector,
    isFlightSearchFormValidSelector,
    flightSearchResultsSelector,
    flightsErrorSelector,
    requestSearchResultsRestoreFromCache, isShoppingFlowStoreInitialized
} from '../../../redux/sagas/shopping-flow-store';
import Spinner from '../../components/common/spinner';
import Alert from 'react-bootstrap/Alert';


//Component to display flight search results
export function FlightsSearchResults(props) {
    const {
        searchResults,
        filters,
        isSearchFormValid,
        onOfferDisplay,
        onSearchClicked,
        searchInProgress,
        error,
        onRestoreFromCache,
        isStoreInitialized,
        onRestoreResultsFromCache,
        initSearch
    } = props;
    const [currentPage, setCurrentPage] = useState(1);
    const [sortType, setSortType] = useState('PRICE');

    const onSearchButtonClicked = useCallback(() => {
        if (onSearchClicked) {
            onSearchClicked();
        }else{
            console.warn('onSearchClicked is not defined!')
        }
    }, [onSearchClicked]);

    useEffect(() => {
        if (initSearch) {
            setTimeout(() => onSearchButtonClicked(), 1000);
        }
    }, [initSearch, onSearchButtonClicked]);

    //called when user clicked on a specific offer
    function handleOfferDisplay(offerId) {
        if (onOfferDisplay) {
            onOfferDisplay(offerId);
        } else {
            console.warn('onOfferDisplay handler is not defined')
        }
    }

    //SEARCH button was hit - search for flights
    const onSearchButtonClicked = () => {
        if(onSearchClicked)
            onSearchClicked();
    }


    let trips = [];
    let totalResultsCount = 0;
    //only use helpers when there are search results present (initially it may be null/empty)
    let nothingFound = false;

    if (searchResults) {
        const filterHelper = new FlightSearchResultsFilterHelper(searchResults);
        trips = filterHelper.generateSearchResults(sortType, filters)
        totalResultsCount = trips.length;
        trips = limitSearchResultsToCurrentPage(trips, currentPage, ITEMS_PER_PAGE);
        nothingFound = (totalResultsCount === 0)
    }


    //display search results paginator only if there are more than ITEMS_PER_PAGE results
    const displayResultsPaginator = () => {
        if (totalResultsCount < ITEMS_PER_PAGE)
            return (<></>)

        return (
            <ResultsPaginator activePage={currentPage} recordsPerPage={ITEMS_PER_PAGE}
                              onActivePageChange={setCurrentPage} totalRecords={totalResultsCount}/>
        )
    }


    return (<>
            <SearchButton disabled={!isSearchFormValid || searchInProgress}
                          onSearchButtonClicked={onSearchButtonClicked}/>
            <Spinner enabled={searchInProgress}/>
            {error && (<div>ERRRORS OCCURED</div>)}
            {nothingFound && <WarningNoResults/>}
            <div className='pt-5'/>
            {/*<FastCheapFilter defaultValue={sortType} onToggle={setSortType}/>*/}
            {
                trips.map(tripInfo => {
                    let offer = tripInfo.bestoffer;
                    let itineraries = tripInfo.itineraries;
                    let offerId = offer.offerId;
                    let price = offer.price;
                    return (<Offer offer={offer} itineraries={itineraries}
                                   offerId={offerId}
                                   price={price}
                                   key={offerId}
                                   onOfferDisplay={handleOfferDisplay}/>)

                })
            }
            {displayResultsPaginator()}
        </>
    )

}

const WarningNoResults = () => {
    return (<>
        <div className={style.sorryNoResults}>Sorry, we could not find any flights</div>
        There may be no flights available for the requested origin, destination, travel dates and filters<br/>
        </>
    );
};

const mapStateToProps = state => ({
    filters: flightFiltersSelector(state),
    searchCriteria: flightSearchCriteriaSelector(state),
    searchInProgress: isFlightSearchInProgressSelector(state),
    searchResults: flightSearchResultsSelector(state),
    isSearchFormValid: isFlightSearchFormValidSelector(state),
    isStoreInitialized: isShoppingFlowStoreInitialized(state),
    error: flightsErrorSelector(state)
});

const mapDispatchToProps = (dispatch) => {
    return {
        onSearchClicked: () => {
            dispatch(searchForFlightsAction())
        },
        onOfferDisplay: () => {
            dispatch(searchForFlightsAction())
        },
        onRestoreResultsFromCache: () => {
            dispatch(requestSearchResultsRestoreFromCache())
        },
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(FlightsSearchResults);
