import {config} from "../config/default";
import {extendResponse} from "./flight-search-results-transformer";
import offline_flight_results from "../data/sample_response_flights";
import offline_hotels_results from "../data/sample_response_hotels";

export async function findFlights(criteria) {
    if (config.OFFLINE_MODE) {
        return extendResponse(offline_flight_results)
    }


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

    let results = await fetch(config.SEARCH_OFFERS_URL, requestInfo);
    results = await results.json();
    results = extendResponse(results);
    console.debug('Search results arrived');
    return results;
}


export async function findHotels(criteria) {
    if (config.OFFLINE_MODE) {
        return extendResponse(offline_hotels_results)
    }


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

    let results = await fetch(config.SEARCH_OFFERS_URL, requestInfo);
    results = await results.json();
    results = extendResponse(results);
    console.debug('Search results arrived');
    return results;
}


