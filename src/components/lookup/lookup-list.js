import React, {useEffect, useState} from 'react'
import {Col, Container, Row} from 'react-bootstrap'
import style from './lookup-list.module.scss'
import PropTypes from 'prop-types'

export default function LookupList({locations=[], onLocationSelected}){
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    console.log('Render lookup list, highlightedIndex:',highlightedIndex);

    const onArrowUp = () => {
        setHighlightedIndex(highlightedIndex - 1)
    };
    const onArrowDown = () => {
        setHighlightedIndex(highlightedIndex + 1)
    };
    const onEnterHit = () => {
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
        let rowClassNames=[style.row];
        if(rowIndex === highlightedIndex)
            rowClassNames.push(style.highlighted);
        return (
            <Row noGutters={true} className={rowClassNames} key={createKey(rec.primary,rec.secondary,rec.code)} onClick={event => selected(rowIndex)}>
                <Col xs={9}  className={style.primaryText}>
                    {rec.icon?(<span className={`icon${rec.icon}`}></span>):('')}
                    {/*{rec.indent===true?(<span className={style.indent}></span>):('')}*/}
                    {rec.primary}
                    <span className={style.secondaryText}>{rec.secondary}</span>
                </Col>
                <Col xs={3} className={style.codeText}>{rec.code}</Col>
            </Row>
        )
    }


    //hook to keyboard events and invoke handlers if up/down arrows were pressed
    useEffect(() => {
        const onKeyDown = (event) => {
            if(event.keyCode === 38)
                onArrowUp();
            if(event.keyCode === 40)
                onArrowDown();
            if(event.keyCode === 13)
                onEnterHit();
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
