import React, {useState} from 'react';
import "./flex.scss"
import "./hotels.scss"
import {Container,Row,Col} from "react-bootstrap";


export default function Hotels({}) {

    return (
        <>
            <div className="hotels-results d-flex flex-row flex-wrap">
                <div className="hotels-results__image border border-warning">image</div>
                <div className='flex-fill'>
                    <div>
                        <div className="min-w100 border border-danger">hotel name</div>
                        <div className="min-w100 border border-info">hotel description hotel description hotel description
                        </div>
                    </div>
                    <div className='d-flex flex-row flex-wrap'>
                        <div className="min-w100 border border-primary">price</div>
                        <div className="min-w100 border border-dark">button</div>
                    </div>
                </div>
            </div>

        </>
    )
}
