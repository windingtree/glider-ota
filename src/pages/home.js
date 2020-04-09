import React, {useState} from 'react';
import Header from '../components/common/header/header';
import Footer from '../components/common/footer/footer';
import ContentWrapper from '../components/common/content-wrapper';
import {Container,Row,Col,ToggleButton, ToggleButtonGroup,Button} from 'react-bootstrap';
import {LOCATION_SOURCE} from '../components/location-lookup/location-lookup';
import SearchForm from '../components/search-form/search-form';
import SearchCriteriaBuilder from '../utils/search-criteria-builder';
import {extendResponse} from '../utils/flight-search-results-transformer'
import FlightsPage from './flights';
import HotelsPage from './hotels';
import MainPageContent from './main-page-content';
import {config} from '../config/default';
import {findFlights, findHotels} from '../utils/search';

import css from './home.scss'
import logo from "../assets/glider-logo.png";





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
    const [searchType, setSearchType] = useState(SEARCH_TYPE.FLIGHTS);
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
            {searchState === SEARCH_STATE.NOT_STARTED &&
                <>
                    <div className='main-page-header'>
                        <Header/>
                        <FlightOrHotel defaultValue={searchType} onToggle={setSearchType}/>
                        {searchType === SEARCH_TYPE.FLIGHTS && <FlightsSearchForm onFlightsSearch={onFlightsSearch}/>}
                        {searchType === SEARCH_TYPE.HOTELS && <HotelsSearchForm onHotelsSearch={onHotelsSearch}/>}
                    </div>
                    <MainPageContent/>
                    <Footer/>
                </>
            }
            {searchState !== SEARCH_STATE.NOT_STARTED &&
            <div>
                <Header/>
                <FlightOrHotel defaultValue={searchType} onToggle={setSearchType}/>
                {searchType === SEARCH_TYPE.FLIGHTS && <FlightsSearchForm onFlightsSearch={onFlightsSearch}/>}
                {searchType === SEARCH_TYPE.HOTELS && <HotelsSearchForm onHotelsSearch={onHotelsSearch}/>}
                {searchState === SEARCH_STATE.IN_PROGRESS && <SearchInProgress/>}
                {searchState === SEARCH_STATE.FAILED && <SearchFailed/>}
                {searchState === SEARCH_STATE.FINISHED &&
                <SearchResults searchResults={searchResults} searchType={searchType}/>}
            </div>
            }
        </>    )
}


const OtaTest = ({text="default"}) => {
    return (
        <div className='ota-test'>{text}</div>
    )
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

    if(!config.OFFLINE_MODE) { //no need to fill search criteria in OFFLINE_MODE
        if (mode === SEARCH_TYPE.FLIGHTS)
            searchRequest = buildFlightsSearchCriteria(criteria.origin.iata, criteria.destination.iata, criteria.departureDate, criteria.returnDate, criteria.adults, criteria.children, criteria.infants);
        else if (mode === SEARCH_TYPE.HOTELS)
            searchRequest = buildHotelsSearchCriteria(criteria.destination.latitude, criteria.destination.longitude, criteria.departureDate, criteria.returnDate, criteria.adults, criteria.children, criteria.infants);
        else
            throw Error('Unknown search mode');
    }

    console.debug('Raw search criteria:',criteria,' API search criteria', searchRequest)
    let findPromise;
    if(mode === SEARCH_TYPE.FLIGHTS)
        findPromise=findFlights(searchRequest);
    else if (mode === SEARCH_TYPE.HOTELS)
        findPromise=findHotels(searchRequest);

    findPromise.then(results=>{
        onSearchSuccessCallback(results);
    }).catch(function (err) {
        console.error('Search failed', err)
        onSearchFailureCallback();
    });
};

// Toggle buttons on the top of the main page to select if you search hotels or flights
const FlightOrHotel = ({defaultValue = SEARCH_TYPE.FLIGHTS, onToggle}) => {
    const [value, setValue] = useState(defaultValue);
    const onFlightClick = () => {setValue(SEARCH_TYPE.FLIGHTS);onToggle(SEARCH_TYPE.FLIGHTS);}
    const onHotelClick = ()  => {setValue(SEARCH_TYPE.HOTELS);onToggle(SEARCH_TYPE.HOTELS);}
    return (
        <Container fluid={true} className='d-flex justify-content-center pb-5'>
            <Row className="flight-or-hotel-toggle d-flex flex-row">
                <Button className="flight-or-hotel-toggle__btn flex-fill " variant={value==SEARCH_TYPE.FLIGHTS?"primary":"outline-primary"} size="lg" onClick={onFlightClick}>Flights</Button>
                <Button className="flight-or-hotel-toggle__btn flex-fill" variant={value==SEARCH_TYPE.HOTELS?"primary":"outline-primary"} size="lg" onClick={onHotelClick}>Hotels</Button>
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
            {/*<div>Search results</div>*/}
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


