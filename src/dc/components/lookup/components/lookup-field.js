import React, {useState,useEffect} from 'react'
import {Overlay, Popover,  Form} from 'react-bootstrap'
import {Dropdown, Container} from 'react-bootstrap'
import LookupList from "./lookup-list";
import style from './lookup-field.module.scss'

import classNames from "classnames/bind";
let cx = classNames.bind(style);

/*export const LOCATION_SOURCE={
    AIRPORTS:'airports',
    CITIES:'cities'
}*/

const SEARCH_TIMEOUT_MILLIS=250;

export default function LookupField({initialLocation,onSelectedLocationChange, placeHolder, onQueryEntered, locations=[], label, localstorageKey})  {
    const [value, setValue] = useState(initialLocation!==undefined?initialLocation.primary:'');
    const [target, setTarget] = useState();
    const [selectedLocation, setSelectedLocation] = useState(initialLocation);
    const [searchQueryTimeout, setSearchQueryTimeout] = useState();
    const [focus,setFocus] = useState(false);

    useEscape(() => {setFocus(false)})

    useEffect(()=>{
        if(localstorageKey) {
            let storedValue = localStorage.getItem(`inputfield-${localstorageKey}`);
            if(storedValue){
                try{
                    let previouslySelectedLocation=JSON.parse(storedValue);
                    handleLocationSelected(previouslySelectedLocation)
                }catch(err){
                    console.log('Error:',err)
                }
            }
        }
    },[])


    function handleLocationSelected(location) {
        setSelectedLocation(location);
        setValue(location.primary);
        onSelectedLocationChange(location)
        if(localstorageKey) {
            localStorage.setItem(`inputfield-${localstorageKey}`, JSON.stringify(location));
        }

    }

    function clearSelectedLocation() {
        setSelectedLocation(undefined);
        onSelectedLocationChange(undefined);
    }

    function searchQueryWasEntered(text){
        onQueryEntered(text);
    }

    function handleOnBlur(event) {
        setFocus(false)
        // clearSelectedLocation();

    }
    function handleOnChange(event) {
        const enteredText = event.target.value;
        clearSelectedLocation();
        clearTimeout(searchQueryTimeout);

        setValue(enteredText);
        setTarget(event.target);
        if(enteredText.length<2)
            return;

        setSearchQueryTimeout(setTimeout(()=>{searchQueryWasEntered(enteredText)},SEARCH_TIMEOUT_MILLIS));
    }

    function handleOnFocus(event) {
        setFocus(true)
        event.target.select();
    };

    let elementClassnames=cx({
        lookup:true,
        pseudoFocus:focus
    })
    let popoverClassnames=cx({
        locationLookupPopover:true,
        pseudoFocus:focus
    })

    return (
            <>{label && <div className={style.label}>{label}</div>}
            <div className={elementClassnames}>
                <Form.Control
                    type="text"
                    value={value}
                    onChange={handleOnChange}
                    onBlur={handleOnBlur}
                    onFocus={handleOnFocus}
                    className={style.inputField} placeholder={placeHolder}>
                </Form.Control>
                <span className={style.code}>{selectedLocation && selectedLocation.code}</span>
                <Overlay
                    show={focus && selectedLocation===undefined && locations.length > 0}
                    target={target}
                    placement="bottom-start">
                    <Popover id="popover-contained" className={popoverClassnames}>
                            <LookupList locations={locations} onLocationSelected={handleLocationSelected} key={1}/>

                    </Popover>
                </Overlay>
            </div></>
        )
}


const useEscape = (onEscape) => {
    useEffect(() => {
        const handleEsc = (event) => {
            if (event.keyCode === 27)
                onEscape();
        };
        window.addEventListener('keydown', handleEsc);

        return () => {
            window.removeEventListener('keydown', handleEsc);
        };
    }, []);
}
