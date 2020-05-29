import React, {useState} from 'react';
import style from "./filters.module.scss"
import {Container, Row, Col, Button, Form} from "react-bootstrap";
import InputRange from 'react-input-range';
import "react-input-range/lib/css/index.css";

import _ from 'lodash'

const AIRLINES_FILTER_ID = 'airlines';
const MAXSTOPS_FILTER_ID = 'maxStops';
const PRICERANGE_FILTER_ID = 'priceRange';
const LAYOVERDURATION_FILTER_ID = 'layoverDuration';
const BAGS_FILTER_ID = 'bags';


export default function Filters({searchResults, onFilterApply, filtersStates}) {

    function filterStateChanged(id, filterState) {
        let newfiltersState = Object.assign({}, filtersStates);
        newfiltersState[id] = filterState;
        onFilterApply(newfiltersState);
    }


    return (
        <>
            <div className="filters-container d-flex flex-column flex-fill">
                {/*{searchResults != undefined && <div className="glider-font-regular18-fg pb-4">Search results: {searchResults.length}</div>}*/}
                {filtersStates !== undefined && (<SelectionFilter id={MAXSTOPS_FILTER_ID} title='Stops'
                                                                  filterState={filtersStates[MAXSTOPS_FILTER_ID]}
                                                                  onFilterStateChange={filterStateChanged}/>)}
                {filtersStates !== undefined && (<RangeFilter id={PRICERANGE_FILTER_ID} title='Price' unit='EUR'
                                                              filterState={filtersStates[PRICERANGE_FILTER_ID]}
                                                              onFilterStateChange={filterStateChanged}/>)}
                {filtersStates !== undefined && (
                    <RangeFilter id={LAYOVERDURATION_FILTER_ID} title='Layover duration' unit='hr'
                                 filterState={filtersStates[LAYOVERDURATION_FILTER_ID]}
                                 onFilterStateChange={filterStateChanged}/>)}
                {filtersStates !== undefined && (
                    <SelectionFilter id={BAGS_FILTER_ID} title='Baggage' filterState={filtersStates[BAGS_FILTER_ID]}
                                     onFilterStateChange={filterStateChanged}/>)}
                {filtersStates !== undefined && (<SelectionFilter id={AIRLINES_FILTER_ID} title='Airlines'
                                                                  filterState={filtersStates[AIRLINES_FILTER_ID]}
                                                                  onFilterStateChange={filterStateChanged}/>)}
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

export function RangeFilter({id, unit = '[eur]', title = '[missing]', onFilterStateChange, filterState}) {
    const [currentValue, setCurrentValue] = useState(filterState);

    function onChangeComplete() {
        let newFilterState = Object.assign({}, filterState);
        newFilterState.min = currentValue.min;
        newFilterState.max = currentValue.max;
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
    if (results === undefined || results.itineraries === undefined)
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
    if (results === undefined || results.offers === undefined)
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
    if (results === undefined || results.itineraries === undefined)
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
        {key: '0', display: 'Carry on bag', selected: true},
        {key: '1', display: 'Checked baggage', selected: true}
    ];
    return items;
}


function createLayoverDurationFilter(results) {
    if (results === undefined || results.combinations === undefined)
        return {lowest: 0, min: 0, max: 0, highest: 0};
    return {lowest: 0, min: 0, max: 12, highest: 12};
}


const VALUE_PRICE = 'PRICE';
const VALUE_DURATION = 'DURATION';

export function FastCheapFilter({defaultValue = VALUE_PRICE, onToggle}) {

    const [value, setValue] = useState(defaultValue);
    const onPriceClick = () => {
        setValue(VALUE_PRICE);
        onToggle(VALUE_PRICE);
    }
    const onDurationClick = () => {
        setValue(VALUE_DURATION);
        onToggle(VALUE_DURATION);
    }
    return (
        <Container className={style.fastCheapFilterToggle}>
            <Row className={style.fastCheapFilterContainer}>
                <Col xs={6} className="d-flex ">
                    <Button className={style.fastCheapFilterToggleBtn}
                            variant={value == VALUE_PRICE ? "primary" : "outline-primary"} size="lg"
                            onClick={onPriceClick}>Cheapest</Button>
                </Col>
                <Col xs={6} className="d-flex ">
                    <Button className={style.fastCheapFilterToggleBtn}
                            variant={value == VALUE_DURATION ? "primary" : "outline-primary"} size="lg"
                            onClick={onDurationClick}>Fastest</Button>
                </Col>
            </Row>
        </Container>)
}