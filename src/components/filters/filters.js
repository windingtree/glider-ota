import React, {useState} from 'react';
import style from "./filters.module.scss"
import {Container, Row, Col, Button, Form, ButtonGroup, ToggleButton} from "react-bootstrap";
import InputRange from 'react-input-range';
import OfferUtils from '../../utils/offer-utils';
import "react-input-range/lib/css/index.css";

import _ from 'lodash'
import {SearchResultsWrapper} from "../../utils/flight-search-results-transformer";

const AIRLINES_FILTER_ID = 'airlines';
const MAXSTOPS_FILTER_ID = 'maxStops';
const PRICERANGE_FILTER_ID = 'priceRange';
const LAYOVERDURATION_FILTER_ID = 'layoverDuration';
const BAGS_FILTER_ID = 'bags';


export default function Filters({searchResults, onFilterApply, filtersStates, onFiltersStateChanged}) {

    console.log("Filter states:",filtersStates)


    function filterStateChanged(id, filterState) {
        let newfiltersState = Object.assign({}, filtersStates);
        newfiltersState[id] = filterState;
        let afterFilter = filterSearchResults(searchResults, newfiltersState);
        onFilterApply(afterFilter);
    }


    return (
        <>
            <div className="filters-container d-flex flex-column flex-fill">
                {/*{searchResults != undefined && <div className="glider-font-regular18-fg pb-4">Search results: {searchResults.length}</div>}*/}
                {filtersStates !== undefined && (<SelectionFilter id={MAXSTOPS_FILTER_ID} title='Stops' filterState={filtersStates[MAXSTOPS_FILTER_ID]} onFilterStateChange={filterStateChanged} />)}
                {filtersStates !== undefined && (<RangeFilter id={PRICERANGE_FILTER_ID} title='Price'  unit='EUR'  filterState={filtersStates[PRICERANGE_FILTER_ID]} onFilterStateChange={filterStateChanged} />)}
                {filtersStates !== undefined && (<RangeFilter id={LAYOVERDURATION_FILTER_ID} title='Layover duration'  unit='hr'  filterState={filtersStates[LAYOVERDURATION_FILTER_ID]} onFilterStateChange={filterStateChanged} />)}
                {filtersStates !== undefined && (<SelectionFilter id={BAGS_FILTER_ID} title='Baggage' filterState={filtersStates[BAGS_FILTER_ID]} onFilterStateChange={filterStateChanged} />)}
                {filtersStates !== undefined && (<SelectionFilter id={AIRLINES_FILTER_ID} title='Airlines' filterState={filtersStates[AIRLINES_FILTER_ID]} onFilterStateChange={filterStateChanged}/>)}
                {/*<RangeFilter min={1} max={maxPrice} unit='HR' title='MOW-HKT Flight duration'/>*/}
                {/*<RangeFilter min={1} max={24} unit='HR' title='HKT-MOW Flight duration'/>*/}
                {/*<RangeFilter id={PREDICATES.LAYOVERDURATION} min={1} max={24} unit='HR' title='Layover duration' predicate={filterStateChanged}/>*/}
{/*
                <div className='flex-fill'>
                    <Button variant='outline-primary' size='lg' onClick={onApplyButton}>Apply</Button>
                </div>
*/}
            </div>
        </>
    )
}

export function generateFiltersStates(searchResults) {
    const filtersState = {};
    filtersState[AIRLINES_FILTER_ID] = createAirlinesFilter(searchResults);
    filtersState[MAXSTOPS_FILTER_ID] = createMaxStopsFilter(searchResults);
    filtersState[PRICERANGE_FILTER_ID] = createMinMaxPriceRangeFilter(searchResults);
    filtersState[BAGS_FILTER_ID] = createBagsFilter(searchResults);
    filtersState[LAYOVERDURATION_FILTER_ID] = createLayoverDurationFilter(searchResults);
    // PREDICATES.LAYOVERDURATION:undefined,

    return filtersState;
}


function filterSearchResults(searchResults, filtersState) {
    console.log("Will apply filter:", filtersState)
   /* let searchResultsWrapper = new SearchResultsWrapper(searchResults);
    let offers = searchResults.offers;
    let combinations = searchResults.combinations;
    let itinerariesToRemove={}
    Object.keys(offers).forEach(offerId=>{
        let offer = searchResultsWrapper.getOffer(offerId);
        if (!priceMinMaxPredicate(offer, filtersState)) {
            delete offers[offerId];
        }

        let itineraries = searchResultsWrapper.getOfferItineraries(offerId);
        if (!airlinePredicate(itineraries, filtersState))
            delete offers[offerId];
    })*/

    /*_.each(searchResults.offers, (offer) => {
        let offersUnfiltered = combination.offers;
        combination.offers = [];
        _.each(offersUnfiltered, (offer) => {
            if (priceMinMaxPredicate(offer, filtersState) && maxStopsPredicate(offer, filtersState)) {
                combination.offers.push(offer);
            }
        });
        if (airlinePredicate(combination.itinerary, filtersState) && combination.offers.length > 0) {
            combinationsAfter.push(combination)
        }

    });*/
    // searchResults.combinations = combinationsAfter;
    return searchResults;
}


function priceMinMaxPredicate(offer, filtersState) {
    let priceRange = filtersState[PRICERANGE_FILTER_ID];
    if (priceRange === undefined)
        return true;
    let price = offer.price;
    if (price.public >= priceRange.min && price.public <= priceRange.max)
        return true;
    return false;
}

function airlinePredicate(itineraries, filtersState) {
    let airlines = filtersState[AIRLINES_FILTER_ID];
    if (airlines === undefined) {
        return true;
    }
    let result = true;
    _.each(itineraries, (itinerary) => {
        _.each(itinerary.segments, (segment) => {
            let segmentOperatingAirline = segment.operator.iataCode;
            if(!isAirlineSelected(segmentOperatingAirline,airlines))
                result=false;
        })
    })
    return result;
}

function isAirlineSelected(iataCode,airlinesFilterState){
    let airline = airlinesFilterState.find(item=>item.key === iataCode);
    if(airline===undefined)
        return true;
    return airline.selected;
}

function maxStopsPredicate(itineraries, filtersState) {
    let maxStops = filtersState[MAXSTOPS_FILTER_ID];
    if (maxStops === undefined)
        return true;

    let allAllowed = maxStops['all'];
    if (allAllowed)
        return true;

    let result = true;
    _.each(itineraries, (itinerary) => {
        _.each(itinerary.segments, (segment) => {
            let numOfStops = OfferUtils.calculateNumberOfStops(itinerary);
            if (numOfStops in maxStops) {
                if (!maxStops[numOfStops])
                    result = false;
            }
        })
    })
    return result;
}


export function RangeFilter({id, unit = '[eur]', title = '[missing]', onFilterStateChange, filterState}) {
    const [currentValue, setCurrentValue] = useState(filterState);

    function onChangeComplete(){
        let newFilterState = Object.assign({}, filterState);
        newFilterState.min=currentValue.min;
        newFilterState.max=currentValue.max;
        onFilterStateChange(id, newFilterState)
    }
    return (
        <div className={style.filter}>
            <div className={style.filterTitle}>{title}</div>
            <div className={style.filterContainer}>
                <InputRange
                    maxValue={filterState.highest}
                    minValue={filterState.lowest}
                    formatLabel={value => `${value} ${unit}`}
                    value={currentValue}
                    onChange={value => setCurrentValue(value)}
                    onChangeComplete={onChangeComplete}/>
            </div>
        </div>
    )
}


export function SelectionFilter({id, title = '[missing]', filterState, onFilterStateChange}) {
    const selectionState = {};

    function selectionChanged(itemId, checked) {
        let newState = [];

        filterState.map(item => {
            if (item.key === itemId)
                item.selected = checked;
            newState.push(item);
        })
        onFilterStateChange(id, newState);
    }

    return (
        <Form>
            <Form.Group id="formGridCheckbox">
                <div className={style.filter}>
                    <div className={style.filterTitle}>{title}</div>
                    <div className={style.filterContainer}>
                        {
                            _.map(filterState, (item) => {
                                return (<span key={item.key}>
                            <Form.Check id={item.key} className={style.filterCheckbox} defaultChecked={item.selected}
                                        label={item.display}
                                        onChange={(event) => selectionChanged(event.target.id, event.target.checked)}/>
                            </span>)
                            })
                        }
                    </div>
                </div>
            </Form.Group>
        </Form>
    )
}


function createAirlinesFilter(results) {
    if (results == undefined || results.itineraries == undefined)
        return [];
    let segments = results.itineraries.segments;
    let carriers = {};
    _.each(segments, (segment, key) => {
        let code = segment.operator.iataCode;
        carriers[code] = {
            key: code,
            display: code,
            selected: true
        };
    })
    let result = [];
    for (let carrier in carriers) {
        result.push(carriers[carrier]);
    }
    return result;

}

function createMinMaxPriceRangeFilter(results) {
    if (results == undefined || results.offers == undefined)
        return {lowest: 0, min: 0, max: 0, highest: 0};

    let offers = results.offers;
    let min = 99999999999999;
    let max = -1;
    _.each(offers, (offer, key) => {
        let price = parseInt(offer.price.public, 10);
        if (price > max)
            max = price;

        if (price < min)
            min = price;
    })
    return {lowest: 0, min: min, max: max, highest: max};

}


function createMaxStopsFilter(searchResults) {
    let items = [{key: 'all', display: 'All', selected: true}, {
        key: '0',
        display: 'Direct Flights Only',
        selected: true
    }];
    let maxStops = getMaxStops(searchResults);
    for (let i = 1; i < maxStops; i++) {
        items.push({key: i, display: `${i} Stop`, selected: true})
    }
    return items;
}


function getMaxStops(results) {
    if (results == undefined || results.itineraries == undefined)
        return [];
    let combinations = results.itineraries.combinations;
    let maxStops = 0;

    _.each(combinations, (combination, key) => {
        let stopCount = combination.length - 1;
        if (stopCount > maxStops)
            maxStops = stopCount;
    })
    return maxStops;
}



function createBagsFilter(searchResults) {
    let items = [{key: 'all', display: 'All', selected: true},
        {key: '0',display: 'Carry on bag',selected: true},
        {key: '1',display: 'Checked baggage',selected: true}
        ];
    return items;
}


function createLayoverDurationFilter(results) {
    if (results == undefined || results.combinations == undefined)
        return {lowest: 0, min: 0, max: 0, highest: 0};


    return {lowest: 0, min: 0, max: 12, highest: 12};

}


const VALUE_PRICE='price';
const VALUE_DURATION='duration';
export function FastCheapFilter({defaultValue = VALUE_PRICE, onToggle}){

    const [value, setValue] = useState(defaultValue);
    const onPriceClick = () => {setValue(VALUE_PRICE);onToggle(VALUE_PRICE);}
    const onDurationClick = ()  => {setValue(VALUE_DURATION);onToggle(VALUE_DURATION);}
    return (
        <Container className={style.fastCheapFilterToggle}>
            <Row className={style.fastCheapFilterContainer}>
                <Col xs={6} className="d-flex ">
                    <Button className={style.fastCheapFilterToggleBtn} variant={value==VALUE_PRICE?"primary":"outline-primary"} size="lg" onClick={onPriceClick}>Cheapest</Button>
                </Col>
                <Col xs={6} className="d-flex ">
                    <Button className={style.fastCheapFilterToggleBtn} variant={value==VALUE_DURATION?"primary":"outline-primary"} size="lg" onClick={onDurationClick}>Fastest</Button>
                </Col>
            </Row>
        </Container>)
}