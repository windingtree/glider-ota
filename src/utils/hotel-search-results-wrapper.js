import update from 'immutability-helper';
import {BaseSearchResultsWrapper} from "./base-results-wrapper";

export class HotelSearchResultsWrapper extends BaseSearchResultsWrapper{
    constructor(searchResults) {
        super(searchResults)
        this.accommodations = searchResults.accommodations;
    }

    getAllAccommodations(){
        let hotels={};
        Object.keys(this.accommodations).forEach(accommodationId=>{
            hotels[accommodationId] = this.getAccommodation(accommodationId);
        });
        return hotels;
    }

    getAccommodation(accommodationId){
        let hotel=this.accommodations[accommodationId];
        if(!hotel) {
            console.warn(`HotelSearchResultsWrapper - requested accommodations was not found!`,accommodationId)
            return null;
        }
        hotel = update(hotel,{accommodationId:{$set:accommodationId}});  //enrich returned object with "accommodationId" property
        return hotel;
    }

}

