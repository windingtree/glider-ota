import React, {useState, useEffect} from 'react'
import LookupField from "./components/lookup-field";
import {fetchGet} from "../../../utils/api-utils";


export function CityLookup(props) {
    const {
        initialLocation,
        onSelectedLocationChange,
        placeHolder,
        label,
        localstorageKey
    } = props;
    const [searchResults, setSearchResults] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const [queryPromise, setQueryPromise] = useState(null);

    useEffect(() => {
        console.log('New initial location:', initialLocation);
    }, [initialLocation]);

    useEffect(() => {
        let queryProcess = queryPromise;
        if (queryProcess && typeof queryProcess.then === 'function') {
            queryProcess
                .then(response => {
                    let airports = convertResponse(response.results);
                    setLoading(false);
                    setSearchResults(airports);
                })
                .catch(error => {
                    setLoading(false);
                    console.log('Failed to search for airports', error);
                });
        }
        return () => {
            queryProcess = undefined;
        };
    }, [queryPromise]);

    async function onQueryEntered(searchQuery) {
        setLoading(true);
        setQueryPromise(
            fetchGet('/api/lookup/citySearch', {
                searchquery: searchQuery
            })
        );
    }

    function convertResponse(airports) {
        return airports.map(rec => {
            return {
                primary: rec.city_name,
                secondary: rec.country_name,
                latitude:rec.latitude,
                longitude:rec.longitude
            }
        })
    }

    return (
        <LookupField
            initialLocation={initialLocation}
            onSelectedLocationChange={onSelectedLocationChange}
            placeHolder={placeHolder}
            onQueryEntered={onQueryEntered}
            locations={searchResults}
            label={label}
            localstorageKey={localstorageKey}
            loading={isLoading}
        />
    )
}

