import React from 'react';
import {RadiobuttonFilter, SelectionFilter} from "./radiobutton-filter";

export function MaxNumberOfStopsFilter({title = 'Stops',  onFilterSelectionChanged, searchResults}) {
    function onFilterStateChanged(filterState){
        onFilterSelectionChanged(filterState)
    }
    let initialFilterState=initializeMaxNumberOfStopsFilterState(searchResults);
    return (
        <RadiobuttonFilter title={title} filterItems={initialFilterState}  onFilterStateChanged={onFilterStateChanged} />
    )
}


 function initializeMaxNumberOfStopsFilterState(searchResults) {
    const filterState = [
        {key: "ALL", display: "ALL", selected: true},
        {key: "0", display: "Direct flights only", selected: false},
    ]
    let maxStops = 0;
    if (!searchResults || !searchResults.itineraries)
        return filterState;

    let combinations = searchResults.itineraries.combinations;
    Object.keys(combinations).map(combinationId => {
        let combination = combinations[combinationId];
        if (combination.length > maxStops)
            maxStops = combination.length;
    })
    for (let i = 1; i <= maxStops; i++) {
        let title = i + " Stops"
        if (i === 1)
            title = "1 Stop"
        filterState.push({key: i, display: title, selected: false});
    }
    return filterState;
}

