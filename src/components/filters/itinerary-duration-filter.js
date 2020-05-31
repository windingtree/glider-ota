import React  from 'react';
import {RangeFilter} from "./range-filter";
import OfferUtils from "../../utils/offer-utils";
import {differenceInMinutes, parseISO} from "date-fns";

export function ItineraryDurationFilter({title = 'Layover duration', onFilterStateChanged, searchResults, orig, dest}) {

    function initializeFilter() {
        let minDuration = Number.MAX_SAFE_INTEGER;
        let maxDuration = 0;
        let combinations=searchResults.itineraries.combinations;
        let segments=searchResults.itineraries.segments;

        //iterate over all itineraries (combinations)
        Object.keys(combinations).map(itinId => {
            let itinSegmentIds = combinations[itinId];
            let itinSegments = [];

            //for each itinerary, extract it's segments and add to itinSegments array
            itinSegmentIds.map(segmentId=>{
                let segment=segments[segmentId];
                itinSegments.push(segment);
            })
            //get itinerary origin and destination
            let firstSegment = itinSegments[0];
            let lastSegment = itinSegments[itinSegments.length-1];
            let itinOrigin = firstSegment.origin.iataCode;
            let itinDestination = lastSegment.destination.iataCode;

            //if it matches criteria, find min/max duration
            if(itinOrigin === orig && itinDestination === dest){
                const startOfTrip = parseISO(firstSegment.departureTime);
                const endOfTrip = parseISO(lastSegment.arrivalTime);
                const durationInMins = differenceInMinutes(endOfTrip, startOfTrip);

                if(durationInMins<minDuration)
                    minDuration=durationInMins;

                if(durationInMins>maxDuration)
                    maxDuration=durationInMins;
            }

        })

        let minInHrs = Math.round(minDuration/60);
        let maxInHrs = Math.round(maxDuration/60);

        return {min: minInHrs, lowest: minInHrs, highest: maxInHrs, max: maxInHrs, unit:'HR'};
    }

    let init=initializeFilter();
    return (
        <RangeFilter title={title} unit={init.unit} filterState={init} id={'priceFilter'} onFilterStateChanged={onFilterStateChanged}/>
    )
}

