import LocalStorageCache from 'localstorage-cache';
import LZString from "lz-string";

const storageCache = new LocalStorageCache(2 * 1024, 'LRU'); //

export function storeSearchResultsInCache(criteria,searchResults){
    let key = JSON.stringify(criteria);
    storageCache.setCache(key,searchResults);
    localStorage.setItem('lastSearchCriteria',key);
}

export function checkSearchResultsInCache(criteria) {
    console.log("checkSearchResultsInCache, criteria:",JSON.stringify(criteria))
    let result = storageCache.getCache(JSON.stringify(criteria));
    console.log("Cached result:",result)
    return result;
}

export function retrieveOfferFromLocalStorage(offerId){
    let searchResults = retrieveSearchResultsFromLocalStorage();
    return searchResults.offers[offerId];
}

export function retrieveSearchResultsFromLocalStorage(){
    let lastSearchCriteriaKey = JSON.parse(localStorage.getItem('lastSearchCriteria'));
    let cachedResults = checkSearchResultsInCache(lastSearchCriteriaKey);
    // let searchResults = JSON.parse(LZString.decompressFromUTF16(localStorage.getItem('searchResults')));
    // let searchResults = JSON.parse(cachedResults);
    console.log("retrieveSearchResultsFromLocalStorage",cachedResults)
    return cachedResults;
}
/*export function clearSearchResultsInLocalStorage(){
    // localStorage.setItem('searchResults',LZString.compressToUTF16({}));
    localStorage.setItem('searchResults',{});
}*/
/*
export function storeSearchResultsInLocalStorage(searchResults){
    console.log("storeSearchResultsInLocalStorage",searchResults)
    localStorage.setItem('searchResults', JSON.stringify(searchResults));
    // localStorage.setItem('searchResults', LZString.compressToUTF16(JSON.stringify(searchResults)));
}*/
