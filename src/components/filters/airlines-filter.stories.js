import React from 'react';
import {
    action
} from '@storybook/addon-actions';

import searchResults from "../storybook-utils/mock-data/sample_response_unprocessed2.json"
import searchResults2 from "../storybook-utils/mock-data/sample_flights.json"

import {AirlinesFilter} from "./airlines-filter";
import {Button} from "react-bootstrap";
import {useState} from "@storybook/addons";

export default {
    title: 'Filters/Airlines filter',
    component:AirlinesFilter
};
const results = [searchResults,searchResults2]


export const Default = () => (<div>
        <AirlinesFilter key={123} onPredicateChanged={action("onPredicateChanged")} title='Airlines'
                        searchResults={results[0]}/>
        {/*<Button onClick={onClick}>Click</Button>*/}
    </div>
);

export const Update = () => {
    const [flights, setFlights] = useState(searchResults);
    const onBtnClick=(idx)=>{
        setFlights(results[idx]);
    }
    return(<div>
        <AirlinesFilter  onPredicateChanged={action("onPredicateChanged")} title='Airlines'
                        searchResults={flights}/>
        <Button onClick={()=>onBtnClick(0)}>Load result#1</Button>
        <Button onClick={()=>onBtnClick(1)}>Load result#2</Button>
    </div>
)};
