import React from 'react';
import {
    action
} from '@storybook/addon-actions';

import searchResults from "../../dc/data/sample_response_unprocessed2.json"
import searchResults2 from "../../dc/data/sample_flights.json"

import Filters from "./filters"
import {Button} from "react-bootstrap";
import {useState} from "@storybook/addons";

export default {
    title: 'Filters/Flights filters',
    component:Filters
};

const results = [searchResults,searchResults2]


export const Default = () => (<Filters searchResults={searchResults} onFiltersChanged={action("onFiltersChanged")} />);

export const UpdateOfSearchResults = () => {
    const [flights, setFlights] = useState(searchResults);
    const onNewSearch=(idx)=>{
        setFlights(results[idx]);
    }

    return(
        <div>
            <Button onClick={()=>onNewSearch(0)}>results#0</Button>
            <Button onClick={()=>onNewSearch(1)}>results#1</Button>
            <Filters searchResults={flights}
                     key={flights.metadata.uuid}
                     onFiltersChanged={action("onFiltersChanged")}
                     />
        </div>
    );
}
