import React from 'react';
import {ExpandCollapseToggle} from "./expand-collapse-toggle"

export default {
    title: 'DC/common blocks/ExpandCollapseToggle',
    component: ExpandCollapseToggle
};

export const Expanded = () => (<ExpandCollapseToggle expanded={true}/> )
export const Collapsed = () => (<ExpandCollapseToggle expanded={false}/> )
