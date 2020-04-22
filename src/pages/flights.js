import React, {useState,useEffect} from 'react';
import Header from '../components/common/header/header';
import {SearchForm,buildFlightsSearchCriteria,searchForFlightsWithCriteria} from '../components/search-form/search-form';
import {LOCATION_SOURCE} from '../components/search-form/location-lookup';
import {parse} from "date-fns";
import {Button, Container,  Row, Col} from "react-bootstrap";
import Filters,{generateFiltersStates} from "../components/filters/filters";
import FlightsSearchResults from "../components/flights-search-results/flights-search-results";
import {useHistory} from "react-router-dom";
import cssdefs from './flights.scss'
import Spinner from "../components/common/spinner"

const SEARCH_STATE={
    NOT_STARTED:'NOT_STARTED',
    IN_PROGRESS:'IN_PROGRESS',
    FAILED:'FAILED',
    FINISHED:'FINISHED'
}


function createOfferURL(offerId,combinationId){
    const url = "/flightoffer/"+combinationId+"/"+offerId;
    return url;
}



export default function FlightsPage({match}) {
    let history = useHistory();
    const [searchFormCriteria, setSearchFormCriteria] = useState();
    const [searchState, setSearchState] = useState(SEARCH_STATE.NOT_STARTED);
    const [searchResults, setSearchResults] = useState();
    const [filtersStates, setFiltersStates] = useState();
    const [unfilteredSearchResults, setUnfilteredSearchResults] = useState();

    const onFlightsSearch = (criteria) => {
        console.log("onFlightsSearch")
        onSearchStart();
        searchForFlightsWithCriteria(criteria)
            .then(results=>{onSearchSuccess(results)})
            .catch(err=>{onSearchFailure()})
    };
    const onSearchSuccess = (results) => {
        setSearchResults(results.combinations);
        setUnfilteredSearchResults(results);
        let filters=generateFiltersStates(results);
        setFiltersStates(filters);
        setSearchState(SEARCH_STATE.FINISHED);
    }
    const onSearchFailure = () => {
        setSearchResults(undefined);
        setSearchState(SEARCH_STATE.FAILED);
    }
    const onSearchStart = () => {
        setSearchState(SEARCH_STATE.IN_PROGRESS);
    }
    const onResultsFiltered = (combinations) => {
        setSearchResults(combinations);
    }

    //retrieve parameters from URL(if provided - values should be used as defaults in search form and also search should be performed)
    let adults = parseInt(match.params.adults)||1;
    let children = parseInt(match.params.children)||0;
    let infants = parseInt(match.params.infants)||0;
    let origin = match.params.orig;
    let destination = match.params.dest;
    let departureDate = parse(match.params.departureDate,'yyyyMMdd',new Date());
    let returnDate = parse(match.params.returnDate,'yyyyMMdd',new Date());
    // useEffect(()=>{initialSearch(match,onSearchSuccess,onSearchFailure)});



    const onOfferSelected = (combinationId,offerId) => {
        let url = createOfferURL(offerId,combinationId);
        history.push(url);
    };

    console.log("Render search results",searchResults)
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
                                onSearchButtonClick={onFlightsSearch}
                                enableOrigin={true}
                                locationsSource={LOCATION_SOURCE.AIRPORTS}
                                oneWayAllowed={true} initAdults={adults} initChildren={children} initInfants={infants}
                                initiDest={destination} initOrigin={origin} initDepartureDate={departureDate} initReturnDate={returnDate}
                            />
                            <Spinner enabled={searchState === SEARCH_STATE.IN_PROGRESS}/>
                            {searchState === SEARCH_STATE.FAILED && <SearchFailed/>}
                            {searchResults != undefined &&
                            <FlightsSearchResults onOfferDisplay={onOfferSelected}
                                                  searchResults={searchResults}/>
                            }
                        </Col>
                    </Row>
                </Container>
            </div>
        </div>
    )
}



const SearchFailed = ()=>{
    return (
        <div>Search failed</div>
    )
}


