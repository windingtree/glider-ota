import React from 'react';
import {
    action
} from '@storybook/addon-actions';

import SearchModeSelector,{SelectorButton} from "./search-mode-selector";

export default {
    title: 'DC/form/mode_selector',
    component:SearchModeSelector
};

export const Default = () => (<SearchModeSelector onToggle={action("toggle")}/>);
export const SincleButton = () => (<SelectorButton text={'Hotels'}/>);
