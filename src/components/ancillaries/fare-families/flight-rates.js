import React, {useState} from 'react';
import style from './flight-rates.module.scss'
import {ItineraryHeader, ItinerarySummary} from '../../flight-blocks/itinerary-summary';
import FareFamilyHelper from '../../../utils/fare-family-helper';
import {AncillarySelectableItem} from '../../common-blocks/ancillary-selectable-item'


/**
 * Display entire trip (outbound & return) informaton with fare families selection
 */
export default function TripRates({tripRates, selectedOffer, onOfferChange, baselineFare}) {
    const [currentOffer, setCurrentOffer] = useState(selectedOffer)


    function handlePricePlanSelection(itinId, pricePlanId) {

    }

    function onOfferSelected(offerId) {
        let offer = tripRates.offers[offerId]
        setCurrentOffer(offer);

        console.debug("onOfferSelected, offerId:", offerId)
        onOfferChange(offerId)
    }

    let itineraries = tripRates.itineraries;

    return (
        <>

            <div>
                {
                    itineraries.map(itinerary => {
                        return (
                            <ItineraryRates key={itinerary.itinId} itinerary={itinerary} tripRates={tripRates}
                                            selectedOffer={currentOffer}
                                            onPricePlanSelected={handlePricePlanSelection}
                                            onOfferSelected={onOfferSelected} baselineFare={baselineFare}/>)

                    })
                }

            </div>
            <div className={style.ratesHeader}>Insurance <small>Provided by EKTA</small></div>
            <div>
                {insuranceOffer()}
            </div>

        </>
    )
}

/**
 * Render itinerary information with fare family selection
 */


export function ItineraryRates({itinerary, tripRates, selectedOffer, onOfferSelected, baselineFare}) {
    let itineraryId = itinerary.itinId;


    function selectOffer(offerId) {
        //TODO fixme
        if (offerId !== 'UNKNOWN')
            onOfferSelected(offerId)
        else {
            console.error("Unknown offer was selected!")
        }
    }

    let pricePlans = tripRates.pricePlans;
    let fareFamilyHelper = new FareFamilyHelper(tripRates);
    let itineraryPricePlans = fareFamilyHelper.getItineraryPriceWithLowestPrice(itineraryId);
    let priceOffsets = fareFamilyHelper.getItineraryPricePlanOffsetPrices(selectedOffer.offerId, itineraryId);
    let selectedPricePlanId = selectedOffer.itinToPlanMap[itineraryId];

    //if we only have one fare family - no need to ask user to select. We also need to disable 'deselection'
    let disableFareFamilySelection = false;
    if (itineraryPricePlans.length <= 1) {
        disableFareFamilySelection = true;
    }

    return (<>
        {/*<ItineraryDetails itinerary={itinerary} key={itineraryId}/>*/}
        <ItineraryHeader itinerary={itinerary}/>
        <div className={style.itineraryContainer}>
            <ItinerarySummary itinerary={itinerary}/>
        </div>
        <div className={style.ratesHeader}>Fare family</div>
        <div>
            {
                itineraryPricePlans.map(({pricePlanId, lowestPrice}) => {
                    let pricePlan = pricePlans[pricePlanId];
                    let priceOffset = priceOffsets[pricePlanId];
                    let priceDifference = {};
                    let offerId = 'UNKNOWN';
                    console.log('Price plan:', pricePlan)
                    if (priceOffset) {
                        if (baselineFare) {   //baselineFare is the fare selected by user from search results page
                            //if it is set - we should calculate the difference between that fare and given fare family
                            let baselineAmount = baselineFare.public;
                            let fareFamilyAmount = lowestPrice.public;
                            let diff = parseInt(fareFamilyAmount) - parseInt(baselineAmount);
                            //if there is no difference - don't display anything
                            if (Math.round(diff) !== 0) {
                                priceDifference = {
                                    public: diff,
                                    currency: baselineFare.currency
                                }
                            } else {
                                priceDifference = null;
                            }
                        }

                        offerId = priceOffset.offerId;
                    }
                    return (
                        <>
                            <FareFamilyWthBenefits key={offerId} amenities={pricePlan.amenities} price={priceDifference}
                                                   familyName={pricePlan.name}
                                                   isSelected={pricePlanId === selectedPricePlanId} onClick={() => {
                                selectOffer(offerId)
                            }} fareFamilySelectionDisabled={disableFareFamilySelection}/>
                        </>
                    )

                })
            }
        </div>
    </>)
}


const insuranceOffer = () => {
    let noinsurance = {
        title: 'No Insurance',
        items: [],
        price: '0 USD',
        enabled: true
    }
    let standard = {
        title: 'Standard',
        price: '+45 USD',
        items: ['Medical expenses (including COVID-19*)', 'Trip cancellation due to your illness (incl. COVID-19*)', 'Accident', 'Death', 'Assistance services'],
        enabled: true
    }

    let extended = {
        title: 'Extender',
        price: '+78 USD',
        items: ['Medical expenses (including COVID-19*)', 'Trip cancellation due to your illness (incl. COVID-19*)', 'Accident', 'Death', 'Assistance services', 'Lost baggage', 'Air travel insurance', 'Liability'],
        enabled: true
    }

    return (
        <>
            <AncillarySelectableItem name={noinsurance.title} items={noinsurance.items} isSelected={true}
                                     isDisabled={false} price={noinsurance.price}/>
            <AncillarySelectableItem name={standard.title} items={standard.items} isSelected={false} isDisabled={true}
                                     price={standard.price}/>
            <AncillarySelectableItem name={extended.title} items={extended.items} isSelected={false} isDisabled={true}
                                     price={extended.price}/>
        </>
    )
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
export function FareFamilyWthBenefits({
                                          familyName,
                                          price,
                                          isSelected,
                                          amenities = [],
                                          onClick,
                                          fareFamilySelectionDisabled
                                      }) {
    let fare;
    if (price && price.public) {
        fare = Math.round(price.public) + " " + price.currency;
        if (price.public > 0)
            fare = "+" + fare;
        else if (price.public === 0) {
            fare = "";
        }
    }
    if (amenities) {
        amenities = amenities.map(item => {
            item = item.replace('[object Object]', '2')
            return item;
        })
    }
    let name = `${familyName}`
    return (
        <AncillarySelectableItem name={name} items={amenities} isSelected={isSelected}
                                 isDisabled={fareFamilySelectionDisabled} onSelect={onClick} price={fare}/>
    )
}

