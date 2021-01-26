import React from 'react';
import style from './horizontal-line.module.scss'


export const HorizontalDottedLine = ({text}) =>{
    return (<div className={style.horizontalLine}>{(text && text.length>0) && <span className={style.horizontalLineText}>{text}</span>}</div>);
}
