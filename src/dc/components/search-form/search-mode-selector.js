import React from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import style from './search-mode-selector.module.scss';
import classNames from 'classnames/bind';
import { FaPlaneDeparture } from 'react-icons/fa';
import { FaBed } from 'react-icons/fa';

export const SEARCH_TYPE={
    FLIGHTS:'FLIGHTS',
    HOTELS:'HOTELS'
}

export default function SearchModeSelector(){
    const match = useRouteMatch();
    const history = useHistory();
    const selectedMode = match.path === '/dc/flights'
        ? SEARCH_TYPE.FLIGHTS
        : match.path === '/dc/hotels'
            ? SEARCH_TYPE.HOTELS
            : SEARCH_TYPE.FLIGHTS;

    const onFlightClick = () => {
        history.push('/dc/flights');
        // onToggle(SEARCH_TYPE.FLIGHTS);
    }

    const onHotelClick = () => {
        history.push('/dc/hotels');
        // onToggle(SEARCH_TYPE.HOTELS);
    }

    return (
        <div className={style.container}>
                <SelectorButton
                    onToggle={onFlightClick}
                    isActive={selectedMode===SEARCH_TYPE.FLIGHTS}
                    icon={<FaPlaneDeparture/>}
                    text={'Flights'}
                />
                <SelectorButton
                    onToggle={onHotelClick}
                    isActive={selectedMode===SEARCH_TYPE.HOTELS}
                    icon={<FaBed/>}
                    text={'Hotels'}
                />
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
            <button onClick={onClick} className={className}>
                <span>{icon}</span>
                <span className='pl-3 pr-3'>{text}</span>
            </button>
        </>

);
}

