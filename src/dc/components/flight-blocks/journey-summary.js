import React from 'react';
import {ItinerarySummary} from "./itinerary-summary"
import OfferUtils from '../../../utils/offer-utils'
import {HorizontalDottedLine} from "../common-blocks/horizontal-line"
import style from './journey-summary.module.scss'

const NightsAtDestination = ({nights, cityName}) => {
    let text = `${nights} nights in ${cityName}`;
    return (<HorizontalDottedLine text={text}/>);
}



export const JourneySummary = ({itineraries}) => {
    const isOneWay = (itineraries.length == 1);
    if(isOneWay)
        return (<div className={style.itinerarySummaryWrapper}><ItinerarySummary itinerary={itineraries[0]}/></div>)

    let outboundItinerary = itineraries[0];
    let returnItinerary = itineraries[1];

    //determine length of stay
    let cityName = undefined;
    let lengthOfStay = 0;
    try {
        lengthOfStay = OfferUtils.calculateStayBetweenTripsInBusinessDays(outboundItinerary,returnItinerary)
        cityName = OfferUtils.getItineraryDepartureCityName(returnItinerary);
    }catch(err){
        console.log(`Failed to calculate length of stay, err:${err}`);
    }

    return (
        <>
            <div className={style.itinerarySummaryWrapper}>
                <ItinerarySummary itinerary={outboundItinerary}/>
            </div>
            {(cityName && lengthOfStay>0) && (<NightsAtDestination cityName={cityName} nights={lengthOfStay}/>)}
            <div className={style.itinerarySummaryWrapperReturn}>
                <ItinerarySummary itinerary={returnItinerary}/>
            </div>
        </>
    )
}


