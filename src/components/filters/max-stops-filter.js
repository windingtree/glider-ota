import React from 'react';
import {SelectionFilter} from "./selection-filter";

export function MaxNumberOfStopsFilter({title = 'Stops', onFilterStateChanged, searchResults}) {
    function initializeFilterItems(){
        const items=[
            {key: "ALL", display: "ALL", selected: true},
            {key: "0", display: "Direct flights only", selected: false},
        ]
        let maxStops=0;
        let combinations = searchResults.itineraries.combinations;
        Object.keys(combinations).map(combinationId=>{
            let combination=combinations[combinationId];
            if(combination.length>maxStops)
                maxStops=combination.length;
        })
        for(let i=1;i<=maxStops;i++) {
            let title = i+ " Stops"
            if(i === 1)
                title = "1 Stop"
            items.push({key: i, display: title, selected: false});
        }
        return items;
    }
    let init=initializeFilterItems();

    return (
        <SelectionFilter title={title} filterItems={init} id={'maxStopsFilter'} firstItemMutuallyExclusive={true} onFilterStateChanged={onFilterStateChanged}/>
    )
}

