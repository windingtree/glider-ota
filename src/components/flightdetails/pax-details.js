import React, {useState} from 'react'
import {Container, Row, Col, Form, Alert} from 'react-bootstrap'
import _ from 'lodash'
import style from "./pax-details.module.scss"
import SinglePaxDetails from "./single-pax-details";


export default function PaxDetails({passengers, onDataChange}) {
    const [passengersList,setPassengersList] = useState(passengers);

    function onPassengerDataChanged(paxId,passengerRecord) {
        let paxListCopy = Object.assign([],passengersList)
        let idx = findPaxIndex(paxListCopy,paxId);
        if(idx==-1){
            paxListCopy.push(passengerRecord)
        }else{
            paxListCopy[idx] = passengerRecord;
        }
        console.log("new passenger details:",passengerRecord)
        setPassengersList(paxListCopy)
        onDataChange(passengersList)
    }

    function findPaxIndex(passengers,id) {
        for (let i = 0; i < passengers.length; i++) {
            if(passengers[i].id === id)
                return i;
        }
        return -1;
    }
        return (
            <>
                <div>
                    <h2 className={style.header}>Passengers for reservation</h2>
                    <div className={style.note}>
                        Enter your personal details as indicated in the travel document you are flying on. Use Latin
                        letters.
                    </div>
                    <div className={style.warning}>The number and type of passengers for this
                        airline can only be changed with a new search
                    </div>
                </div>
                <div className='paxdetails'>
                    {
                        _.map(passengers,(pax,id)=> {
                            return (<SinglePaxDetails key={pax.id} passengerId={pax.id} passengerType={pax.type} onDataChange={onPassengerDataChanged} initial={pax}/>)
                        })
                    }
                </div>
                <div className={style.footnote}>
                    We will send a ticket to the mail, we will send an SMS to the phone about changes in the flight or in case of other emergency situations
                </div>
            </>
        )
}
