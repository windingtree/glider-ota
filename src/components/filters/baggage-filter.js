import React from 'react';
import {SelectionFilter} from "./selection-filter";

export function BaggageFilter({title = 'Baggage', onFilterSelectionChanged, searchResults}) {
    function onFilterStateChanged(filterState){
        onFilterSelectionChanged(filterState)
    }
    let initialFilterState=initializeBagsFilterState(searchResults);
    return (
        <SelectionFilter  title={title} filterItems={initialFilterState}  firstItemMutuallyExclusive={true} onFilterStateChanged={onFilterStateChanged}/>
    )
}

function initializeBagsFilterState(searchResults) {
    const filterState = [
        {key: "ALL", display: "ALL", selected: true},
        {key: "0", display: "Carry on bag", selected: false},
        {key: "1", display: "Checked baggage", selected: false},
    ]
    return filterState;
}
