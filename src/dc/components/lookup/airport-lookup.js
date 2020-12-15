import React, {useState, useEffect} from 'react'
import LookupField from "./components/lookup-field";
import {fetchGet} from "../../../utils/api-utils";

export function AirportLookup({initialLocation, onSelectedLocationChange, placeHolder, label, localstorageKey}) {
    const [searchResults, setSearchResults] = useState([]);
    const [queryPromise, setQueryPromise] = useState(null);

    useEffect(() => {
        let queryProcess = queryPromise;
        if (queryProcess && typeof queryProcess.then === 'function') {
            queryProcess
                .then(response => {
                    let airports = convertResponse(response.results);
                    setSearchResults(airports);
                })
                .catch(error => console.log('Failed to search for airports', error));
        }
        return () => {
            queryProcess = undefined;
        };
    }, [queryPromise]);

    async function onQueryEntered(searchQuery) {
        setQueryPromise(
            fetchGet('/api/lookup/airportSearch2', {
                searchquery: searchQuery
            })
        );
    }

    function convertResponse(airports) {
        let lastMetropolitan;
        return airports.map(rec => {
            let icon,primaryName, secondaryName, code, indent=false;

            if(rec.type === 'AIRPORT')
                icon='airport'
            if(lastMetropolitan && lastMetropolitan.city_code === rec.city_code){
                indent=true;
            }
            if(rec.type === 'METROPOLITAN'){
                primaryName=rec.city_name
            }else{
                primaryName=rec.city_name + " " + rec.airport_name;
            }
            secondaryName=rec.country_code;
            if(rec.type === 'METROPOLITAN'){
                lastMetropolitan=rec;
            }
            return {
                primary: primaryName,
                secondary: secondaryName,
                code: rec.airport_iata_code,
                indent: indent,
                icon:icon
            }
        })
    }
    return (
        <LookupField initialLocation={initialLocation} onSelectedLocationChange={onSelectedLocationChange}
                     placeHolder={placeHolder} onQueryEntered={onQueryEntered} locations={searchResults} label={label} localstorageKey={localstorageKey}/>
    )
}


