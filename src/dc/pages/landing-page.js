import React, {useState, useEffect} from 'react';
import {useHistory} from "react-router-dom";
import SearchModeSelector from "../components/search-form/search-mode-selector";
import FlightsShoppingComponent from "../components/flight-shopping/flights-shopping-component"
import HotelsShoppingComponent from "../components/hotel-shopping/hotels-shopping-component"
import {SEARCH_TYPE} from "../components/search-form/search-mode-selector"
import DevConLayout from "../components/layout/devcon-layout"

export default function DCLandingPage({match}) {
    const history = useHistory();
    const {
        searchType: customSearchType,
        city,
        dateIn,
        dateOut
    } = history.location && history.location.state ? history.location.state : {};
    const [searchType, setSearchType] = useState(
        customSearchType
        ? customSearchType
        : SEARCH_TYPE.FLIGHTS
    );
    useEffect(() => {
        if (customSearchType && customSearchType !== searchType) {
            console.log('New search type', customSearchType);
            setSearchType(customSearchType);
        }
    }, [customSearchType]);
    return (<DevConLayout>
        <SearchModeSelector selectedMode={searchType} onToggle={setSearchType}/>
        {searchType === SEARCH_TYPE.FLIGHTS && (
            <FlightsShoppingComponent
                initiDest={city}
                initDepartureDate={dateIn}
                initReturnDate={dateOut}
            />
        )}
        {searchType === SEARCH_TYPE.HOTELS && (
            <HotelsShoppingComponent
                initiDest={city}
                initDepartureDate={dateIn}
                initReturnDate={dateOut}
            />
        )}
    </DevConLayout>)
}
