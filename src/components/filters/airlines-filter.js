import React,{useState} from 'react';
import {SelectionFilter} from "./selection-filter";

export function AirlinesFilter({title = 'Airlines', onFilterSelectionChanged, searchResults}) {
    function onFilterStateChanged(filterState){
        onFilterSelectionChanged(filterState);
    }

    let initialFilterState = initializeAirlinesFilterState(searchResults);
    return (
        <SelectionFilter title={title} filterItems={initialFilterState}  firstItemMutuallyExclusive={true} onFilterStateChanged={onFilterStateChanged}/>
    )
}



function initializeAirlinesFilterState(searchResults) {
    const filterState = [
        {key: "ALL", display: "ALL", selected: true}
    ]
    let airlines = {};
    if (!searchResults || !searchResults.itineraries || !searchResults.itineraries.segments) {
        return filterState;
    }
    let segments = searchResults.itineraries.segments;
    Object.keys(segments).map(segmentId => {
        let segment = segments[segmentId];
        airlines[segment.operator.iataCode] = segment.operator.airline_name;
    })
    Object.keys(airlines).map(iata => {
        filterState.push({key: iata, display: airlines[iata], selected: false});
    })
    return filterState;
}
