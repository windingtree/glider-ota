import React, {useState} from 'react';
import style from "./selection-filter.module.scss"
import {Form} from "react-bootstrap";

export function RadiobuttonFilter({title = 'title', filterItems, onItemCheckStateChange, onFilterStateChanged}) {
    const [items, setItems] = useState(filterItems)
    function onChange(itemIdx, item, checked) {
        let newItems = Object.assign([],items);
        newItems[itemIdx].selected=checked;
        newItems.forEach(newItem=>{
            if(newItem.key === item.key)
                newItem.selected = true;
            else
                newItem.selected = false;
        })
        setItems(newItems);

        if(onItemCheckStateChange)
            onItemCheckStateChange(itemIdx, item, checked)
        if(onFilterStateChanged) {
            let filter={};
            newItems.forEach(item=>{
                filter[item.key] = item.selected;
            })
            onFilterStateChanged(filter);
        }
    }


    let checkboxes = [];
    for(let idx=0;idx<items.length;idx++){
        let item = items[idx];
        checkboxes.push(<span key={item.key}>
                            <Form.Check
                                type={'radio'}
                                    id={item.key}
                                    name='group'
                                    className={style.filterCheckbox}
                                    checked={item.selected===true}
                                    onChange={() => {}}
                                    label={item.display}
                                    onClick={(event) => onChange(idx, item, event.target.checked)} /></span>)
    }



    return (
        <div className={style.filter}>
            <div className={style.filterTitle}>{title}</div>
            <div className={style.filterContainer}>
                <fieldset>
                {checkboxes}
                </fieldset>
            </div>
        </div>
    )
}

