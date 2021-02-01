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

    //if needed, we can disable hotel or search search (link in the top of the page) with env property (at build time!)
    let flightSearchDisabled = (process.env.REACT_APP_FLIGHT_SEARCH_DISABLED === "yes")
    let hotelSearchDisabled = (process.env.REACT_APP_HOTEL_SEARCH_DISABLED === "yes")

    const activeColor = '#543CE2'; //$g-color-primary
    const inactiveColor = '#717171';  // $g-color-darkgrey

    return (
        <div className={style.container}>
            <SelectorButton
                onToggle={onHotelClick}
                isActive={isHotelActive && !hotelSearchDisabled}
                disabled={hotelSearchDisabled}
                icon={<IconHotelBedTop stroke={isHotelActive&&!hotelSearchDisabled ? activeColor : inactiveColor}/>}
                text={'Hotels'}
            />
            <SelectorButton
                onToggle={onFlightClick}
                isActive={isFlightActive && !flightSearchDisabled}
                disabled={flightSearchDisabled}
                icon={<IconPlaneDepartureTop stroke={isFlightActive&&!flightSearchDisabled ? activeColor : inactiveColor}/>}
                text={'Flights'}
            />
        </div>)
}


export const SelectorButton = ({text, icon, isActive=false,disabled=false, onToggle=undefined}) => {
    const onClick = (e)  => {
        if(onToggle)
            onToggle();
        e.preventDefault();
    }
    let cx = classNames.bind(style);
    let className=cx({
        selectorBtn:true,
        active:isActive===true,
        inactive:isActive===false
    })
    return (
        <>
            <button onClick={onClick} className={className} disabled={disabled} >
                <span>{icon}</span>
                <span className='pl-3 pr-3'>{text}</span>
                {disabled && <span className={style.comingSoon}>Coming 2021</span>}
            </button>
        </>

);
}

