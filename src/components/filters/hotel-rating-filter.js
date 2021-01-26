import React from 'react';
import {SelectionFilter} from "./selection-filter";

export function HotelRatingFilter({title = 'Stars', onFilterSelectionChanged, searchResults}) {
    function onFilterStateChanged(filterState){
        onFilterSelectionChanged(filterState);
    }

    let initialFilterState = initializeRatingFilterState(searchResults);
    return (
        <SelectionFilter title={title} filterItems={initialFilterState} firstItemMutuallyExclusive={true} onFilterStateChanged={onFilterStateChanged}/>
    )
}



function initializeRatingFilterState(searchResults) {
    const filterState = [
        {key: "ALL", display: "ALL", selected: true}
    ]
    let ratings = {};
    if (!searchResults || !searchResults.accommodations) {
        return filterState;
    }

    Object.keys(searchResults.accommodations).forEach(hotelId => {
        let hotel = searchResults.accommodations[hotelId];
        if(!isNaN(parseInt(hotel.rating)))
            ratings[parseInt(hotel.rating)]=true;
    })
    let stars = Object.keys(ratings);
    stars.sort();
    stars.forEach(star=>{
        filterState.push({key: star, display: ratingToStars(star), selected: false});
    })
    return filterState;
}

function ratingToStars(rating){
    let stars="";
    for(let i=0;i<rating;i++)
        stars+="*";
    return stars;
}
