import LocalStorageCache from 'localstorage-cache';
import {config} from "../config/default"
import extendResponse from "./flight-search-results-transformer";
const CACHE_STRATEGY='LRU';             //LRU=Least Recently Used, LFU-Least Frequently Used


const storageCache = new LocalStorageCache(config.CACHE_SIZE_IN_KB, CACHE_STRATEGY); //

export function storeSearchResultsInCache(criteria,searchResults){
    if(searchResults.metadata.postprocessed === true){
        console.error("Cannot store already postprocessed data")
    }
    let key = JSON.stringify(criteria);
    let copy=Object.assign({},searchResults);
    storageCache.setCache(key,copy,config.CACHE_EXPIRY_IN_SECONDS);
    localStorage.setItem('lastSearchCriteria',key);
}

export function checkSearchResultsInCache(criteria) {
    let result = storageCache.getCache(JSON.stringify(criteria));
    //if there were previously stored results - post process it (e.g. combine outbound&return)
    if(result) {
        result = extendResponse(result);
    }
    return result;
}

export function retrieveOfferFromLocalStorage(offerId){
    let searchResults = retrieveSearchResultsFromLocalStorage();
    if(!searchResults || !searchResults.offers[offerId]){
        console.warn("Cannot retrieve offer from local storage!!! OfferID:",offerId)
    }
    return searchResults.offers[offerId];
}

// Retrieve segment details from local storage
export function retrieveSegmentFromLocalStorage(segmentId){
    let searchResults = retrieveSearchResultsFromLocalStorage();
    if(
        searchResults && 
        searchResults.itineraries && 
        searchResults.itineraries.segments
    ) {
        return searchResults.itineraries.segments[segmentId] 
    }
    console.warn("Cannot retrieve segment from local storage!!! segmentId:", segmentId);
}

// Retrieve itinerary details from local storage
export function retrieveFlightFromLocalStorage(flightId){
    let searchResults = retrieveSearchResultsFromLocalStorage();
    if(
        searchResults && 
        searchResults.itineraries && 
        searchResults.itineraries.combinations
    ) {
        return searchResults.itineraries.combinations[flightId] 
    }
    console.warn("Cannot retrieve flight from local storage!!! flightId:", flightId);
}

export function retrieveSearchResultsFromLocalStorage(){
    let lastSearchCriteriaKey = JSON.parse(localStorage.getItem('lastSearchCriteria'));
    let cachedResults = checkSearchResultsInCache(lastSearchCriteriaKey);
    // let searchResults = JSON.parse(LZString.decompressFromUTF16(localStorage.getItem('searchResults')));
    // let searchResults = JSON.parse(cachedResults);
    if(!cachedResults) {
        console.warn("Could not retrieve last search results from local storage!!!")
    }
    return cachedResults;
}
