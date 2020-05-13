import React, {useState,useEffect} from 'react';
import {ToggleButton} from 'react-bootstrap'
import {ReactComponent as Tick} from '../../assets/tick.svg'
import {ReactComponent as Cross} from '../../assets/cross.svg'

export default function Seat(props) {
    const {number, available, characteristics} = props;
    const [selected, setSelected] = useState(false);

    const handleSelectionChange = (val) => {
        setSelected(!selected);
    };

    const getBackground = () => {
        if(!available) return (<Cross/>);
        return (<Tick/>);
    };

    return (
        <ToggleButton 
            name='seat'
            type='checkbox'
            value={number}
            disabled={!available}
            checked={selected}
            onChange={handleSelectionChange}
        >
            {getBackground()}
        </ToggleButton>
    )
}