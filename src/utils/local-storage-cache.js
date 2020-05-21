import LocalStorageCache from 'localstorage-cache';
const CACHE_SIZE_IN_KB=2*1024;          //in KB (2024KB = 2MB)
const CACHE_EXPIRY_IN_SECONDS=60*60;    //600 sec = 10 min
const CACHE_STRATEGY='LRU';             //LRU=Least Recently Used, LFU-Least Frequently Used


const storageCache = new LocalStorageCache(CACHE_SIZE_IN_KB, CACHE_STRATEGY); //

export function storeSearchResultsInCache(criteria,searchResults){
    let key = JSON.stringify(criteria);
    storageCache.setCache(key,searchResults,CACHE_EXPIRY_IN_SECONDS);
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
