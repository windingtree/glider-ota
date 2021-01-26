import React from 'react';
import {RangeFilter} from "./range-filter";
import {differenceInMinutes, parseISO} from "date-fns";

export function ItineraryDurationFilter({title = 'Itinerary duration', onFilterSelectionChanged, searchResults, orig, dest}) {
    function onFilterStateChanged(filterState){
        onFilterSelectionChanged(onFilterSelectionChanged)
    }
    let initialFilterState=initializeItineraryDurationFilterState(searchResults,orig,dest);
    return (
        <RangeFilter title={title} unit={initialFilterState.unit} filterState={initialFilterState}  onFilterStateChanged={onFilterStateChanged}/>
    )
}


function initializeItineraryDurationFilterState(searchResults, orig, dest) {
    let minDuration = Number.MAX_SAFE_INTEGER;
    let maxDuration = 0;
    let filterState = {min: minInHrs, lowest: minInHrs, highest: maxInHrs, max: maxInHrs, unit: 'HR'};
    if (!searchResults || !searchResults.itineraries || !searchResults.itineraries.combinations || !searchResults.itineraries.segments)
        return filterState;


    let combinations = searchResults.itineraries.combinations;
    let segments = searchResults.itineraries.segments;

    //iterate over all itineraries (combinations)
    Object.keys(combinations).forEach(itinId => {
        let itinSegmentIds = combinations[itinId];
        let itinSegments = [];

        //for each itinerary, extract it's segments and add to itinSegments array
        itinSegmentIds.forEach(segmentId => {
            let segment = segments[segmentId];
            itinSegments.push(segment);
        })
        //get itinerary origin and destination
        let firstSegment = itinSegments[0];
        let lastSegment = itinSegments[itinSegments.length - 1];
        let itinOrigin = firstSegment.origin.iataCode;
        let itinDestination = lastSegment.destination.iataCode;

        //if it matches criteria, find min/max duration
        if (itinOrigin === orig && itinDestination === dest) {
            const startOfTrip = parseISO(firstSegment.departureTime);
            const endOfTrip = parseISO(lastSegment.arrivalTime);
            const durationInMins = differenceInMinutes(endOfTrip, startOfTrip);

            if (durationInMins < minDuration)
                minDuration = durationInMins;

            if (durationInMins > maxDuration)
                maxDuration = durationInMins;
        }

    })

    let minInHrs = Math.round(minDuration / 60);
    let maxInHrs = Math.round(maxDuration / 60);
    filterState.min = filterState.lowest = minInHrs;
    filterState.max = filterState.highest = maxInHrs;

    return filterState;
}

