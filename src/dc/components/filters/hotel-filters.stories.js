import React from 'react';
import {
    action
} from '@storybook/addon-actions';

import searchResults from "../../data/sample_response_hotels_simulator.json"

import {Button} from "react-bootstrap";
import {useState} from "@storybook/addons";
import HotelFilters from "./hotel-filters";

export default {
    title: 'Filters/Hotel filters',
    component:HotelFilters
};
console.log("Search results:",searchResults)
export const Default = () => (<HotelFilters searchResults={searchResults} onFiltersChanged={action("onFiltersChanged")} />);

export const UpdateOfSearchResults = () => {
    const [hotels, setHotels] = useState([]);
    const onNewSearch=()=>{
        setHotels(searchResults);
    }
    let key='';
    if(hotels && hotels.metadata)
        key=hotels.metadata.uuid;
    return(
        <div>
            <Button onClick={()=>onNewSearch()}>Update results</Button>
            <HotelFilters key={key} searchResults={hotels} onFiltersChanged={action("onFiltersChanged")}/>
        </div>
    );
}
