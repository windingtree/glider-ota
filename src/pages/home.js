import React, {useState} from 'react';
import Header from '../components/common/header/header';
import Footer from '../components/common/footer/footer';
import ContentWrapper from '../components/common/content-wrapper';
import {Container,Row,Col,ToggleButton, ToggleButtonGroup} from 'react-bootstrap';
import {LOCATION_SOURCE} from '../components/location-lookup/location-lookup';
import SearchForm from '../components/search-form/search-form';
import SearchCriteriaBuilder from '../utils/search-criteria-builder';
import {extendResponse} from '../utils/flight-search-results-transformer'
import FlightsPage from './flights';
import HotelsPage from './hotels';
import {config} from '../config/default';
import css from './home.scss'

const SEARCH_TYPE={
    FLIGHTS:'FLIGHTS',
    HOTELS:'HOTELS'
}
const SEARCH_STATE={
    NOT_STARTED:'NOT_STARTED',
    IN_PROGRESS:'IN_PROGRESS',
    FAILED:'FAILED',
    FINISHED:'FINISHED'
}

export default function HomePage() {
    const [searchType, setSearchType] = useState([SEARCH_TYPE.FLIGHTS]);
    const [searchCriteria, setSearchCriteria] = useState();
    const [searchState, setSearchState] = useState(SEARCH_STATE.NOT_STARTED);
    const [searchResults, setSearchResults] = useState();

    const onFlightsSearch = (criteria) =>{onSearchStart();setSearchCriteria(criteria);search(criteria,SEARCH_TYPE.FLIGHTS, onSearchSuccess,onSearchFailure)};
    const onHotelsSearch = (criteria) =>{onSearchStart();setSearchCriteria(criteria);search(criteria,SEARCH_TYPE.HOTELS, onSearchSuccess,onSearchFailure)};
    const onSearchSuccess = (results) =>{setSearchResults(results);setSearchState(SEARCH_STATE.FINISHED);}
    const onSearchFailure = () =>{setSearchResults(undefined);setSearchState(SEARCH_STATE.FAILED);}
    const onSearchStart = () =>{setSearchState(SEARCH_STATE.IN_PROGRESS);}
    return (
        <>
            <Header/>
            <ContentWrapper>
                <h1 className="page-title">Book Travel with Winding Tree</h1>
                <FlightOrHotel defaultValue={searchType} onToggle={setSearchType}/>
                {searchType === SEARCH_TYPE.FLIGHTS && <FlightsSearchForm onFlightsSearch={onFlightsSearch}/>}
                {searchType === SEARCH_TYPE.HOTELS && <HotelsSearchForm onHotelsSearch={onHotelsSearch}/>}
                {searchState === SEARCH_STATE.IN_PROGRESS && <SearchInProgress />}
                {searchState === SEARCH_STATE.FAILED && <SearchFailed />}
                {searchState === SEARCH_STATE.FINISHED && <SearchResults searchResults={searchResults} searchType={searchType}/>}
            </ContentWrapper>
            <Footer/>
        </>    )
}

function buildFlightsSearchCriteria(origin,destination,departureDate,returnDate, adults,children,infants) {
    const criteriaBuilder = new SearchCriteriaBuilder();
    // TODO - handle search from city/railstation and different pax types
    const searchCriteria = criteriaBuilder
        .withTransportDepartureFromLocation(origin)
        .withTransportDepartureDate(departureDate)
        .withTransportReturnFromLocation(destination)
        .withTransportReturnDate(returnDate)
        .withPassengers(adults,children,infants)
        .build();
    return searchCriteria;
}

function buildHotelsSearchCriteria(latitude,longitude,arrivalDate,returnDate, adults,children,infants) {
    const criteriaBuilder = new SearchCriteriaBuilder();
    let boundingBoxForSelectedLocation = criteriaBuilder.boundingBox(latitude,longitude,config.LOCATION_BOUNDING_BOX_IN_KM)
    const searchCriteria = criteriaBuilder
        .withAccommodationLocation(boundingBoxForSelectedLocation,'rectangle')
        .withAccommodationArrivalDate(arrivalDate)
        .withAccommodationReturnDate(returnDate)
        .withPassengers(adults,children,infants)
        .build();
    return searchCriteria;
}

const search = (criteria, mode, onSearchSuccessCallback,onSearchFailureCallback) => {
    let searchRequest;
    if (mode === SEARCH_TYPE.FLIGHTS)
        searchRequest = buildFlightsSearchCriteria(criteria.origin.iata, criteria.destination.iata, criteria.departureDate, criteria.returnDate, criteria.adults, criteria.children, criteria.infants);
    else if (mode === SEARCH_TYPE.HOTELS)
        searchRequest = buildHotelsSearchCriteria(criteria.destination.latitude, criteria.destination.longitude, criteria.departureDate, criteria.returnDate, criteria.adults, criteria.children, criteria.infants);
    else
        throw Error('Unknown search mode');
    console.debug('Raw search criteria:',criteria,' API search criteria', searchRequest)

    const requestInfo = {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json'
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
        body: JSON.stringify(searchRequest)
    };
    fetch(config.SEARCH_OFFERS_URL, requestInfo)
        .then(function (res) {
            return res.json()
        })
        .then(function (data) {
            console.debug('Search results arrived')
            let searchResultsTransformed=extendResponse(data);
            onSearchSuccessCallback(searchResultsTransformed);
        }).catch(function (err) {
            console.error('Search failed', err)
            onSearchFailureCallback();
    })
}


const FlightOrHotel = ({defaultValue = SEARCH_TYPE.FLIGHTS, onToggle}) => {
    const [value, setValue] = useState([defaultValue]);
    const handleChange = val => {setValue(val);onToggle(val);}
    return (
        <Container>
            <Row className="searchmode-selector">
                <ToggleButtonGroup  type="radio" name="test" value={value}
                                   onChange={handleChange}>
                    <ToggleButton className="searchmode-selector__button" variant="outline-dark"
                                  value={SEARCH_TYPE.FLIGHTS}>Flights</ToggleButton>
                    <ToggleButton className="searchmode-selector__button" variant="outline-dark"
                                  value={SEARCH_TYPE.HOTELS}>Hotels</ToggleButton>
                </ToggleButtonGroup>
            </Row>
        </Container>)
}

const FlightsSearchForm = ({onFlightsSearch}) =>{
    return (
        <SearchForm
            onSearchRequested={onFlightsSearch}
            enableOrigin = {true}
            locationsSource={LOCATION_SOURCE.AIRPORTS}
            oneWayAllowed={true}/>
    )
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




const SearchResults = ({searchResults, searchType})=>{
    return (
        <>
            <div>Search results</div>
            {searchType === SEARCH_TYPE.FLIGHTS && <FlightsPage searchResults={searchResults}/> }
            {searchType === SEARCH_TYPE.HOTELS && <HotelsPage searchResults={searchResults} />}
        </>
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


