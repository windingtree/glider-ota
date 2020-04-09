import React, {useState} from 'react';
import "./flex.scss"
import "./filters.scss"
import {Container, Row, Col, Button, Form} from "react-bootstrap";
import ReactBootstrapSlider from 'react-bootstrap-slider';
import "bootstrap-slider/dist/css/bootstrap-slider.css"
import _ from 'lodash'

export default function Filters({}) {
    let airlines=[{key:'UA',display:'United'},{key:'AA',display:'American airlines'}];

    return (
        <>
            <div className="filters-container filter d-flex flex-column flex-fill">
                <div className="glider-font-h2-fg pb-4">Filters</div>
                <div className="glider-font-h2-fg pb-4">Search results: [84]</div>
                <SelectionFilter id='airlines' title='STOPS' items={airlines}/>
                <RangeFilter min={12} max={100} unit='EUR' title='Price'/>
                <RangeFilter min={1} max={24} unit='HR' title='MOW-HKT Flight duration'/>
                <RangeFilter min={1} max={24} unit='HR' title='HKT-MOW Flight duration'/>
                <RangeFilter min={1} max={24} unit='HR' title='Layover duration'/>
                <div className='flex-fill'>
                    <Button variant='outline-primary' size='lg'>Apply</Button>
                </div>
            </div>
        </>
    )
}



function RangeFilter({min= 0,max= 1000, unit='[eur]', title = '[missing]'}) {
    const [currentValue, setCurrentValue] = useState(min);

        return (
            <div className='filter'>
                    <div className='filter__title'>{title}</div>
                    <div className='filter__content '>
                        <ReactBootstrapSlider
                            value={currentValue}
                            change={changeEvent => setCurrentValue(changeEvent.target.value)}
                            // slideStop={setCurrentValue}
                            step={1}
                            max={max}
                            min={min}
                            orientation="horizontal"
                            reversed={true} />
                    </div>
            </div>
        )
}



function SelectionFilter( {id,title = '[missing]', items}) {
    const [checked, setChecked] = useState(false);
    console.log("items",items);
    items.forEach(item => {console.log(item)});
    return (
        <div className='filter'>
            <div className='filter__title'>{title}</div>
            <div className='filter__content '>
                {
                    _.map(items, (item) => {
                        console.log(item)
                        return (<>
                            <Form.Check id={item.key} className='filter__checkbox' checked={checked} onChange={setChecked} label={item.display} />
                            </>)
                    })
                }
            </div>
        </div>
    )
}
