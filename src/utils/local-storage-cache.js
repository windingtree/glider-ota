import LocalStorageCache from 'localstorage-cache';
import {config} from "../config/default"
import extendResponse from "./flight-search-results-extender";
const CACHE_STRATEGY='LRU';             //LRU=Least Recently Used, LFU-Least Frequently Used

/**
 * Search results returned from Glider OTA backend are cached and stored in a browser (localstorage) so that it can be used later (or in case of page refresh).
 * <br/> This module takes care of local cache operations
 * @module utils/local-storage-cache
 */


const storageCache = new LocalStorageCache(config.CACHE_SIZE_IN_KB, CACHE_STRATEGY); //

/**
 * Store search results in local storach.
 * <br/>Search criteria is used as a key (so that same search retrieves previously cached results)
 * <br/>Cache expiry is set to 10 mins (configurable)
 * @param criteria
 * @param searchResults
 */
export function storeSearchResultsInCache(criteria,searchResults){
    if(searchResults.metadata.postprocessed === true){
        console.error("Cannot store already postprocessed data")
    }
    //stringify search criteria so that it can be used as a key
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

/**
 * Ratrieve specific offer from cache
 * @param offerId
 * @return {*}
 */
export function retrieveOfferFromLocalStorage(offerId){
    let searchResults = retrieveSearchResultsFromLocalStorage();
    if(!searchResults || !searchResults.offers[offerId]){
        console.warn("Cannot retrieve offer from local storage!!! OfferID:",offerId)
        return null;
    }
    return searchResults.offers[offerId];
}

/**
 * Retrieve segment details from local storage.
 * @param segmentId segment to be retrieved
 * @return {*}
 */
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

/**
 * Retrieve itinerary details from local storage
 * @param flightId
 * @return {*}
 */
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

/**
 * Retrieve last search results from cache.
 * @return {*}
 */
export function retrieveSearchResultsFromLocalStorage(){
    let lastSearchCriteriaKey = JSON.parse(localStorage.getItem('lastSearchCriteria'));
    let cachedResults = checkSearchResultsInCache(lastSearchCriteriaKey);
    if(!cachedResults) {
        console.warn("Could not retrieve last search results from local storage!!!")
    }
    return cachedResults;
}
