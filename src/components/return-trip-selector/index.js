import React, { useState } from 'react';
import style from './round-trip-selector.module.scss';

export default props => {
    const {
        label,
        checked = false,
        onChange = () => {}
    } = props;
    const [isChecked, setChecked] = useState(checked);

    const handleOnChange = () => {
        const newState = !isChecked;
        setChecked(newState);
        onChange(newState);
    };

    console.log(style);

    return (
        <div
            className={`${style.selectorWrapper}  ${isChecked ? style.checked : ''}`}
            onClick={handleOnChange}
        >
            <input
                className={style.input}
                type='checkbox'
                checked={isChecked}
                onChange={handleOnChange}
            />
            <span
                className={`${style.label} ${isChecked ? style.checked : ''}`}
            >
                {label}
            </span>
        </div>
    );
};