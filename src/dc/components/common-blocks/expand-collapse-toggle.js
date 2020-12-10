import React,{useState} from 'react';
import style from "./expand-collapse-toggle.module.scss"
import {FaChevronUp, FaChevronDown} from "react-icons/fa";


export const ExpandCollapseToggle = ({expanded = false, onToggle}) => {
    const toggle = (e) => {
        e.preventDefault();
        if(onToggle)
            onToggle(!expanded);
    }
    return (
        <a href={"#"} className={style.toggle} onClick={toggle}>{expanded?<FaChevronUp/>:<FaChevronDown/>}</a>
    );
}
