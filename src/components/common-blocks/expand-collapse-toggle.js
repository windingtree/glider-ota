import React from 'react';
import style from "./expand-collapse-toggle.module.scss"
import {FaChevronDown, FaChevronUp} from "react-icons/fa";
import classNames from "classnames/bind";

let cx = classNames.bind(style);


export const ExpandCollapseToggle = ({text, expanded = false, onToggle, className}) => {
    const toggle = (e) => {
        e.preventDefault();
        if(onToggle)
            onToggle(!expanded);
    }
    let c={
        toggle:true
    }
    c[className]=true
    let classNames=cx(c)
    return (
        <button className={classNames} onClick={toggle}>{text}{expanded?<FaChevronUp/>:<FaChevronDown/>}</button>
    );
}


export const ExpandCollapseToggleV2 = ({customClassName, expandedText, collapsedText, expanded = false, onToggle, expandedSymbol, collapsedSymbol}) => {
    const toggle = (e) => {
        e.preventDefault();
        if(onToggle)
            onToggle(!expanded);
    }

    let classes={
        toggle:(customClassName===undefined),
        [customClassName]:(customClassName!==undefined)     //if customClassname is defined - append it to CSS
    }

    let classNames=cx(classes)

    //if expandedSymbol/collapsedSymbol are defined - use them, otherwise use default icons
    if(!expandedSymbol)
        expandedSymbol=<FaChevronUp/>;
    if(!collapsedSymbol)
        collapsedSymbol=<FaChevronDown/>;

    if(expanded){
        return (<button className={classNames} onClick={toggle}>{expandedText}{expandedSymbol}</button>);
    }else{
        return (<button className={classNames} onClick={toggle}>{collapsedText}{collapsedSymbol}</button>);
    }
}
