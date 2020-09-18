import React from 'react';
import {
    action
} from '@storybook/addon-actions';

import {RadiobuttonFilter} from "./radiobutton-filter"

export default {
    title: 'Filters/Base radiobutton filter',
};
const filterElements=[
    {key: "allitems", display: "ALL", selected: true},
    {key: "Item1", display: "Item 1 title", selected: false},
    {key: "Item2", display: "Item 2 title", selected: false},
    {key: "Item3", display: "Item 3 title", selected: false},
    {key: "Item4", display: "Item 4 title", selected: false},
]


export const FirstItemNotMutuallyExclusiveWithOthers = () => (<RadiobuttonFilter  filterItems={filterElements} title='Items'  firstItemMutuallyExclusive={false} onFilterStateChanged={action("onFilterStateChanged")} />);
export const FirstItemMutuallyExclusiveWithOthers = () => (<RadiobuttonFilter  filterItems={filterElements} title='Items'  firstItemMutuallyExclusive={true}  onFilterStateChanged={action("onFilterStateChanged")} />);
