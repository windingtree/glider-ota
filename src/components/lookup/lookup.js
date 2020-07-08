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

    //identify whoch airports belong to metropolitan area and make them indented
    function convertResponse(airports) {
        let metropolitanArea;
        return airports.map(airport => {
            if(airport.type === 'METROPOLITAN')
                metropolitanArea=airport;

            let result = {
                primary: airport.city_name + " " + airport.airport_name,
                secondary: airport.country_name,
                code: airport.airport_iata_code,
                indent:false
            }

            if(metropolitanArea){
               if(metropolitanArea.city_code === airport.city_code){
                   if(airport.type !== 'METROPOLITAN')
                       result.indent=true;
               }else{
                   metropolitanArea=null;
               }
            }
            return result;
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

