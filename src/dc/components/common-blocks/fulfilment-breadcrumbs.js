import React,{useState} from 'react';
import style from "./fulfilment-breadcrumbs.module.scss"
import {Breadcrumb} from "react-bootstrap";



export const FulfilmentBreadcrumbs = ({items = [], currentItemIndex = 0}) => {
    items = items || [];

    let index=0;
    return (
        <Breadcrumb className={style.breadCrumb} >
        {
            items.map(item=> {
                let isActive= (index++ === currentItemIndex);
                return (<Breadcrumb.Item linkAs='text' active={isActive}>{item}</Breadcrumb.Item>)
            }
            )
        }
        </Breadcrumb>
    );
}

