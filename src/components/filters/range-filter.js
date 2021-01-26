import React, {useState} from 'react';
import style from "./range-filter.module.scss"
import InputRange from 'react-input-range';
import "react-input-range/lib/css/index.css";

export function RangeFilter({unit = '[eur]', title = '[missing]', onFilterStateChanged, filterState}) {
    const [currentValue, setCurrentValue] = useState(filterState);

    function onChangeComplete() {
        let newFilterState = Object.assign({}, filterState);
        newFilterState.min = currentValue.min;
        newFilterState.max = currentValue.max;
        if(onFilterStateChanged)
            onFilterStateChanged(newFilterState)
    }

    return (
        <div className={style.filter}>
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
