import React, {useState} from 'react';
import "./filters.scss"
import {Container, Row, Col, Button, Form} from "react-bootstrap";
import InputRange from 'react-input-range';
import OfferUtils from '../../utils/offer-utils';
import "react-input-range/lib/css/index.css";

import _ from 'lodash'

const AIRLINES_FILTER_ID = 'airlines';
const MAXSTOPS_FILTER_ID = 'maxStops';
const PRICERANGE_FILTER_ID = 'priceRange';
const LAYOVERDURATION_FILTER_ID = 'layoverDuration';


export default function Filters({searchResults, onFilterApply, filtersStates, onFiltersStateChanged}) {

    function filterStateChanged(id, filterState) {
        console.log("Update filter, id=", id, "state:",filterState)
        let newfiltersState = Object.assign({}, filtersStates);
        newfiltersState[id] = filterState;
        let afterFilter = filterSearchResults(searchResults, newfiltersState);
        onFilterApply(afterFilter);
    }

/*
    function onApplyButton() {
        console.log("onApplyButton, predicates:", filtersStates)

        console.log("Filtered results:",afterFilter)

    }

*/
    return (
        <>
            <div className="filters-container d-flex flex-column flex-fill">
                {/*{searchResults != undefined && <div className="glider-font-regular18-fg pb-4">Search results: {searchResults.length}</div>}*/}
                {filtersStates !== undefined && (<SelectionFilter id={AIRLINES_FILTER_ID} title='Airlines' filterState={filtersStates[AIRLINES_FILTER_ID]} onFilterStateChange={filterStateChanged}/>)}
                {filtersStates !== undefined && (<SelectionFilter id={MAXSTOPS_FILTER_ID} title='Stops' filterState={filtersStates[MAXSTOPS_FILTER_ID]} onFilterStateChange={filterStateChanged} />)}
                {filtersStates !== undefined && (<RangeFilter id={PRICERANGE_FILTER_ID} title='Price'  unit='EUR'  filterState={filtersStates[PRICERANGE_FILTER_ID]} onFilterStateChange={filterStateChanged} />)}
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
    // PREDICATES.LAYOVERDURATION:undefined,
    return filtersState;
}


function filterSearchResults(searchResults, filtersState) {
    console.log("Will apply filter:", filtersState)
    let combinationsAfter = [];
    _.each(searchResults.combinations, (combination) => {
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

    });
    // searchResults.combinations = combinationsAfter;
    return combinationsAfter;
}


function priceMinMaxPredicate(offer, filtersState) {
    let priceRange = filtersState[PRICERANGE_FILTER_ID];
    if (priceRange === undefined)
        return true;
    let price = offer.offer.price;
    // console.log("priceMinMaxPredicate, criteria:",priceRange," offer:", price)
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


function RangeFilter({id, unit = '[eur]', title = '[missing]', onFilterStateChange, filterState}) {
    const [currentValue, setCurrentValue] = useState(filterState);

    function onChangeComplete(){
        let newFilterState = Object.assign({}, filterState);
        newFilterState.min=currentValue.min;
        newFilterState.max=currentValue.max;
        console.log("On change complete, new state:",newFilterState, "current value:", currentValue)
        onFilterStateChange(id, newFilterState)
    }
    console.log("range filter - filter state:",filterState)
    console.log("range filter - currentValue:",currentValue)
    return (
        <div className='filter'>
            <div className='filter__title'>{title}</div>
            <div className='filter__content '>
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


function SelectionFilter({id, title = '[missing]', filterState, onFilterStateChange}) {
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
                <div className='filter'>
                    <div className='filter__title'>{title}</div>
                    <div className='filter__content '>
                        {
                            _.map(filterState, (item) => {
                                return (<span key={item.key}>
                            <Form.Check id={item.key} className='filter__checkbox' defaultChecked={item.selected}
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
            display: 'Airline:' + code,
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
