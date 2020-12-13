import React, {useState} from 'react';
import SearchModeSelector from "../components/search-form/search-mode-selector";
import FlightsShoppingComponent from "../components/flight-shopping/flights-shopping-component"
import HotelsShoppingComponent from "../components/hotel-shopping/hotels-shopping-component"
import {SEARCH_TYPE} from "../components/search-form/search-mode-selector"
import DevConLayout from "../components/layout/devcon-layout"

export default function DCLandingPage() {
    const [searchType, setSearchType] = useState(SEARCH_TYPE.FLIGHTS);
    return (<DevConLayout>
        <SearchModeSelector selectedMode={searchType} onToggle={setSearchType}/>
        {searchType === SEARCH_TYPE.FLIGHTS && (<FlightsShoppingComponent/>)}
        {searchType === SEARCH_TYPE.HOTELS && (<HotelsShoppingComponent/>)}
    </DevConLayout>)
}
