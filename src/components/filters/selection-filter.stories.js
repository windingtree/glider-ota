import React from 'react';
import {
    action
} from '@storybook/addon-actions';

import {SelectionFilter} from "./selection-filter"

export default {
    title: 'Filters/Base selection filter',
};
const filterElements=[
    {key: "allitems", display: "ALL", selected: true},
    {key: "Item1", display: "Item 1 title", selected: true},
    {key: "Item2", display: "Item 2 title", selected: true},
    {key: "Item3", display: "Item 3 title", selected: true},
    {key: "Item4", display: "Item 4 title", selected: true},
]


export const FirstItemNotMutuallyExclusiveWithOthers = () => (<SelectionFilter  filterItems={filterElements} title='Items'  firstItemMutuallyExclusive={false} onFilterStateChanged={action("onFilterStateChanged")} />);
export const FirstItemMutuallyExclusiveWithOthers = () => (<SelectionFilter  filterItems={filterElements} title='Items'  firstItemMutuallyExclusive={true}  onFilterStateChanged={action("onFilterStateChanged")} />);
