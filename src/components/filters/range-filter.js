import React, {useState} from 'react';
import style from "./range-filter.module.scss"
import InputRange from 'react-input-range';
import "react-input-range/lib/css/index.css";

export function RangeFilter({id, unit = '[eur]', title = '[missing]', onFilterStateChange, filterState}) {
    const [currentValue, setCurrentValue] = useState(filterState);

    function onChangeComplete() {
        let newFilterState = Object.assign({}, filterState);
        newFilterState.min = currentValue.min;
        newFilterState.max = currentValue.max;
        if(onFilterStateChange)
            onFilterStateChange(id, newFilterState)
        else{
            console.warn("onFilterStateChange not defined!", id)
        }
    }

    return (
        <div className={style.filter} key={id}>
            <div className={style.filterTitle}>{title}</div>
            <div className={style.filterContainer}>
                <InputRange
                    maxValue={filterState.highest}
                    minValue={filterState.lowest}
                    formatLabel={value => `${value} ${unit}`}
                    value={currentValue}
                    onChange={value => setCurrentValue(value)}
                    onChangeComplete={onChangeComplete}/>
            </div>
        </div>
    )
}
