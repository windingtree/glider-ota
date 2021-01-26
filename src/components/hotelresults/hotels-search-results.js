import React, {useEffect, useState, useCallback} from 'react'
import style from './hotel-search-results.module.scss'
import _ from 'lodash'
import HotelDetails from '../hoteldetails/hotel-details'
import {connect} from 'react-redux'
import {HotelSearchResultsFilterHelper} from '../../utils/hotel-search-results-filter-helper';
import {
    hotelErrorSelector,
    hotelsFiltersSelector, isHotelSearchFormValidSelector,
    isHotelSearchInProgressSelector,
    hotelSearchCriteriaSelector, searchForHotelsAction,
    hotelSearchResultsSelector, requestSearchResultsRestoreFromCache, isShoppingFlowStoreInitialized
} from '../../redux/sagas/shopping-flow-store';
import Spinner from '../common/spinner';
import SearchButton from '../search-form/search-button';
import ResultsPaginator, {
    limitSearchResultsToCurrentPage,
    ITEMS_PER_PAGE
} from '../common/pagination/results-paginator';

export function HotelsSearchResults(props) {
    const {
        searchResults,
        onSearchClicked,
        isSearchFormValid,
        filters,
        searchInProgress,
        error,
        initSearch
    } = props;
    const [currentPage, setCurrentPage] = useState(1);

    const onSearchButtonClicked = useCallback(() => {
        if (onSearchClicked) {
            onSearchClicked();
        } else {
            console.warn('onSearchClicked is not defined!')
        }
    }, [onSearchClicked]);

    useEffect(() => {
        if (initSearch) {
            setTimeout(() => onSearchButtonClicked(), 1000);
        }
    }, [initSearch, onSearchButtonClicked]);

    let results = [];
    let totalResultsCount = 0;
    let nothingFound = false;
    if (searchResults) {
        const helper = new HotelSearchResultsFilterHelper(searchResults);
        results = helper.generateSearchResults(filters);
        totalResultsCount = results.length;
        results = limitSearchResultsToCurrentPage(results, currentPage, ITEMS_PER_PAGE);
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


    return (
        <>
            <SearchButton disabled={!isSearchFormValid} onSearchButtonClicked={onSearchButtonClicked}/>
            <Spinner enabled={searchInProgress === true}/>
            {searchInProgress &&
                <div className={style.progressNote}>
                    <p>
                    Looking for hotels in all the hotels at the same time. Kinda awesome right?
                    </p>
                    <p>
                    However this might take a while. Waiting for the messenger on a rainbow-colored unicorn to bring us the results
                    </p>
                    <p>
                    Might take about 59 seconds
                    </p>
                </div>
            }
            {error && (<div>ERROR OCCURED</div>)}
            {nothingFound && <WarningNoResults/>}
            <div className='pt-3'/>
            {
                _.map(results, (result, id) => {
                    let hotel = result.hotel;
                    return (<HotelDetails key={id} searchResults={searchResults} hotel={hotel}/>)
                })
            }
            {displayResultsPaginator()}
        </>
    )

}

const WarningNoResults = () => {
    return (<>
            <div className={style.sorryNoResults}>Sorry, we couldn't find any hotels</div>
            There may be no hotels available for the requested travel dates and filters<br/>
        </>
    );
};


const mapStateToProps = state => ({
    filters: hotelsFiltersSelector(state),
    searchCriteria: hotelSearchCriteriaSelector(state),
    searchInProgress: isHotelSearchInProgressSelector(state),
    searchResults: hotelSearchResultsSelector(state),
    isSearchFormValid: isHotelSearchFormValidSelector(state),
    isStoreInitialized: isShoppingFlowStoreInitialized(state),
    error: hotelErrorSelector(state)
});

const mapDispatchToProps = (dispatch) => {
    return {
        onSearchClicked: () => {
            dispatch(searchForHotelsAction())
        },
        onRestoreResultsFromCache: () => {
            dispatch(requestSearchResultsRestoreFromCache())
        },
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(HotelsSearchResults);
