import React, {useState} from 'react';
import Header from '../components/common/header/header';
import {LOCATION_SOURCE} from '../components/search-form/location-lookup';
import {SearchForm,buildHotelsSearchCriteria,searchForHotels} from '../components/search-form/search-form';
import HotelsPageContent from './hotels';


const SEARCH_STATE={
    NOT_STARTED:'NOT_STARTED',
    IN_PROGRESS:'IN_PROGRESS',
    FAILED:'FAILED',
    FINISHED:'FINISHED'
}

export default function HotelsPage() {
    const [searchCriteria, setSearchCriteria] = useState();
    const [searchState, setSearchState] = useState(SEARCH_STATE.NOT_STARTED);
    const [searchResults, setSearchResults] = useState();

    const onHotelsSearch = (criteria) =>{onSearchStart();setSearchCriteria(criteria);searchForHotels(criteria, onSearchSuccess,onSearchFailure)};
    const onSearchSuccess = (results) =>{setSearchResults(results);setSearchState(SEARCH_STATE.FINISHED);}
    const onSearchFailure = () =>{setSearchResults(undefined);setSearchState(SEARCH_STATE.FAILED);}
    const onSearchStart = () =>{setSearchState(SEARCH_STATE.IN_PROGRESS);}
    return (
        <>
            <div>
                <Header type='violet'/>
                <HotelsSearchForm onHotelsSearch={onHotelsSearch}/>
                {searchState === SEARCH_STATE.IN_PROGRESS && <SearchInProgress/>}
                {searchState === SEARCH_STATE.FAILED && <SearchFailed/>}
                {searchState === SEARCH_STATE.FINISHED && <HotelsPage searchResults={searchResults} />}
            </div>
        </>    )
}



const HotelsSearchForm = ({onHotelsSearch}) =>{
    return (
        <SearchForm
            onSearchRequested={onHotelsSearch}
            enableOrigin={false}
            locationsSource={LOCATION_SOURCE.CITIES}
            oneWayAllowed={false}/>
            )
}

const SearchFailed = ()=>{
    return (
        <div>Oooooops....Something went wrong</div>
    )
}

const SearchInProgress = ()=>{
    return (
        <div>Search is in progress.....please wait</div>
    )
}


