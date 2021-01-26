import React from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import style from './search-mode-selector.module.scss';
import classNames from 'classnames/bind';
import {IconPlaneDepartureTop, IconHotelBedTop } from '../icons/icons';


export const SEARCH_TYPE={
    FLIGHTS:'FLIGHTS',
    HOTELS:'HOTELS'
}

export default function SearchModeSelector(){
    const match = useRouteMatch();
    const history = useHistory();
    const selectedMode = match.path === '/flights'
        ? SEARCH_TYPE.FLIGHTS
        : match.path === '/hotels'
            ? SEARCH_TYPE.HOTELS
            : SEARCH_TYPE.FLIGHTS;

    const onFlightClick = () => {
        history.push('/flights');
        // onToggle(SEARCH_TYPE.FLIGHTS);
    }

    const onHotelClick = () => {
        history.push('/hotels');
        // onToggle(SEARCH_TYPE.HOTELS);
    }

    const isFlightActive = (selectedMode===SEARCH_TYPE.FLIGHTS);
    const isHotelActive = (selectedMode===SEARCH_TYPE.HOTELS);

    const activeColor = '#543CE2'; //$g-color-primary
    const inactiveColor = '#717171';  // $g-color-darkgrey

    return (
        <div className={style.container}>
                <SelectorButton
                    onToggle={onFlightClick}
                    isActive={isFlightActive}
                    icon={<IconPlaneDepartureTop stroke={isFlightActive ? activeColor : inactiveColor}/>}
                    text={'Flights'}
                />
                <SelectorButton
                    onToggle={onHotelClick}
                    isActive={isHotelActive}
                    icon={<IconHotelBedTop stroke={isHotelActive ? activeColor : inactiveColor}/>}
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

