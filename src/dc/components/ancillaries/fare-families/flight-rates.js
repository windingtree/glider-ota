import React, {useState} from 'react';
import style from "./flight-rates.module.scss"
import {ItineraryDetails} from "../../flightdetails/trip-details";
import {ItinerarySummary} from "../../flight-blocks/itinerary-summary";
import FareFamilyHelper from "../../../../utils/fare-family-helper";
import {AncillarySelectableItem} from "../../common-blocks/ancillary-selectable-item"

import {Form} from "react-bootstrap";


/**
 * Display entire trip (outbound & return) informaton with fare families selection
 */
export default function TripRates({tripRates, selectedOffer, onOfferChange,baselineFare}) {
    const [currentOffer, setCurrentOffer] = useState(selectedOffer)


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
                        return (
                            <ItineraryRates key={itinerary.itinId} itinerary={itinerary} tripRates={tripRates} selectedOffer={currentOffer}
                                            onPricePlanSelected={handlePricePlanSelection} onOfferSelected={onOfferSelected} baselineFare={baselineFare}/>)

                    })
                }

            </div>
        </>
    )
}
/**
 * Render itinerary information with fare family selection
 */


export function ItineraryRates({itinerary, tripRates, selectedOffer, onPricePlanSelected, onOfferSelected, baselineFare}) {
    let itineraryId = itinerary.itinId;


    function selectOffer(offerId){
        //TODO fixme
        if (offerId !== 'UNKNOWN')
            onOfferSelected(offerId)
        else{
            console.error("Unknown offer was selected!")
        }
    }

    let pricePlans = tripRates.pricePlans;
    let fareFamilyHelper = new FareFamilyHelper(tripRates);
    let itineraryPricePlans = fareFamilyHelper.getItineraryPriceWithLowestPrice(itineraryId);
    let priceOffsets = fareFamilyHelper.getItineraryPricePlanOffsetPrices(selectedOffer.offerId,itineraryId);
    let selectedPricePlanId = selectedOffer.itinToPlanMap[itineraryId];

    //if we only have one fare family - no need to ask user to select. We also need to disable 'deselection'
    let disableFareFamilySelection = false;
    if(itineraryPricePlans.length<=1) {
        disableFareFamilySelection=true;
    }

    return (<>
        {/*<ItineraryDetails itinerary={itinerary} key={itineraryId}/>*/}
        <div className={style.itineraryContainer}>
            <ItinerarySummary itinerary={itinerary}/>
        </div>
        <div className={style.ratesHeader}>Fare family</div>
        <div >
                {
                    itineraryPricePlans.map(({pricePlanId,lowestPrice}) => {
                        let pricePlan = pricePlans[pricePlanId];
                        let priceOffset = priceOffsets[pricePlanId];
                        let priceDifference = {};
                        let offerId = 'UNKNOWN';
                        console.log('Price plan:',pricePlan)
                        if(priceOffset) {
                            if(baselineFare){   //baselineFare is the fare selected by user from search results page
                                //if it is set - we should calculate the difference between that fare and given fare family
                                let baselineAmount = baselineFare.public;
                                let fareFamilyAmount = lowestPrice.public;
                                let diff = parseInt(fareFamilyAmount) - parseInt(baselineAmount);
                                //if there is no difference - don't display anything
                                if (Math.round(diff) !== 0) {
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
                            <FareFamilyWthBenefits key={offerId} amenities={pricePlan.amenities} price={priceDifference} familyName={pricePlan.name} isSelected={pricePlanId === selectedPricePlanId} onClick={() => { selectOffer(offerId)}} fareFamilySelectionDisabled={disableFareFamilySelection}/>
                        )

                    })
                }
        </div>
        <div className='py-5'/>
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
export function FareFamilyWthBenefits({familyName, price, isSelected, amenities=[], onClick, fareFamilySelectionDisabled}) {
    let fare;
    if(price && price.public){
        fare = Math.round(price.public) + " "+ price.currency;
        if(price.public>0)
            fare = "+"+fare;
        else if (price.public === 0) {
            fare = "";
        }
    }
    console.log('Amenities:',amenities)
    let name = `${familyName}`
    return (
        <AncillarySelectableItem name={name} items={amenities} isSelected={isSelected} isDisabled={fareFamilySelectionDisabled} onSelect={onClick} price={fare}/>
    )
}

