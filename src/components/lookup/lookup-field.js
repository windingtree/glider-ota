import React, {useState,useEffect} from 'react'
import {Overlay, Popover,  Form} from 'react-bootstrap'
import {Dropdown, Container} from 'react-bootstrap'
import LookupList from "./lookup-list";
import style from './lookup-field.module.scss'
export const LOCATION_SOURCE={
    AIRPORTS:'airports',
    CITIES:'cities'
}

const SEARCH_TIMEOUT_MILLIS=100;

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
        if(searchQueryTimeout!==undefined){
            //check if there was already a timeout handler set previously - if so, cancel it (in case user entered text too fast)
            clearTimeout(searchQueryTimeout);
            setSearchQueryTimeout(undefined)
        }

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

        return (
            <>{label && <div className={style.label}>{label}</div>}
            <div className={focus?[style.lookup,style.pseudoFocus].join(' '):style.lookup}>
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
                    <Popover id="popover-contained" className={style.locationLookupPopover}>
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
