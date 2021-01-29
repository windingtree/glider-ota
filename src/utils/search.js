import {config} from "../config/default";
import offline_hotels_results from "../components/storybook-utils/mock-data/sample_response_hotels";

/**
 * Search for flights with a criteria provided as parameters.
 *
 * @param criteria
 * @returns {Promise<any|Response>}
 */
export async function findFlights(criteria) {
    let results;
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

    // results = extendResponse(results);
    return results;
}


export async function findHotels(criteria) {
    let results ;
/*
    let results = checkSearchResultsInCache(criteria)
    if(results) {
        // console.log("Using search results from cache")
    }else{
*/
        // console.log("Search results not found in cache")
        if (config.OFFLINE_MODE) {
            console.warn("OFFLINE_MODE = true. Using search results from static file!!!");
            results = offline_hotels_results;
        }else{
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
    // }
    // storeSearchResultsInCache(criteria,results);
    // results = extendResponse(results);
    return results;
}

