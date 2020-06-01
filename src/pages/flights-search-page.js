import React, {useState,useEffect} from 'react';
import Header from '../components/common/header/header';
import {SearchForm,buildFlightsSearchCriteria,searchForFlightsWithCriteria} from '../components/search-form/search-form';
import {parse,isValid} from "date-fns";
import {Button, Container,  Row, Col} from "react-bootstrap";
import Alert from 'react-bootstrap/Alert'
import Filters,{generateFiltersStates} from "../components/filters/filters";
import FlightsSearchResults from "../components/flightresults/flights-search-results";
import {useHistory} from "react-router-dom";
import cssdefs from './flights-search-page.scss'
import Spinner from "../components/common/spinner"
import {uiEvent} from "../utils/events";
import {parseUrl}  from 'query-string';

const SEARCH_STATE={
    NOT_STARTED:'NOT_STARTED',
    IN_PROGRESS:'IN_PROGRESS',
    FAILED:'FAILED',
    FINISHED:'FINISHED'
}

export default function FlightsSearchPage({match,location}) {
    let history = useHistory();
    console.debug("FlightsSearchPage, match:",match, "Location:",location);
    const [searchState, setSearchState] = useState(SEARCH_STATE.NOT_STARTED);
    const [searchResults, setSearchResults] = useState();
    const [filtersStates, setFiltersStates] = useState();

    const onSearchButtonClick = (criteria) => {
        onSearchStart();
        console.log("Search criteria:",criteria)
        searchForFlightsWithCriteria(criteria)
            .then(results=>{
                uiEvent("/flights, search completed");
                onSearchSuccess(results)})
            .catch(err=>{
                uiEvent("/flights, search failed", err);
                onSearchFailure(err)})
    };
    const onSearchSuccess = (results) => {
        console.debug("Search completed, results to be displayed:", results)
        setSearchResults(results);
        let filters=generateFiltersStates(results);
        setFiltersStates(filters);
        setSearchState(SEARCH_STATE.FINISHED);
    }
    const onSearchFailure = (err) => {
        console.error("Search failed", err)
        setSearchResults(undefined);
        setSearchState(SEARCH_STATE.FAILED);
    }
    const onSearchStart = () => {
        setSearchState(SEARCH_STATE.IN_PROGRESS);
    }

    const onFiltersChanged = (filters) => {
        setFiltersStates(filters)

    }

    const initialParameters = parseDeeplinkParams(location);
    const deeplinkAction = initialParameters.action;

    useEffect(()=>{
        if(deeplinkAction === 'search'){
            onSearchButtonClick(initialParameters);
        }
        },[]);

    const onOfferSelected = (offerId) => {
        let url = createOfferURL(offerId);
        const passengers = Object.keys(searchResults.passengers).map(passengerId => {
            return {id:passengerId, ...searchResults.passengers[passengerId]};
        });
        history.push(url, { passengers: passengers });
    };

    console.debug("Render flight results")
    return (
        <div>
            <Header violet={true}/>
            <div className='root-container-subpages'>

                <div className='d-flex flex-row '>
                    <div className="filters-wrapper">
                            <Filters searchResults={searchResults} filtersStates={filtersStates} onFilterApply={onFiltersChanged}/>
                    </div>
                        <div >
                            <SearchForm
                                onSearchButtonClick={onSearchButtonClick}
                                enableOrigin={true}
                                oneWayAllowed={true}
                                initAdults={initialParameters.adults}
                                initChildren={initialParameters.children}
                                initInfants={initialParameters.infants}
                                initiDest={initialParameters.destination}
                                initOrigin={initialParameters.origin}
                                initDepartureDate={initialParameters.departureDate}
                                initReturnDate={initialParameters.returnDate}
                            />
                            <Spinner enabled={searchState === SEARCH_STATE.IN_PROGRESS}/>
                            {searchState === SEARCH_STATE.FAILED && <WarningNoResults/>}
                            {searchResults !== undefined &&
                            <FlightsSearchResults
                                onOfferDisplay={onOfferSelected}
                                searchResults={searchResults}
                                filtersStates={filtersStates}
                            />
                            }
                        </div>
                    </div>
            </div>
        </div>
    )
}


// Display the No Flight message
const SearchFailed = () => {
    return (
        <div className='glider-font-h3-fg pt-3'></div>
    )
};

const WarningNoResults = () => {
     return (
        <Alert variant="warning">
        <Alert.Heading>
            Sorry, we could not find any flights
            <span role='img' aria-label='sorry'> 😢</span>
        </Alert.Heading>
        <p>
            Glider has been launched with our amazing partner <b><a href='https://aircanada.com'>Air Canada</a></b>, 
            so for now we have only results flying to, from or over Canada 🇨🇦! Why not going there?
        </p>
        <hr />
        <p className="mb-0">
            We are working with other partners, and more options will quickly
            become available, stay tuned! <span role='img' aria-label='wink'>😉</span>
        </p>
        </Alert>
     );
};

function createOfferURL(offerId){
    const url = "/flights/tripoverview/"+offerId;
    return url;
}

const parseDeeplinkParams = (location) =>{
    let parsedUrl=parseUrl(location.search);
    let params = parsedUrl.query;
    let dptr =  parse(params.departureDate,'yyyyMMdd',new Date());
    let ret =  parse(params.returnDate,'yyyyMMdd',new Date());
    return {
        origin: parseJSONWithDefault(params.origin,''),
        destination: parseJSONWithDefault(params.destination,''),
        departureDate: isValid(dptr)?dptr:undefined,
        returnDate: isValid(ret)?ret:undefined,
        adults: parseInt(params.adults)||1,
        children: parseInt(params.children)||0,
        infants:  parseInt(params.infants)||0,
        action:params.action
    }
}

function parseJSONWithDefault(obj,defaultValue){
    try{
        return JSON.parse(obj)
    }catch{
        return defaultValue;
    }
}