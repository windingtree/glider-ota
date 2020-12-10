import React from 'react';
import style from './journey-summary.module.scss'
import {ItinerarySummary} from "./itinerary-summary"
import OfferUtils from '../../../utils/offer-utils'


const NightsAtDestination = ({nights, cityName}) => {
    return (<div className={style.separator}><span className={style.stayDurationText}> {nights} nights in {cityName}</span></div>);
}


export const JourneySummary = ({itineraries}) => {
    const isOneWay = (itineraries.length == 1);
    if(isOneWay)
        return (<ItinerarySummary itinerary={itineraries[0]}/>)

    let outboundItinerary = itineraries[0];
    let returnItinerary = itineraries[1];

    //determine length of stay
    let cityName = undefined;
    let lengthOfStay = 0;
    try {
        lengthOfStay = OfferUtils.calculateStayBetweenTripsInBusinessDays(outboundItinerary,returnItinerary)
        cityName = OfferUtils.getItineraryDepartureCityName(returnItinerary);
        console.log('lengthOfStay=',lengthOfStay,', city=',cityName)
    }catch(err){
        console.log(`Failed to calculate length of stay, err:${err}`);
    }

    return (
        <>
            <ItinerarySummary itinerary={outboundItinerary}/>
            {(cityName && lengthOfStay>0) && (<NightsAtDestination cityName={cityName} nights={lengthOfStay}/>)}
            <ItinerarySummary itinerary={returnItinerary}/>
        </>
    )
}


