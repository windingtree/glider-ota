import React  from 'react';
import {RangeFilter} from "./range-filter";

export function PriceFilter({title = 'Airlines', onFilterStateChanged, searchResults}) {

    function initializeFilter() {
        let minPrice = Number.MAX_SAFE_INTEGER;
        let maxPrice = 0;
        let offers = searchResults.offers;
        let currencyCode; //FIXME: naive detection of currency code based on first offer currency

        Object.keys(offers).map(offerId => {
            let offer = offers[offerId];
            let price = offer.price;
            if(!currencyCode)
                currencyCode=price.currency;
            let priceInt = parseInt(price.public)
            if (priceInt > maxPrice) {
                maxPrice = priceInt;
            }
            if (priceInt < minPrice) {
                minPrice = priceInt;
            }
        })
        return {min: minPrice, lowest: minPrice, highest: maxPrice, max: maxPrice, unit:currencyCode};

    }
    let init=initializeFilter();
    return (
        <RangeFilter title={title} unit={init.unit} filterState={init} id={'priceFilter'} onFilterStateChanged={onFilterStateChanged}/>
    )
}

