import {HotelSearchResultsWrapper} from "./hotel-search-results-wrapper";

export class HotelSearchResultsFilterHelper {
    constructor(searchResults) {
        this.searchResultsWrapper = new HotelSearchResultsWrapper(searchResults);
    }

    /**
     * Generate a list of offers (search results).
     * Each item in the list contains metadata (e.g. price per night, amenities, rating) so that it can be used later to narrow down/filter search results.
     * @param sortBy
     * @returns {[]}
     */
    generateSearchResults(sortBy = 'PRICE', predicates = []) {
        console.log("generateSearchResults")
        let result = [];
        let hotels = this.searchResultsWrapper.getAllAccommodations();
        let offers = this.searchResultsWrapper.getAllOffers();

        //TODO - filter out hotels based on hotel level criteria (e.g. rating)
        //TODO - filter out offers based on offer level criteria (e.g. price, amenities)

        Object.keys(hotels).forEach(accommodationId => {
            let hotel = this.searchResultsWrapper.getAccommodation(accommodationId);
            let cheapestOffer = this.getCheapestHotelOffer(hotel.accommodationId,offers);
            result.push({
                bestoffer:cheapestOffer,
                hotel: hotel
            });
        })

        return result;
    }

    getCheapestHotelOffer(accommodationId, offers) {
        let minPrice = Number.MAX_SAFE_INTEGER;
        let minOffer = undefined;

        Object.keys(offers).map(offerId => {
            let offer = offers[offerId];
            if (offer.price.public < minPrice)
                minOffer = offer;
        })
        return minOffer;
    }

}


