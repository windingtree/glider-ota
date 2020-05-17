import React from 'react';
import {
    action
} from '@storybook/addon-actions';
import TripRates,{FareFamilyBenefits} from "./flight-rates"
import searchResults from "../../data/sample_response_flights_transformed"
import sample_response from "../../data/sample_response_unprocessed"
// import extendResponse from "../../utils/flight-search-results-transformer"
// let searchResults = extendResponse(sample_response);
// console.log(searchResults)
export default {
    component: TripRates,
    title: 'FlightRates',
};

let selectedCombination = searchResults.combinations[65];
let selectedOffer = selectedCombination.offers[0];
export const PricePlans = () => (<TripRates pricePlans={searchResults.pricePlans} selectedCombination={selectedCombination} selectedOffer={selectedOffer} onOfferChange={action("onOfferChange")}/>);
let amenities = [
    {text:'2 checked bags free', type:'luggage'},
    {text:'Premium meal service', type:'meal'},
    {text:'Maple Leaf Lounge access'},
    {text:'Exclusive cabin with fully lie-flat seats', type:'seat'},
    {text:'Inspired cuisine, selected wines and spirits', type:'meal'},
    {text:'Priority check-in, security, baggage and boarding', type:'changes'},
    {text:'150% Aeroplan Miles', type:'star'},
    {text:'Free changes, cancellations and standby', type:'changes'},
    {text:'lorem ipsum'}
]

let amentiesTexts = [];
amenities.forEach(r=>amentiesTexts.push(r.text))


export const FareFamilyBenefitsChecked = () => (<FareFamilyBenefits familyName='Economy Flex' price='123 US' amenities={amentiesTexts} isSelected={true}/>);
export const FareFamilyBenefitsUnchecked = () => (<FareFamilyBenefits familyName='Economy Flex' price='123 US' amenities={amentiesTexts} isSelected={false}/>);

