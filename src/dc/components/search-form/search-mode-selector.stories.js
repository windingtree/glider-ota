import React from 'react';
import {
    action
} from '@storybook/addon-actions';
import {useState} from "@storybook/addons";
import SearchModeSelector,{SEARCH_TYPE} from "./search-mode-selector";

export default {
    title: 'DC/Search Form/SearchModeSelector',
    component:SearchModeSelector
};

export const DefaultHotelsSelected = () => {
    const [active, setActive] = useState(SEARCH_TYPE.HOTELS);
    return (<SearchModeSelector onToggle={setActive} selectedMode={active}/>);
}
export const DefaultFlightsSelected = () => {
    const [active, setActive] = useState(SEARCH_TYPE.FLIGHTS);
    return (<SearchModeSelector onToggle={setActive} selectedMode={active}/>);
}
