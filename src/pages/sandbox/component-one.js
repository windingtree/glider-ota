import React, {useState} from 'react';
import {Button, Container, Row, Col} from "react-bootstrap";
import style from "./component-one.module.scss"


export default function ComponentOne() {
        return (
            <div className={style.componentOne}>Component one
            <div className='glider-font-text12-bg'>glider</div>
            </div>
        )
}
