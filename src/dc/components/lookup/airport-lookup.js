import React, { useEffect, useState } from 'react';
import LookupField from './components/lookup-field';
import { fetchGet } from '../../../utils/api-utils';

export function AirportLookup(props) {
    const {
        initialLocation,
        onSelectedLocationChange,
        placeHolder,
        label,
        localstorageKey
    } = props;
    const [searchResults, setSearchResults] = useState([]);
    const [searchQuery, setSearchQuery] = useState();
    const [isNewSearch, setNewSearch] = useState(false);
    const [isLoading, setLoading] = useState(false);
    const [isNoResults, setNoResults] = useState(false);

    const convertResponse = (airports) => {
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
    };

    useEffect(() => {
        let cancelled = false;
        // console.log('Search query:', searchQuery, initialLocation, isNewSearch);

        if (searchQuery && isNewSearch) {
            setLoading(true);
            setSearchResults([]);
            setNoResults(false);
            fetchGet(
                '/api/lookup/airportSearch2',
                {
                    searchquery: searchQuery
                }
            )
                .then(response => {
                    if (!cancelled) {
                        let results = convertResponse(response.results);
                        setLoading(false);
                        setNoResults(results.length === 0);

                        if (results.length > 0) {
                            setSearchResults(results);
                        }

                        setNewSearch(false);
                    }
                })
                .catch(error => {
                    setLoading(false);
                    console.log('Failed to search for airports', error);
                });
        }

        return () => {
            cancelled = true;
        };
    }, [searchQuery, initialLocation, isNewSearch]);

    const onNewSearch = () => {
        setNewSearch(true);
    };

    return (
        <LookupField
            initialLocation={initialLocation}
            onSelectedLocationChange={onSelectedLocationChange}
            placeHolder={placeHolder}
            onQueryEntered={setSearchQuery}
            onNewSearch={onNewSearch}
            locations={searchResults}
            label={label}
            localstorageKey={localstorageKey}
            loading={isLoading}
            noResults={isNoResults}
        />
    )
}


