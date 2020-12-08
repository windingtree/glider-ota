import React, {useState} from 'react';
import "react-input-range/lib/css/index.css";

import {FILTERS} from "./filters-utils";
import {HotelRatingFilter} from "./hotel-rating-filter";
import {NightPriceFilter} from "./night-price-filter";
import {AmenitiesFilter} from "./amenities-filter";
import {applyFilterAction, hotelsFiltersSelector, searchResultsSelector} from "../../../redux/sagas/hotels";
import {connect} from "react-redux";

export function HotelFilters({searchResults, onFiltersChanged}) {
    const [filterStates, setFilterStates] = useState({})

    function filterChanged(filterId, filterState) {
        let newFilterStates = Object.assign({}, filterStates);
        newFilterStates[filterId] = filterState;
        setFilterStates(newFilterStates)
        console.log(`Filters - filter ${filterId} was changed, list of filters:${JSON.stringify(newFilterStates)}`);
        onFiltersChanged(newFilterStates);
    }

    return (
        <>
            <div className="filters-container d-flex flex-column flex-fill" >
                <HotelRatingFilter searchResults={searchResults} onFilterSelectionChanged={(filterState)=>filterChanged(FILTERS.RATING,filterState)} title='Stars'/>
                <NightPriceFilter searchResults={searchResults} onFilterSelectionChanged={(filterState)=>filterChanged(FILTERS.HOTELPRICE,filterState)} title='Price' numberOfNights={1}/>
                <AmenitiesFilter searchResults={searchResults} onFilterSelectionChanged={(filterState)=>filterChanged(FILTERS.AMENITIES,filterState)} title='Amenities'/>
            </div>
        </>
    )
}

const mapStateToProps = state => ({
    filters: hotelsFiltersSelector(state),
    searchResults:searchResultsSelector(state)
});

const mapDispatchToProps = (dispatch) => {
    return {
        onFiltersChanged: (filters) => {
            dispatch(applyFilterAction(filters))
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(HotelFilters);
