import React,{useState} from "react";
import style from "./search-mode-selector.module.scss";
import classNames from 'classnames/bind';
import { FaPlaneDeparture } from "react-icons/fa";
import { FaBed } from "react-icons/fa";

export const SEARCH_TYPE={
    FLIGHTS:'FLIGHTS',
    HOTELS:'HOTELS'
}

export default function SearchModeSelector({selectedMode = SEARCH_TYPE.FLIGHTS, onToggle}){
    const onFlightClick = () => {onToggle(SEARCH_TYPE.FLIGHTS);}
    const onHotelClick = ()  => {onToggle(SEARCH_TYPE.HOTELS);}
    return (
        <div className={style.container}>
                <SelectorButton onToggle={onFlightClick} isActive={selectedMode===SEARCH_TYPE.FLIGHTS} icon={<FaPlaneDeparture/>} text={'Flights'}/>
                <SelectorButton onToggle={onHotelClick} isActive={selectedMode===SEARCH_TYPE.HOTELS} icon={<FaBed/>} text={'Hotels'}/>
        </div>)
}


export const SelectorButton = ({text, icon, isActive=false,onToggle=undefined}) => {
    const onClick = (e)  => {
        if(onToggle)
            onToggle();
        e.preventDefault();
    }
    let cx = classNames.bind(style);
    let className=cx({
        selectorBtn:true,
        active:isActive===true,
        inactive:isActive===false,
    })
    return (
        <>
            <a href={"#"} onClick={onClick} className={className}>
                <span>{icon}</span>
                <span className='pl-3 pr-3'>{text}</span>
            </a>
        </>

);
}

