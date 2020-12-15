import React,{useState} from 'react';
import style from "./badge.module.scss"
import {FaPlus, FaCheck} from "react-icons/fa";

export const Badge = ({text, icon}) => {
    return (<>
            <div className={style.badge}>{text} {icon}</div>
        </>
    );
}

