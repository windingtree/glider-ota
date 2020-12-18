import React from 'react';
import {ExpandCollapseToggle,ExpandCollapseToggleV2} from "./expand-collapse-toggle"
import style from "./expand-collapse-toggle.module.scss"
export default {
    title: 'common blocks/ExpandCollapseToggle',
    component: ExpandCollapseToggle
};



export const Expanded = () => (<ExpandCollapseToggle expanded={true}/> )
export const Collapsed = () => (<ExpandCollapseToggle expanded={false}/> )
export const WithAdditionalText = () => (<ExpandCollapseToggle expanded={false} text={'Some example text'}/> )
export const WithCustomClass = () => (<ExpandCollapseToggle expanded={false} text={'Some example text'} className={style.bigred}/> )

export const Ver2 = () => (<ExpandCollapseToggleV2 expandedText={'Expand'} collapsedText={'Collapse'} expander={'^'} collapsor={'-'} expanded={true}/> )
export const Ver2a = () => (<ExpandCollapseToggleV2 expandedText={'Expand'} collapsedText={'Collapse'} expander={'^'} collapsor={'-'} expanded={false}/> )

export const Ver2ab = () => (<ExpandCollapseToggleV2 expandedText={'Expand'} collapsedText={'Collapse'} expander={'^'} collapsor={'-'} expanded={false} customClassName={style.bigred}/> )
