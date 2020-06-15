import React  from 'react';
import {RangeFilter} from "./range-filter";

export function NightPriceFilter({title = 'Price per night', onFilterSelectionChanged, searchResults, numberOfNights=1}) {
    function onFilterStateChanged(filterState){
        onFilterSelectionChanged(filterState)
    }

    let initialFilterState=initializePriceFilterState(searchResults,numberOfNights);
    return (
        <RangeFilter title={title} unit={initialFilterState.unit} filterState={initialFilterState}  onFilterStateChanged={onFilterStateChanged}/>
    )
}


function initializePriceFilterState(searchResults, numberOfNights) {
    if(numberOfNights<=0)
        numberOfNights=1;   ///just in case it's zero
    let filterState = {min: 0, lowest: 0, highest: 1, max: 1, unit: 'USD'};
    let minPrice = Number.MAX_SAFE_INTEGER;
    let maxPrice = 0;
    let currencyCode; //FIXME: naive detection of currency code based on first offer currency

    if (!searchResults || !searchResults.offers)
        return filterState;
    let offers = searchResults.offers;

    Object.keys(offers).map(offerId => {
        let offer = offers[offerId];
        let price = offer.price;
        if (!currencyCode)
            currencyCode = price.currency;
        let priceInt = parseInt(price.public)
        if (priceInt > maxPrice) {
            maxPrice = priceInt;
        }
        if (priceInt < minPrice) {
            minPrice = priceInt;
        }
    })
    filterState.min = filterState.lowest = Math.round(minPrice/numberOfNights);
    filterState.max = filterState.highest = Math.round(maxPrice/numberOfNights);
    filterState.unit = currencyCode;

    return filterState;

}

