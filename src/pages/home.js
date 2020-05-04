import React, {useState} from 'react';
import Header  from '../components/common/header/header';
import Footer from '../components/common/footer/footer';
import {Container,Row,Col,ToggleButton, ToggleButtonGroup,Button} from 'react-bootstrap';
import {LOCATION_SOURCE} from '../components/lookup/lookup-field';
import {SearchForm} from '../components/search-form/search-form';
import MainPageContent from './main-page-content';
import {format} from "date-fns";
import  {stringify}  from 'query-string';
import style from './home.module.scss'
import {useHistory} from "react-router-dom";


const SEARCH_TYPE={
    FLIGHTS:'FLIGHTS',
    HOTELS:'HOTELS'
}


function createURL(route,criteria){
    console.log("Criteria:",criteria)
    let departureDate=dateToStr(criteria.departureDate,'');
    let returnDate=dateToStr(criteria.returnDate,'');
    let params={
        origin:JSON.stringify(criteria.origin),
        destination:JSON.stringify(criteria.destination),
        adults:criteria.adults,
        children:criteria.children,
        infants:criteria.infants,
        departureDate:departureDate,
        returnDate:returnDate,
        action:'search'
    };
    return route+stringify(params);
}

function dateToStr(date,defaultValue){
    return date?format(date,'yyyyMMdd'):defaultValue;
}


export default function HomePage() {
    const [searchType, setSearchType] = useState(SEARCH_TYPE.FLIGHTS);
    let history = useHistory();
    const onFlightsSearch = (criteria) =>{history.push(createURL('/flights/?',criteria));};
    const onHotelsSearch = (criteria) =>{history.push(createURL('hotels/?',criteria));};
    return (
        <>
            <div className={style.mainPageBackground}>
                <Header violet={false}/>
                <Container fluid={true} className='flight-results-outer-boundary'>
                    <Row >
                        <Col>
                            <FlightOrHotel defaultValue={searchType} onToggle={setSearchType}/>
                        </Col>
                    </Row>
                    <Row className={style.searchFormWrapper}>
                        <Col>
                            {searchType === SEARCH_TYPE.FLIGHTS && <FlightsSearchForm onFlightsSearch={onFlightsSearch}/>}
                            {searchType === SEARCH_TYPE.HOTELS && <HotelsSearchForm onHotelsSearch={onHotelsSearch}/>}
                        </Col>
                    </Row>
                </Container>
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
        <Container fluid={true} className={style.flightOrHotelToggle}>
            <Row className={style.flightOrHotelToggleContainer}>
                <Col xs={6} className="d-flex ">
                    <Button className={style.flightOrHotelToggleBtn} variant={value==SEARCH_TYPE.FLIGHTS?"primary":"outline-primary"} size="lg" onClick={onFlightClick}>Flights</Button>
                </Col>
                <Col xs={6} className="d-flex ">
                    <Button className={style.flightOrHotelToggleBtn} variant={value==SEARCH_TYPE.HOTELS?"primary":"outline-primary"} size="lg" onClick={onHotelClick}>Hotels</Button>
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

