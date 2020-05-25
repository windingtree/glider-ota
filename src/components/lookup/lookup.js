import React, {useState} from 'react'
import LookupField from "./lookup-field";
import {fetchGet} from "../../utils/api-utils";


export function AirportLookup({initialLocation, onSelectedLocationChange, placeHolder}) {
    const [searchResults, setSearchResults] = useState([]);

    async function onQueryEntered(searchQuery) {
        let results = fetchGet('/api/lookup/airportSearch', {searchquery: searchQuery});
        results.then((response) => {
            let airports = convertResponse(response.results);
            setSearchResults(airports);
        }).catch(err => {
            console.error("Failed to search for airports", err)
        })
    }

    function convertResponse(airports) {
        return airports.map(rec => {
            return {
                primary: rec.city_name + " " + rec.airport_name,
                secondary: rec.country_name,
                code: rec.airport_iata_code
            }
        })
    }

    return (
        <LookupField initialLocation={initialLocation} onSelectedLocationChange={onSelectedLocationChange}
                     placeHolder={placeHolder} onQueryEntered={onQueryEntered} locations={searchResults}/>
    )
}

export function CityLookup({initialLocation, onSelectedLocationChange, placeHolder}) {
    const [searchResults, setSearchResults] = useState([]);

    async function onQueryEntered(searchQuery) {
        let results = fetchGet('/api/lookup/citySearch', {searchquery: searchQuery});
        results.then((response) => {
            let airports = convertResponse(response.results);
            setSearchResults(airports);
        }).catch(err => {
            console.error("Failed to search for locations", err)
        })
    }

    function convertResponse(airports) {
        return airports.map(rec => {
            return {
                primary: rec.city_name,
                secondary: rec.country_name,
                code: rec.country_code,
                latitude:rec.latitude,
                longitude:rec.longitude
            }
        })
    }

    return (
        <LookupField initialLocation={initialLocation} onSelectedLocationChange={onSelectedLocationChange}
                     placeHolder={placeHolder} onQueryEntered={onQueryEntered} locations={searchResults}/>
    )
}

