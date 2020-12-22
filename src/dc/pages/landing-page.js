import React, { useState, useEffect } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import SearchModeSelector from "../components/search-form/search-mode-selector";
import FlightsShoppingComponent from "../components/flight-shopping/flights-shopping-component"
import HotelsShoppingComponent from "../components/hotel-shopping/hotels-shopping-component"
import { SEARCH_TYPE } from "../components/search-form/search-mode-selector"
import DevConLayout from "../components/layout/devcon-layout"
import { LandingExplainer } from '../components/landing-explainer/landing-explainer';

export default function DCLandingPage() {
    const match = useRouteMatch();
    const history = useHistory();
    const searchType = match.path === '/dc/flights'
        ? SEARCH_TYPE.FLIGHTS
        : match.path === '/dc/hotels'
            ? SEARCH_TYPE.HOTELS
            : SEARCH_TYPE.FLIGHTS;
    const locationState = history.location && history.location.state;
    const [searchCity, setSearchCity] = useState();
    const [searchDateId, setSearchDateIn] = useState();
    const [searchDateOut, setSearchDateOut] = useState();
    const [searchPassengersCounts, setSearchPassengersCounts] = useState();
    const [initSearch, setInitSearch] = useState(false);

    useEffect(() => {
        if (locationState) {
            const {
                city,
                dateIn,
                dateOut,
                passengersCounts,
                doSearch
            } = history.location && history.location.state;
            setSearchCity(city);
            setSearchDateIn(dateIn);
            setSearchDateOut(dateOut);
            setSearchPassengersCounts(passengersCounts);
            setInitSearch(doSearch);
        }
    }, [history.location, locationState]);

    return (<DevConLayout>
        <SearchModeSelector />
        {searchType === SEARCH_TYPE.FLIGHTS && (
            <FlightsShoppingComponent
                initDest={searchCity}
                initDepartureDate={searchDateId}
                initReturnDate={searchDateOut}
            />
        )}
        {searchType === SEARCH_TYPE.HOTELS && (
            <HotelsShoppingComponent
                initDest={searchCity}
                initDepartureDate={searchDateId}
                initReturnDate={searchDateOut}
                initAdults={searchPassengersCounts && searchPassengersCounts.adults}
                initChildren={searchPassengersCounts && searchPassengersCounts.children}
                initInfants={searchPassengersCounts && searchPassengersCounts.infants}
                initSearch={initSearch}
            />
        )}
        <LandingExplainer/>
    </DevConLayout>)
}
