import React from 'react';
import {SelectionFilter} from "./selection-filter";

export function AirlinesFilter({title = 'Airlines', onFilterStateChanged, searchResults}) {
    function initializeFilterItems(){
        const items=[
            {key: "ALL", display: "ALL", selected: true}
        ]
        let airlines={};
        let segments = searchResults.itineraries.segments;
        Object.keys(segments).map(segmentId=>{
            let segment=segments[segmentId];
            airlines[segment.operator.iataCode]=segment.operator.airline_name;
        })
        Object.keys(airlines).map(iata=>{
            items.push({key: iata, display: airlines[iata], selected: true});
        })
        return items;
    }
    let init=initializeFilterItems();

    return (
        <SelectionFilter title={title} filterItems={init} id={'airlinesFilter'} firstItemMutuallyExclusive={true} onFilterStateChanged={onFilterStateChanged}/>
    )
}

