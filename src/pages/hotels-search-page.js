import React, {useState,useEffect} from 'react';
import Header from '../components/common/header/header';
import {SearchForm, searchForHotels} from '../components/search-form/search-form';
import {LOCATION_SOURCE} from '../components/lookup/lookup-field';
import {parse,isValid} from "date-fns";
import {Container,  Row, Col} from "react-bootstrap";
import Alert from 'react-bootstrap/Alert';
import Filters,{generateFiltersStates} from "../components/filters/filters";
import {useHistory} from "react-router-dom";
import Spinner from "../components/common/spinner"
import {uiEvent} from "../utils/events";
import {parseUrl}  from 'query-string';
import HotelsSearchResults from "../components/hotelresults/hotels-search-results";

const SEARCH_STATE={
    NOT_STARTED:'NOT_STARTED',
    IN_PROGRESS:'IN_PROGRESS',
    FAILED:'FAILED',
    FINISHED:'FINISHED'
}

export default function HotelsSearchPage({match,location}) {
    let history = useHistory();
    const [searchState, setSearchState] = useState(SEARCH_STATE.NOT_STARTED);
    const [searchResults, setSearchResults] = useState();
    const [filtersStates, setFiltersStates] = useState();
    const [unfilteredSearchResults, setUnfilteredSearchResults] = useState();

    const onSearchButtonClick = (criteria) => {
        onSearchStart();
        searchForHotels(criteria)
            .then(results=>{
                uiEvent("/hotelresults, search completed");
                onSearchSuccess(results)})
            .catch(err=>{
                uiEvent("/hotelresults, search failed", err);
                onSearchFailure(err)})
    };
    const onSearchSuccess = (results) => {
        setSearchResults(results);
        setUnfilteredSearchResults(results);
        let filters=generateFiltersStates(results);
        setFiltersStates(filters);
        setSearchState(SEARCH_STATE.FINISHED);
    }
    const onSearchFailure = (err) => {
        setSearchResults(undefined);
        setSearchState(SEARCH_STATE.FAILED);
    }
    const onSearchStart = () => {
        setSearchState(SEARCH_STATE.IN_PROGRESS);
    }
    const onResultsFiltered = (combinations) => {
        setSearchResults(combinations);
    }

    const initialParameters = parseDeeplinkParams(location);
    const deeplinkAction = initialParameters.action;


    useEffect(()=>{
        if(deeplinkAction === 'search'){
            console.log("Deeplink search",initialParameters)
            onSearchButtonClick(initialParameters);
        }
    },[]);

    const onHotelSelected = (hotel) => {
        let url = createOfferURL(hotel.accommodationId);
        history.push(url);
    };

    return (
        <div>
            <div>
                <Header type='violet'/>
                {/*<div className='d-flex flex-column container-fluid justify-content-center'>*/}
                <Container fluid={true} className='flight-results-outer-boundary'>
                    <Row>
                        <Col xs={0} lg={2} className="filters-wrapper">
                            <Filters searchResults={unfilteredSearchResults} filtersStates={filtersStates} onFiltersStateChanged={setFiltersStates} onFilterApply={onResultsFiltered}/>
                        </Col>
                        <Col >
                            <SearchForm
                                onSearchButtonClick={onSearchButtonClick}
                                enableOrigin={false}
                                locationsSource={LOCATION_SOURCE.CITIES}
                                oneWayAllowed={false}
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
                            <HotelsSearchResults onHotelSelected={onHotelSelected} searchResults={searchResults}/>}
                        </Col>
                    </Row>
                </Container>
            </div>
        </div>
    )
}


// Display warning message
const WarningNoResults = () => {
    return (
       <Alert variant="warning">
       <Alert.Heading>
           Sorry, we could not find any available hotels
           <span role='img' aria-label='sorry'> 😢</span>
       </Alert.Heading>
       <p>
           Glider has been launched with our amazing partner <b><a href='https://www.nordicchoicehotels.com/'>Nordic Choice Hotels</a></b>, 
           so for now we have only results in the Nordics <span role='img' aria-label='flags'>🇸🇪🇳🇴🇫🇮</span>! 
           Why not going there?
       </p>
       <hr />
       <p className="mb-0">
           We are working with other partners, and more options will quickly
           become available, stay tuned! <span role='img' aria-label='wink'>😉</span>
       </p>
       </Alert>
    );
};

function createOfferURL(accommodationId){
    const url = "/hotel/"+accommodationId;
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
