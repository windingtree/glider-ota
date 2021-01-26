import React from 'react';
import style from "./unicorn-badge.module.scss"

export const UnicornBadge = ({onClick, children}) => {

    const onClickHandler = (e) =>{
        e.preventDefault();
        if(onClick)
            onClick();
    }

    return (
        <div className={style.badge} onClick={onClickHandler}>
            {children}
        </div>
    );
}

