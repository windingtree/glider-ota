import React, {useState} from 'react';
import Header  from '../components/common/header/header';
import Footer from '../components/common/footer/footer';
import {Container,Row,Col,ToggleButton, ToggleButtonGroup,Button} from 'react-bootstrap';
import {LOCATION_SOURCE} from '../components/search-form/location-lookup';
import {SearchForm} from '../components/search-form/search-form';
import MainPageContent from './main-page-content';
import {format} from "date-fns";

import css from './home.scss'
import {useHistory} from "react-router-dom";



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

function createFlightsURL(criteria){
    let origin=criteria.origin.iata;
    let destination=criteria.destination.iata;
    let adults=criteria.adults;
    let children=criteria.children;
    let infants=criteria.infants;
    let departureDate=dateToStr(criteria.departureDate);
    let returnDate=dateToStr(criteria.returnDate);
    const url = '/flights/'+origin+"/"+destination+"/"+departureDate+"/"+returnDate+"/"+adults+"/"+children+"/"+infants;
    console.log("Criteria==>URL, Criteria:",criteria,"URL:",url);
    return url;
}
function createHotelsURL(criteria){
    let origin=criteria.origin.iata;
    let destination=criteria.destination.iata;
    let adults=criteria.adults;
    let children=criteria.children;
    let infants=criteria.infants;
    let departureDate=dateToStr(criteria.departureDate);
    let returnDate=dateToStr(criteria.returnDate);
    const url = '/hotels/'+origin+"/"+destination+"/"+departureDate+"/"+returnDate+"/"+adults+"/"+children+"/"+infants;
    console.log("Criteria==>URL, Criteria:",criteria,"URL:",url);
    return url;
}

function dateToStr(date){
    return format(date,'yyyyMMdd');
}


export default function HomePage() {
    const [searchType, setSearchType] = useState(SEARCH_TYPE.FLIGHTS);
    const [searchCriteria, setSearchCriteria] = useState();
    const [searchState, setSearchState] = useState(SEARCH_STATE.NOT_STARTED);
    const [searchResults, setSearchResults] = useState();
    let history = useHistory();
    const onFlightsSearch = (criteria) =>{history.push(createFlightsURL(criteria));};
    const onHotelsSearch = (criteria) =>{history.push(createHotelsURL(criteria));};
    const onSearchSuccess = (results) =>{setSearchResults(results);setSearchState(SEARCH_STATE.FINISHED);}
    const onSearchFailure = () =>{setSearchResults(undefined);setSearchState(SEARCH_STATE.FAILED);}
    const onSearchStart = () =>{setSearchState(SEARCH_STATE.IN_PROGRESS);}
    return (
        <>
            <div className='main-page-header'>
                <Header type='white'/>
                <FlightOrHotel defaultValue={searchType} onToggle={setSearchType}/>
                {searchType === SEARCH_TYPE.FLIGHTS && <FlightsSearchForm onFlightsSearch={onFlightsSearch}/>}
                {searchType === SEARCH_TYPE.HOTELS && <HotelsSearchForm onHotelsSearch={onHotelsSearch}/>}
            </div>
            <MainPageContent/>
            <Footer/>
        </>)
}

// Toggle buttons on the top of the main page to select if you search hotels or flights
const FlightOrHotel = ({defaultValue = SEARCH_TYPE.FLIGHTS, onToggle}) => {
    const [value, setValue] = useState(defaultValue);
    const onFlightClick = () => {setValue(SEARCH_TYPE.FLIGHTS);onToggle(SEARCH_TYPE.FLIGHTS);}
    const onHotelClick = ()  => {setValue(SEARCH_TYPE.HOTELS);onToggle(SEARCH_TYPE.HOTELS);}
    return (
        <Container fluid={true} className='flight-or-hotel-toggle pb-3'>
            <Row >
                <Col xs={6} className="d-flex ">
                    <Button className="flight-or-hotel-toggle__btn flex-fill " variant={value==SEARCH_TYPE.FLIGHTS?"primary":"outline-primary"} size="lg" onClick={onFlightClick}>Flights</Button>
                </Col>
                <Col xs={6} className="d-flex ">
                    <Button className="flight-or-hotel-toggle__btn flex-fill" variant={value==SEARCH_TYPE.HOTELS?"primary":"outline-primary"} size="lg" onClick={onHotelClick}>Hotels</Button>
                </Col>
            </Row>
        </Container>)
}

const FlightsSearchForm = ({onFlightsSearch}) =>{
    return (
        <SearchForm
            onSearchButtonClick={onFlightsSearch}
            enableOrigin = {true}
            locationsSource={LOCATION_SOURCE.AIRPORTS}
            oneWayAllowed={true}/>
    )
}



const HotelsSearchForm = ({onHotelsSearch}) =>{
    return (
        <SearchForm
            onSearchButtonClick={onHotelsSearch}
            enableOrigin={false}
            locationsSource={LOCATION_SOURCE.CITIES}
            oneWayAllowed={false}/>
            )
}




