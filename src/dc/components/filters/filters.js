import React, {useState} from 'react';
import "react-input-range/lib/css/index.css";

import {MaxNumberOfStopsFilter} from "./max-stops-filter";
import {PriceFilter} from "./price-filter";
import {BaggageFilter} from "./baggage-filter";
import {AirlinesFilter} from "./airlines-filter";
import {FILTERS} from "./filters-utils";
import {
    flightFiltersSelector, applyFlightFilterAction, flightSearchResultsSelector
} from "../../../redux/sagas/shopping-flow-store";
import {connect} from "react-redux";

export function Filters({searchResults, onFiltersChanged}) {
    const [filterStates, setFilterStates] = useState({})

    function filterChanged(filterId, filterState) {
        let newFilterStates = Object.assign({}, filterStates);
        newFilterStates[filterId] = filterState;
        setFilterStates(newFilterStates)
        console.log(`Filters - filter ${filterId} was changed, list of filters:${JSON.stringify(newFilterStates)}`);
        if (onFiltersChanged) {
            onFiltersChanged(newFilterStates);
        } else {
            console.warn("onFiltersChanged is not defined!")
        }
    }

    //don't show filters if there are no results
    if(!searchResults){
        return (<></>)
    }

    return (
        <>
            <div className="filters-container d-flex flex-column flex-fill" >
                <MaxNumberOfStopsFilter searchResults={searchResults} onFilterSelectionChanged={(filterState)=>filterChanged(FILTERS.MAXSTOPS,filterState)}  title='Stops'/>
                <PriceFilter searchResults={searchResults} onFilterSelectionChanged={(filterState)=>filterChanged(FILTERS.PRICE,filterState)}   title='Price'/>
                {/*<ItineraryDurationFilter searchResults={searchResults} onFilterSelectionChanged={(filterState)=>filterChanged(FILTERS.,filterState)}  title='Flight duration' orig= dest=/>*/}
                <AirlinesFilter searchResults={searchResults} onFilterSelectionChanged={(filterState)=>filterChanged(FILTERS.AIRLINES,filterState)}   title='Airlines'/>
                <BaggageFilter searchResults={searchResults} onFilterSelectionChanged={(filterState)=>filterChanged(FILTERS.BAGGAGE,filterState)} title='Baggage'/>
            </div>
        </>
    )
}

const mapStateToProps = state => ({
    filters: flightFiltersSelector(state),
    searchResults:flightSearchResultsSelector(state)
});

const mapDispatchToProps = (dispatch) => {
    return {
        onFiltersChanged: (filters) => {
            dispatch(applyFlightFilterAction(filters))
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Filters);
