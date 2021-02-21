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
        let result = [];
        console.log('Hotels - generateSearchResults, filters:', filters)
        let hotels = this.searchResultsWrapper.getAllAccommodations();
        let offers = this.searchResultsWrapper.getAllOffers();
        //filter out offers that do not pass 'offer level' filters (e.g. price filter)
        offers = this.applyOfferFilters(offers, filters);

        //iterate over all hotels
        Object.keys(hotels).forEach(accommodationId => {
            let hotel = this.searchResultsWrapper.getAccommodation(accommodationId);
            console.log('filters:',filters)
            console.log('Hotel:',hotel)

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
        let minPrice = Number.MAX_SAFE_INTEGER;
        let minOffer = undefined;

        let accommodationOffers = this.getOffersOfAccommodationOnly(accommodationId,offers)
        //
        Object.keys(accommodationOffers).forEach(offerId => {
            let offer = accommodationOffers[offerId];
            if (parseInt(offer.price.public) < minPrice){
                minPrice = offer.price.public;
                minOffer = offer;
            }
        })
        return minOffer;
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
        let result = true;
        const availableHotelAmenities = [];
        //collect all available amenities from all hotel rooms
        Object.keys(hotel.roomTypes).forEach(roomId=>{
            let room = hotel.roomTypes[roomId];
            if(Array.isArray(room.amenities))
                availableHotelAmenities.push(...room.amenities)
        })
        //check if selected amenities from filter are available in those that we collected in prev step
        Object.keys(filter).map(amenityName=>{
            if (filter[amenityName]){
                result = result && availableHotelAmenities.includes(amenityName)
            }
        })
        return result;
    }
    getOffersOfAccommodationOnly(accommodationId, allOffers){
        let filteredOffers = {};
        Object.keys(allOffers).forEach(offerId => {
            let offer =  allOffers[offerId];
            if(offer.pricePlansReferences){
                Object.keys(offer.pricePlansReferences).forEach(pricePlanRefId=>{
                    let pricePlanReference=offer.pricePlansReferences[pricePlanRefId];
                    if(pricePlanReference && pricePlanReference.accommodation === accommodationId){
                        filteredOffers[offerId] = offer;
                    }
                })
            }
        })
        return filteredOffers;
    }

}


