import React from 'react';
import {config} from "../../config/default";
import {useLocation} from 'react-router-dom';
import ReactGA from 'react-ga';
const GA_TRACKING_ID = process.env.REACT_APP_GA_TRACKING_ID || 'G-PVJSQGMDW5'

ReactGA.initialize(GA_TRACKING_ID, {
    debug: true,
    titleCase: false,
    gaOptions: {
        'DEV_MODE': config.DEV_MODE
    }
});

export const sendWebVitalsToAnalytics = ({name, delta, value, id}) => {
    ReactGA.event({
        category: 'Web Vitals',
        // Google Analytics metrics must be integers, so the value is rounded.
        // For CLS the value is first multiplied by 1000 for greater precision
        // (note: increase the multiplier for greater precision if needed).
        value: Math.round(name === 'CLS' ? delta * 1000 : delta),
        value2: Math.round(name === 'CLS' ? value * 1000 : value),
        // The `id` value will be unique to the current page load. When sending
        // multiple values from the same page (e.g. for CLS), Google Analytics can
        // compute a total by grouping on this ID (note: requires `eventLabel` to
        // be a dimension in your report).
        event_label: id,
        // Use a non-interaction event to avoid affecting bounce rate.
        non_interaction: true,
    });
};
export const gaHotelSearch = (longitude, latitude,  departureDate, returnDate, adults, children, infants) => {
    ReactGA.event({
        category: 'hotel_search',
        action: `location`,
        value: {lon:longitude,lat:latitude}
    });
    ReactGA.event({
        category: 'hotel_search',
        action: `adults`,
        value: parseInt(adults)
    });
    ReactGA.event({
        category: 'hotel_search',
        action: `children`,
        value: parseInt(children)
    });
    ReactGA.event({
        category: 'hotel_search',
        action: `infants`,
        value: parseInt(infants)
    });
}
export const gaHotelSearchResults = (results) => {
    let resultsCount = 0;
    if(results && results.offers){
        resultsCount = Object.keys(results.offers)
    }
    ReactGA.event({
        category: 'hotel_search',
        action: `number_of_results`,
        results: resultsCount
    });
}

export const gaFlightSearch = (origin, destination, departureDate, returnDate, adults, children, infants) => {
    ReactGA.event({
        category: 'flight_search',
        action: `market`,
        value: `${origin}-${destination}`
    });
    ReactGA.event({
        category: 'flight_search',
        action: `bounds`,
        value: returnDate?2:1
    });
    ReactGA.event({
        category: 'flight_search',
        action: `adults`,
        value: parseInt(adults)
    });
    ReactGA.event({
        category: 'flight_search',
        action: `children`,
        value: parseInt(children)
    });
    ReactGA.event({
        category: 'flight_search',
        action: `infants`,
        value: parseInt(infants)
    });
}

export const gaFlightSearchResults = (results) => {
    let resultsCount = 0;
    if(results && results.offers){
        resultsCount = Object.keys(results.offers)
    }
    ReactGA.event({
        category: 'flight_search',
        action: `number_of_results`,
        value: resultsCount
    });
}


export const gaSearchError = (error, type) => {

    ReactGA.event({
        category: 'search_failure',
        action: type,
        value: error
    });
}


export const gaGenericError = (error, type) => {

    ReactGA.event({
        category: 'generic_error',
        action: type,
        value: error
    });
}


export const gaItemAddedToCart = (type) => {

    ReactGA.event({
        category: 'cart_action_add',
        action: type,
        value: 0
    });
}



export const gaUserEvent = (action, value) => {
    ReactGA.event({
        category: 'user',
        action: action,
        value: value
    });
}

export const GoogleAnalyticsPageViewReporter = () => {
    const location = useLocation();
    ReactGA.pageview(location.pathname);
    return null;
}
