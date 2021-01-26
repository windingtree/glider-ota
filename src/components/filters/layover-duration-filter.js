import React  from 'react';
import {RangeFilter} from "./range-filter";

export function LayoverDurationFilter({title = 'Layover duration', onFilterSelectionChanged, searchResults, orig, dest}) {
    function onFilterStateChanged(filterState){
        onFilterSelectionChanged(filterState)
    }
    let initialFilterState=initializeLayoverDurationFilterState(searchResults,orig,dest);
    return (
        <RangeFilter title={title} unit={initialFilterState.unit} filterState={initialFilterState} onFilterStateChanged={onFilterStateChanged}/>
    )
}


function initializeLayoverDurationFilterState(searchResults, orig, dest) {
    let filterState = {min: 0, lowest: 0, highest: 24, max: 24, unit: 'hr'};
    return filterState;
}
