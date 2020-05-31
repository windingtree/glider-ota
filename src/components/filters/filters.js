import React, {useState} from 'react';
import style from "./filters.module.scss"
import "react-input-range/lib/css/index.css";

import {MaxNumberOfStopsFilter} from "./max-stops-filter";
import {PriceFilter} from "./price-filter";
import {ItineraryDurationFilter} from "./itinerary-duration-filter";
import {BaggageFilter} from "./baggage-filter";
import {AirlinesFilter} from "./airlines-filter";


export default function Filters({searchResults, onFilterApply, filtersStates}) {

    function filterStateChanged(id, filterState) {
        console.log("filterStateChanged, ID:",id," State:",filterState)
        let newfiltersState = Object.assign({}, filtersStates);
        newfiltersState[id] = filterState;
        onFilterApply(newfiltersState);

    }


    return (
        <>
            <div className="filters-container d-flex flex-column flex-fill">
                <MaxNumberOfStopsFilter searchResults={searchResults} onFilterStateChanged={filterStateChanged} title='Stops'/>
                <PriceFilter searchResults={searchResults} onFilterStateChanged={filterStateChanged} title='Price'/>
                {/*<ItineraryDurationFilter searchResults={searchResults} onFilterStateChanged={filterStateChanged} title='Flight duration' orig= dest=/>*/}
                <BaggageFilter searchResults={searchResults} onFilterStateChanged={filterStateChanged} title='Baggage'/>
                <AirlinesFilter searchResults={searchResults} onFilterStateChanged={filterStateChanged} title='Airlines'/>
            </div>
        </>
    )
}

