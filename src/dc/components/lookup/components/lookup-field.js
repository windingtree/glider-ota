import React, { useState, useEffect, useCallback } from 'react';
import { Overlay, Popover,  Form, Spinner } from 'react-bootstrap';
import LookupList from "./lookup-list";
import style from './lookup-field.module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(style);

const SEARCH_TIMEOUT_MILLIS=100;

const useEscape = onEscape => {
    useEffect(() => {
        const handleEsc = (event) => {
            if (event.keyCode === 27)
                onEscape();
        };
        window.addEventListener('keydown', handleEsc);

        return () => {
            window.removeEventListener('keydown', handleEsc);
        };
    });
}

export default function LookupField(props)  {
    const {
        initialLocation,
        onSelectedLocationChange = () => {},
        placeHolder,
        onQueryEntered = () => {},
        onNewSearch = () => {},
        locations = [],
        label,
        localstorageKey,
        loading = false,
        noResults = false
    } = props;
    const [value, setValue] = useState('');
    const [target, setTarget] = useState();
    const [selectedLocation, setSelectedLocation] = useState();
    const [focus, setFocus] = useState(false);

    useEscape(() => {
        setFocus(false);
    });

    const handleLocationSelected = useCallback(location => {
        setSelectedLocation(location);
        setValue(location ? location.primary : '');
        onSelectedLocationChange(location);
    }, [onSelectedLocationChange]);

    useEffect(() => {
        if (initialLocation && !selectedLocation && !value) {
            console.log('Set initial location:', initialLocation, selectedLocation);
            handleLocationSelected(initialLocation);
        }
    }, [initialLocation, selectedLocation, value, handleLocationSelected]);

    useEffect(() => {
        let queryTimeOut;

        if (value && value.length > 2) {
            queryTimeOut = setTimeout(
                () => onQueryEntered(value),
                SEARCH_TIMEOUT_MILLIS
            )
        }

        return () => clearTimeout(queryTimeOut);
    }, [value, onQueryEntered]);

    useEffect(() => {
        let escapeTimeout;

        if (!focus) {
            escapeTimeout = setTimeout(() => {
                if (locations.length > 0 && !selectedLocation) {
                    handleLocationSelected(locations[0]);
                }
            }, SEARCH_TIMEOUT_MILLIS);
        }

        return () => clearTimeout(escapeTimeout);
    }, [focus, locations, selectedLocation, handleLocationSelected]);

    const handleOnFocus = event => {
        setFocus(true)
        event.target.select();
    };

    const handleOnBlur = event => {
        setFocus(false);
    }

    const handleOnChange = event => {
        if (selectedLocation) {
            setSelectedLocation(undefined);
            onSelectedLocationChange(undefined);
        }

        setValue(event.target.value);
        setTarget(event.target);
        onNewSearch();
    }

    const elementClassnames = cx({
        lookup:true,
        pseudoFocus:focus,
        warningFocus: noResults
    });

    const popoverClassnames = cx({
        locationLookupPopover:true,
        pseudoFocus:focus
    });

    const labelClassNames = cx({
        label: true,
        warning: noResults
    });

    return (
            <>
                {label &&
                    <div className={labelClassNames}>{label}</div>
                }
                <div className={elementClassnames}>
                    <Form.Control
                        type="text"
                        value={value}
                        onChange={handleOnChange}
                        onBlur={handleOnBlur}
                        onFocus={handleOnFocus}
                        className={style.inputField} placeholder={placeHolder}>
                    </Form.Control>
                    {selectedLocation && selectedLocation.code &&
                        <div className={style.code}>{selectedLocation.code}</div>
                    }
                    {loading &&
                        <Spinner className={style.loadingSpinner} animation="border" size='sm' variant='primary' />
                    }
                    <Overlay
                        show={focus && selectedLocation === undefined && locations.length > 0}
                        target={target}
                        placement="bottom-start"
                    >
                        <Popover id="popover-contained" className={popoverClassnames}>
                            <LookupList
                                locations={locations}
                                onLocationSelected={handleLocationSelected}
                                key={1}
                            />
                        </Popover>
                    </Overlay>
                </div>
                {noResults &&
                    <div className={labelClassNames}>There’s no such a place</div>
                }
            </>
        );
}
