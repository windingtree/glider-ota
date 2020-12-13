import React from 'react'
import style from './hotel-search-results.module.scss'
import {Container, Row} from 'react-bootstrap'
import _ from 'lodash'
import SingleHotel from "./single-hotel";
import HotelDetails from "../hoteldetails/hotel-details"

import {HotelSearchResultsFilterHelper} from "../../../utils/hotel-search-results-filter-helper";
import {
    hotelErrorSelector,
    hotelsFiltersSelector, isHotelSearchFormValidSelector,
    isHotelSearchInProgressSelector,
    hotelSearchCriteriaSelector, searchForHotelsAction,
    hotelSearchResultsSelector
} from "../../../redux/sagas/hotels";
import {connect} from "react-redux";
import Spinner from "../../../components/common/spinner";
import SearchButton from "../search-form/search-button";

export function HotelsSearchResults({searchResults, onSearchClicked, isSearchFormValid, filters, searchInProgress, error}) {

    console.log('Hotel search results:',searchResults)
    const onHotelSelected = () =>{

    }
    if (searchResults === undefined) {
        return (<>No hotels found</>)
    }

    //SEARCH button was hit - search for hotels
    const onSearchButtonClicked = () => {
        if(onSearchClicked) {
            onSearchClicked();
        }else{
            console.warn('onSearchClicked is not defined!')
        }
    }

    let results=[];
    if(searchResults) {
        const helper = new HotelSearchResultsFilterHelper(searchResults);
        results = helper.generateSearchResults(filters);
    }
    return (
        <>
            <SearchButton disabled={!isSearchFormValid} onSearchButtonClicked={onSearchButtonClicked}/>
            <Spinner enabled={searchInProgress===true}/>
            {error && (<div>ERROR OCCURED</div>)}

            <div className='pt-3'/>
            {/*<Row className={style.hotelsSearchResultsWrapper}>*/}
                {
                    _.map(results, (result, id) => {
                        let hotel = result.hotel;
                        let bestoffer = result.bestoffer;
                        // return (<SingleHotel hotel={hotel} bestoffer={bestoffer} key={id} handleClick={onHotelSelected} searchResults={searchResults}/>)
                        return (<HotelDetails searchResults={searchResults} hotel={hotel}/>)
                    })
                }
            {/*</Row>*/}
        </>
    )

}



const mapStateToProps = state => ({
    filters: hotelsFiltersSelector(state),
    searchCriteria: hotelSearchCriteriaSelector(state),
    searchInProgress: isHotelSearchInProgressSelector(state),
    searchResults: hotelSearchResultsSelector(state),
    isSearchFormValid: isHotelSearchFormValidSelector(state),
    error:hotelErrorSelector(state)
});

const mapDispatchToProps = (dispatch) => {
    return {
        onSearchClicked: () => {
            dispatch(searchForHotelsAction())
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(HotelsSearchResults);
