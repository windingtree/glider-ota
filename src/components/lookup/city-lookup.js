import React, { useState, useEffect } from 'react';
import LookupField from './components/lookup-field';
import { fetchGet } from '../../utils/api-utils';

export function CityLookup(props) {
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

    const convertResponse = cities => {
        return cities.map(rec => {
            return {
                primary: rec.city_name,
                secondary: rec.country_name,
                latitude:rec.latitude,
                longitude:rec.longitude
            }
        })
    }

    useEffect(() => {
        let cancelled = false;

        if (searchQuery && isNewSearch) {
            setLoading(true);
            setSearchResults([]);
            setNoResults(false);
            fetchGet(
                '/api/lookup/citySearch',
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

