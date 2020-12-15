import React, {useEffect, useRef, useState} from 'react'
import {Col, Container, Row} from 'react-bootstrap'
import style from './lookup-list.module.scss'
import PropTypes from 'prop-types'
import classNames from "classnames/bind";
let cx = classNames.bind(style);

export default function LookupList({locations=[], onLocationSelected}){
    const [highlightedIndex, setHighlightedIndex] = useState(0);
    // const [selectedIndex, setSelectedIndex] = useState(-1);

    const onArrowUpKeyPressed = () => {
        setHighlightedIndex(highlightedIndex - 1)
    };
    const onArrowDownKeyPressed = () => {
        setHighlightedIndex(highlightedIndex + 1)
    };
    const onEnterKeyPressed = () => {
        selected(highlightedIndex);
    };
    const onTabKeyPressed = () => {
        selected(highlightedIndex);
    };
    const selected = (idx) => {
        if(!locations)
            return;
        if(idx<0 || idx>=locations.length)
            return;
        let selectedRow = locations[idx];
        setHighlightedIndex(idx);
        onLocationSelected(selectedRow)
    }

    const renderSingleRow = (rec, rowIndex)=>{
        let rowClassNames=cx({
            row:true,
            highlighted:(rowIndex === highlightedIndex)
        })
        let primaryColClassNames=cx({primaryText:true})
        let primaryTextClassNames=cx({primaryTextSpan:true, indented:rec.indent === true})
        let codeColClassNames=cx({codeText:true})
        let secondaryTextClassNames=cx({secondaryText:true})

        return (
            <Row noGutters={true} className={rowClassNames} key={createKey(rec.code,rowIndex)} onClick={event => selected(rowIndex)}>
                <Col xs={10} className={primaryColClassNames}>
                    {rec.indent===true?(<span className={style.indent}></span>):('')}
                    {rec.icon?(<span className={`icon${rec.icon}`}></span>):('')}
                    <span className={primaryTextClassNames}>{rec.primary}</span>
                    <span className={secondaryTextClassNames}>{rec.secondary}</span>
                </Col>
                <Col xs={2} className={codeColClassNames}>{rec.code}</Col>
            </Row>
        )
    }


    //hook to keyboard events and invoke handlers if up/down arrows were pressed
    useEffect(() => {
        const onKeyDown = (event) => {
            if(event.keyCode === 38)
                onArrowUpKeyPressed();
            if(event.keyCode === 40)
                onArrowDownKeyPressed();
            if(event.keyCode === 13)
                onEnterKeyPressed();
            if(event.keyCode === 9)
                onTabKeyPressed();
            // console.log('Key event,keyCode:',event.keyCode, 'Event:',event)
        };
        window.addEventListener('keydown', onKeyDown);
        return () => {
            window.removeEventListener('keydown', onKeyDown);
        };
    }, [highlightedIndex]);


    let rows=[];
    for(let i=0;i<locations.length;i++){
            rows.push(renderSingleRow(locations[i],i))
    }
    return (
        <Container className={style.list}>
            {rows}
        </Container>)


}

function createKey(a,b,c){
    return a+b+c;
}



LookupList.propTypes = {
    locations:PropTypes.array
}
