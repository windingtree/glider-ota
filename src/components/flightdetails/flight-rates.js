import React, {useState} from 'react';
import OfferUtils from "../../utils/offer-utils";
import style from "./flight-rates.module.scss"
import {ItineraryDetails} from "./trip-details";
import FareFamilyHelper from "../../utils/fare-family-helper";



export default function TripRates({tripRates, selectedOffer, onOfferChange,baselineFare}) {
    const [currentOffer, setCurrentOffer] = useState(selectedOffer)
    let fareFamilyHelper = new FareFamilyHelper(tripRates);

    function handlePricePlanSelection(itinId, pricePlanId) {

    }

    function onOfferSelected(offerId) {
        let offer = tripRates.offers[offerId]
        setCurrentOffer(offer);

        console.debug("onOfferSelected, offerId:",offerId)
        onOfferChange(offerId)
    }

    let itineraries = tripRates.itineraries;

    return (
        <>

            <div>
                {
                    itineraries.map(itinerary => {
                        let itinId = itinerary.itinId;
                        let pricePlanIds=fareFamilyHelper.getItineraryPricePlansInAscendingOrder(itinId);

                        return (
                            <ItineraryRates key={itinId} itinerary={itinerary} tripRates={tripRates} selectedOffer={currentOffer}
                                            onPricePlanSelected={handlePricePlanSelection} onOfferSelected={onOfferSelected} baselineFare={baselineFare}/>)

                    })
                }

            </div>
        </>
    )
}

/**
 * Render price plans of an itinerary
 */

export function ItineraryRates({itinerary, tripRates, selectedOffer, onPricePlanSelected, onOfferSelected, baselineFare}) {
    let itineraryId = itinerary.itinId;
    function selectPlan(itineraryId,pricePlanId){
        onPricePlanSelected(itineraryId,pricePlanId)
    }

    function selectOffer(offerId){
        console.log("selectOffer",offerId)
        //TODO fixme
        if(offerId!='UNKNOWN')
            onOfferSelected(offerId)
        else{
            console.error("Unknown offer was selected!")
        }
    }

    let pricePlans = tripRates.pricePlans;
    let fareFamilyHelper = new FareFamilyHelper(tripRates);
    let pricePlanIds = fareFamilyHelper.getItineraryPricePlansInAscendingOrder(itineraryId);
    let priceOffsets = fareFamilyHelper.getItineraryPricePlanOffsetPrices(selectedOffer.offerId,itineraryId);
    let selectedPricePlanId = selectedOffer.itinToPlanMap[itineraryId];


    return (<>
        <ItineraryDetails itinerary={itinerary}/>
        <div className='py-5'/>
        <div className={style.ratesHeader}>Select a fare below</div>
        <div className='d-flex flex-row flex-wrap'>
                {
                    pricePlanIds.map(pricePlanId => {
                        let pricePlan = pricePlans[pricePlanId];
                        let priceOffset = priceOffsets[pricePlanId];
                        let priceDifference = {};
                        let offerId = 'UNKNOWN';
                        if(priceOffset) {
                            if(baselineFare){   //baselineFare is the fare selected by user from search results page
                                //if it is set - we should calculate the difference between that fare and given fare family
                                let baselineAmount = baselineFare.public;
                                let fareFamilyAmount = priceOffset.price.public;
                                let diff = parseInt(fareFamilyAmount) - parseInt(baselineAmount);
                                //if there is no difference - don't display anything
                                if(Math.round(diff)!=0){
                                    priceDifference={
                                        public:diff,
                                        currency:baselineFare.currency
                                    }
                                }else {
                                    priceDifference=null;
                                }
                            }

                            offerId = priceOffset.offerId;
                        }
                        return (
                            <FareFamilyBenefits key={offerId} amenities={pricePlan.amenities} price={priceDifference} familyName={pricePlan.name} isSelected={pricePlanId === selectedPricePlanId} onClick={() => { selectOffer(offerId)}}/>
                        )

                    })
                }
        </div>
    </>)
}



const Amenity = ({text,type, isSelected})=>{
    let className = 'amenityicon';
    if(isSelected)
        className+= ' amenityActive';
    else
        className+= ' amenityInactive';
    if(type)
        className+=' gicon-'+type;
    return (<>
        <div className='ratesPlanDetails'><i className={className}/>{text}</div>
    </>)
}

/**
 * Render single fare family with it's benefits list and price
 * @param familyName
 * @param price
 * @param isSelected
 * @param amenities
 * @param onClick
 * @returns {*}
 * @constructor
 */
export function FareFamilyBenefits({familyName, price, isSelected, amenities=[], onClick}) {
    let styleName = style.priceplanContainer;
    if(isSelected)
        styleName = style.priceplanContainerSelected;

    let fare='';
    if(price && price.public){
        fare = Math.round(price.public) + " "+ price.currency;
        if(price.public>0)
            fare = "+"+fare;
        else if(price.public==0){
            fare = "";
        }
    }
    function handleClick(){
        onClick();
    }
    let key=0;
    return (
        <div className={styleName} onClick={handleClick}>
            <div className={style.ratesPlanName}>{familyName}</div>
            <div className={style.ratesPlanPrice}>{fare}</div>
            {
                amenities.map((record) =><Amenity key={key++} text={record} type={record.type} isSelected={isSelected}/>)
            }
        </div>
    )
}

