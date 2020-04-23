import {config} from "../config/default";
import {extendResponse} from "./flight-search-results-transformer";
import offline_flight_results from "../data/sample_response_flights";
import offline_hotels_results from "../data/sample_response_hotels";
import {uiEvent} from "./events";

/**
 * Search for flights with a criteria provided as parameters.
 *
 * @param criteria
 * @returns {Promise<any|Response>}
 */
export async function findFlights(criteria) {
    clearSearchResultsInLocalStorage();
    let results = offline_flight_results;   //TEMP - for devel only
    if (!config.OFFLINE_MODE) {
        const requestInfo = {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json'
            },
            redirect: 'follow',
            referrerPolicy: 'no-referrer',
            body: JSON.stringify(criteria)
        };
        let start=Date.now();
        results = await fetch(config.SEARCH_OFFERS_URL, requestInfo);
        results = await results.json();
        let end=Date.now();
        uiEvent(`find flights execution time:${end-start}ms`)
    }
    results = extendResponse(results);
    storeSearchResultsInLocalStorage(results)
    console.debug('Search results arrived');
    return results;
}


export async function findHotels(criteria) {
    clearSearchResultsInLocalStorage();
    let results = offline_hotels_results;
    if (!config.OFFLINE_MODE) {
        const requestInfo = {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json'
            },
            redirect: 'follow',
            referrerPolicy: 'no-referrer',
            body: JSON.stringify(criteria)
        };

        results = await fetch(config.SEARCH_OFFERS_URL, requestInfo);
        results = await results.json();
    }
    results = extendResponse(results);
    storeSearchResultsInLocalStorage(results)
    console.debug('Search results arrived');
    return results;
}

export function retrieveSearchResultsFromLocalStorage(){
    let searchResults = JSON.parse(localStorage.getItem('searchResults'));
    console.log("retrieveSearchResultsFromLocalStorage",searchResults)
    return searchResults;
}
export function clearSearchResultsInLocalStorage(){
    localStorage.setItem('searchResults',{})
}
export function storeSearchResultsInLocalStorage(searchResults){
    console.log("storeSearchResultsInLocalStorage",searchResults)
    localStorage.setItem('searchResults',JSON.stringify(searchResults))
}