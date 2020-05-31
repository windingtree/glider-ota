import React from 'react';
import {SelectionFilter} from "./selection-filter";

export function BaggageFilter({title = 'Baggage', onFilterStateChanged, searchResults}) {

    function initializeFilterItems(){
        const items=[
            {key: "ALL", display: "ALL", selected: true},
            {key: "0", display: "Carry on bag", selected: false},
            {key: "1", display: "Checked baggage", selected: false},
        ]
        return items;
    }
    let init=initializeFilterItems();

    return (
        <SelectionFilter title={title} filterItems={init} id={'baggageFilter'} firstItemMutuallyExclusive={true} onFilterStateChanged={onFilterStateChanged}/>
    )
}

