import React from 'react';
import {SelectionFilter} from "./selection-filter";

export function AmenitiesFilter({title = 'Amenities', onFilterSelectionChanged, searchResults}) {
    function onFilterStateChanged(filterState){
        onFilterSelectionChanged(filterState)
    }
    let initialFilterState=initializeAmenitiesFilterState(searchResults);
    return (
        <SelectionFilter  title={title} filterItems={initialFilterState}  firstItemMutuallyExclusive={true} onFilterStateChanged={onFilterStateChanged}/>
    )
}

function initializeAmenitiesFilterState(searchResults) {
    const filterState = [
        {key: "ALL", display: "ALL", selected: true}
    ]
    if (!searchResults || !searchResults.accommodations) {
        return filterState;
    }
    let amenities={};
    //iterate over all hotels and extract all unique amenities
    Object.keys(searchResults.accommodations).forEach(hotelId => {
        let hotel = searchResults.accommodations[hotelId];
        let rooms = hotel.roomTypes;
        rooms && Object.keys(rooms).forEach(roomId => {
            let room = rooms[roomId];
            let roomAmenities = room.amenities;
            for(let i=0;i<roomAmenities.length;i++)
                amenities[roomAmenities[i]]=true;
        })
    })

    let uniqueAmenities = Object.keys(amenities);
    uniqueAmenities.sort();
    uniqueAmenities.forEach(amenity=>{
        filterState.push({key: amenity, display: amenity, selected: false});
    })
    return filterState;
}
