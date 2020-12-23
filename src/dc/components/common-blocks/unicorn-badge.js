import React from 'react';
import style from "./unicorn-badge.module.scss"

export const UnicornBadge = ({onClick, children}) => {

    const onClickHandler = (e) =>{
        e.preventDefault();
        if(onClick)
            onClick();
    }

    return (<>
            <a href={'#'} className={style.badge} onClick={onClickHandler}>{children}</a>
        </>
    );
}

