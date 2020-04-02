import React, {useState} from 'react';
import "./typography.scss"


export default function Typography({}) {
    return (
        <>
            <h1 className='glider-font-h1'>[H1] Lorem ipsum dolor sit amet, consectetur adipiscing elit</h1>
            <div className='glider-font-h1'>[H1] Lorem ipsum dolor sit amet, consectetur adipiscing elit</div>
            <h2 className='glider-font-h2'>[H2] Lorem ipsum dolor sit amet, consectetur adipiscing elit</h2>
            <h3 className='glider-font-h3'>[H3] Lorem ipsum dolor sit amet, consectetur adipiscing elit</h3>
            <div className='glider-font-medium'>[glider-font-medium] Lorem ipsum dolor sit amet, consectetur adipiscing elit</div>
            <div className='glider-font-regular'>[glider-font-regular] Lorem ipsum dolor sit amet, consectetur adipiscing elit</div>
        </>
    )
}


