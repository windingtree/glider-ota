import {HotelSearchResultsWrapper} from "./hotel-search-results-wrapper";
import {FILTERS} from "../components/filters/filters-utils";

export class HotelSearchResultsFilterHelper {
    constructor(searchResults) {
        this.searchResultsWrapper = new HotelSearchResultsWrapper(searchResults);
    }

    /**
     * Generate a list of offers (search results).
     * Each item in the list contains metadata (e.g. price per night, amenities, rating) so that it can be used later to narrow down/filter search results.
     * @param filters Object containing filters selection
     * @returns {[]}
     */
    generateSearchResults(filters = {}) {
        console.log("generateSearchResults, filters:", filters)
        let result = [];
        let hotels = this.searchResultsWrapper.getAllAccommodations();
        let offers = this.searchResultsWrapper.getAllOffers();
        //filter out offers that do not pass 'offer level' filters (e.g. price filter)
        offers = this.applyOfferFilters(offers, filters);

        //iterate over all hotels
        Object.keys(hotels).forEach(accommodationId => {
            let hotel = this.searchResultsWrapper.getAccommodation(accommodationId);

            //check if hotel passes 'hotel level' criteria (e.g. rating filter)
            if (this.applyHotelFilters(hotel, filters)) {
                //if hotel passed - then find the cheapest offer for that hotel (so that it can be displayed in search results)
                let cheapestOffer = this.getCheapestHotelOffer(hotel.accommodationId, offers);
                result.push({
                    bestoffer: cheapestOffer,
                    hotel: hotel
                });
            }
        })

        return result;
    }

    getCheapestHotelOffer(accommodationId, offers) {
        return Object.values(offers).reduce((cheapestSoFar,offer)  => {
            if(cheapestSoFar === undefined) {
                cheapestSoFar = offer;
                return cheapestSoFar;
            }
            if (parseInt(offer.price.public) < parseInt(cheapestSoFar.price.public))
                cheapestSoFar = offer;
            return cheapestSoFar;
        },undefined)
    }

    applyOfferFilters(offers, filters) {
        let result = {};

        if (!filters)
            return offers;

        Object.keys(offers).forEach(offerId => {
            let offer = offers[offerId];
            let checkResult = true;
            if (filters[FILTERS.HOTELPRICE])
                checkResult = checkResult && (this.checkPriceFilter(filters[FILTERS.HOTELPRICE], offer) === true);
            if (checkResult === true)
                result[offerId] = (offer);
        });
        return result;
    }

    checkPriceFilter(filter, offer) {
        const {min, max} = filter;
        let result = true;
        if (min)
            result = result && min <= parseInt(offer.price.public);
        if (max)
            result = result && parseInt(offer.price.public) <= max;
        return result;
    }


    applyHotelFilters(hotel, filterStates) {
        if (!filterStates)
            return true;
        let checkResult = true;
        if (filterStates[FILTERS.RATING])
            checkResult = checkResult && (this.checkHotelRating(filterStates[FILTERS.RATING], hotel) === true);
        if (filterStates[FILTERS.AMENITIES])
            checkResult = checkResult && (this.checkHotelAmenities(filterStates[FILTERS.AMENITIES], hotel) === true);
        return checkResult;
    }

    checkHotelRating(filter, hotel) {
        if (filter['ALL'] && filter['ALL'] === true)
            return true;
        let result = false;
        let hotelRating = hotel.rating;
        if (filter[hotelRating] === true)
            result = true;

        return result;
    }

    checkHotelAmenities(filter, hotel) {
        if (filter['ALL'] && filter['ALL'] === true)
            return true;
        let result = false;
        let hotelRating = hotel.rating;
        if (filter[hotelRating] === true)
            result = true;

        return result;
    }


}


