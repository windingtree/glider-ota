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

    let stops=[];
    let combinations = searchResults.itineraries.combinations;
    //iterate over all itineraries and check how many stops each of them has
    Object.keys(combinations).map(combinationId => {
        let combination = combinations[combinationId];
        let stopsCount = combination.length-1;
        //store number of stops
        if(stopsCount>0 && !stops.includes(stopsCount)) {
            stops.push(stopsCount);
        }
    })
     //sort number of stops
    stops.sort();
    for (let i = 0; i < stops.length; i++) {
        let idx = stops[i];
        let title = "Max "+idx + " stops";
        if (idx === 1)
            title = "Max 1 Stop";
        filterState.push({key: idx, display: title, selected: false});
    }
    return filterState;
}

