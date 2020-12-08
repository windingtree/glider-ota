import React, {useState, useEffect} from 'react';
import Header from '../../components/common/header/header';
/*
import {
    searchForFlightsWithCriteria,
    FlightsSearchForm
} from '../components/search-form/flight-search-form';
*/

import FlightsSearchForm from '../components/search-form/flight-search-form'

import {parse, isValid} from "date-fns";
import Filters from "../../components/filters/filters";
import FlightsSearchResults from "../components/flightresults/flights-search-results";
import {useHistory} from "react-router-dom";
import Spinner from "../../components/common/spinner"
import {uiEvent} from "../../utils/events";
import {parseUrl} from 'query-string';
import {Col, Row} from "react-bootstrap";
import Footer from "../../components/common/footer/footer";
import Alert from 'react-bootstrap/Alert';
import SearchModeSelector from "../components/search-form/search-mode-selector";
/*import {
    errorSelector,
    flightFiltersSelector, isSearchFormValidSelector,
    isSearchInProgressSelector,
    searchCriteriaSelector, searchForFlightsAction,
    searchResultsSelector
} from "../../redux/sagas/flights";
import {connect} from "react-redux";*/

const SEARCH_STATE = {
    NOT_STARTED: 'NOT_STARTED',
    IN_PROGRESS: 'IN_PROGRESS',
    FAILED: 'FAILED',
    FINISHED: 'FINISHED'
}

export const searchAction = () => {
    return {
        type: 'FLIGHTS_SEARCH',
        criteria: {
            origin: 'AAA',
            destination: 'AAA'
        }
    }
}

export const applyFiltersAction = () => {
    return {
        type: 'APPLY_FLIGHTS_FILTER',
        filters: {
            name:'filter XYZ'
        }
    }
}

export const search  = (state, action)=>{
    console.log('redux:',action.type)
    switch (action.type) {
        case 'FLIGHTS_SEARCH':
            return [...state, {id: action.id, text: action.text, completed: false}]
        default:
            return state
    }
}


export default function FlightsSearchPage({match, location, results}) {
    let history = useHistory();
    const [searchState, setSearchState] = useState(SEARCH_STATE.NOT_STARTED);
    const [searchResults, setSearchResults] = useState(results);
    const [filters, setFilters] = useState({});

    const onSearchButtonClick = (criteria) => {
        onSearchStart();
        searchForFlightsWithCriteria(criteria)
            .then(results => {
                uiEvent("/flights, search completed");
                onSearchSuccess(results)
            })
            .catch(err => {
                uiEvent("/flights, search failed", err);
                onSearchFailure(err)
            })
    };
    const onSearchSuccess = (results) => {
        setFilters({});
        setSearchResults(results);
        setSearchState(SEARCH_STATE.FINISHED);
    }
    const onSearchFailure = (err) => {
        console.error("Search failed", err)
        setFilters({});
        setSearchResults(undefined);
        setSearchState(SEARCH_STATE.FAILED);
    }
    const onSearchStart = () => {
        setSearchState(SEARCH_STATE.IN_PROGRESS);
    }


    const onOfferSelected = (offerId) => {
       /* let url = createOfferURL(offerId);
        const passengers = Object.keys(searchResults.passengers).map(passengerId => {
            return {id: passengerId, ...searchResults.passengers[passengerId]};
        });
        history.push(url, {passengers: passengers});*/
    };

    let key = '';
    if (searchResults && searchResults.metadata && searchResults.metadata.uuid)
        key = searchResults.metadata.uuid;

    return (

        <div>
            <Row>
                <FlightsSearchForm/>
            </Row>
            <Row>
                <Col xs={0} sm={0} md={3} xl={0} className='d-none d-md-block'>
                    <Filters key={key} searchResults={searchResults} onFiltersChanged={setFilters}/>
                </Col>
                <Col xs={12} sm={9} md={6} xl={6}>
                    <FlightsSearchResults
                        onOfferDisplay={onOfferSelected}
                        searchResults={searchResults}
                        filters={filters}
                    />
                </Col>
                <Col xs={0} sm={3} md={3} xl={3}>
                    shopping cart
                </Col>
            </Row>

        </div>
    )
}

const WarningNoResults = () => {
    return (
        <Alert variant="warning" className={'pt-2'}>
            <Alert.Heading>
                Sorry, we could not find any flights
                <span role='img' aria-label='sorry'> 😢</span>
            </Alert.Heading>
            <p>
                There may be no flights available for the requested origin, destination and travel dates.<br/>
            </p>
            <p className="mb-0">
                We are working hard to integrate with other partners, and more options will quickly become available,
                stay tuned!
            </p>
        </Alert>
    );
};



function searchForFlightsWithCriteria() {

}



/*

const mapStateToProps = state => ({
    filters: flightFiltersSelector(state),
    searchCriteria: searchCriteriaSelector(state),
    searchInProgress: isSearchInProgressSelector(state),
    searchResults: searchResultsSelector(state),
    isSearchFormValid: isSearchFormValidSelector(state),
    error:errorSelector(state)
});

const mapDispatchToProps = (dispatch) => {
    return {
        onSearchClicked: () => {
            dispatch(searchForFlightsAction())
        },
        onOfferDisplay: () => {
            dispatch(searchForFlightsAction())
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(FlightsSearchPage);
*/
