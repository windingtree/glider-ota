import React from 'react';
import {
    action
} from '@storybook/addon-actions';

import searchResults from "../../data/sample_response_unprocessed2.json"
import {AirlinesFilter} from "./airlines-filter";

export default {
    title: 'Filters/Airlines filter',
    component:AirlinesFilter
};


export const Default = () => (<AirlinesFilter key={123}  onFilterStateChange={action("onFilterStateChange")} title='Airlines' searchResults={searchResults}/>);
