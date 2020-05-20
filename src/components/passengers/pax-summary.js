import React, {useState} from 'react'
import style from "./pax-summary.module.scss"
import {Button, Col, Container, Form, Row} from "react-bootstrap";
import SinglePaxDetails from "./single-pax-details";

export default function PaxSummary({passengers=[]}) {
    const [editPassenger, setEditPassenger] = useState()
    function onPassengerEdit(passenger){
        console.log("Passenger:",passenger)
        setEditPassenger(passenger)
    }


    return (
        <div>
            <Row noGutters={true}><h2 className={style.header}>Passengers</h2></Row>
            <Row>
        {
            passengers.map((p)=><Col xs={12} md={6}><SinglePaxSummary passenger={p} onEditClicked={onPassengerEdit}/></Col> )
        }
            </Row>

            {editPassenger && <EditPassengerForm passenger={editPassenger}/>}
        </div>
    )
}

function EditPassengerForm({passenger, onEditFinished}) {
    function onPassengerDataChanged(pax)
    {
        console.log("Ignore this event");
    }

    function saveClicked(){

    }

    return (
        <>
            <SinglePaxDetails initial={passenger} passengerId={passenger.id} passengerType={passenger.type} onDataChange={onPassengerDataChanged} />
            <div className='pt-3'/>

            <Button onClick={saveClicked} variant='primary' size='lg'>Save</Button>
        </>
    )
}


export function SinglePaxSummary({passenger, onEditClicked}) {

    function handleSubmit(evt) {
        console.log("Click",evt)
        evt.preventDefault();
        onEditClicked(passenger);
    }

    let typeToLabel={
        ADT:'Adult',
        CHD:'Child',
        INF:'Infant'
    }
    let paxTypeLabel=typeToLabel[passenger.type];

    return (
        <div className={style.paxSummaryContainer} key={passenger.id}>
            <div className={style.paxType}>{paxTypeLabel}</div>
            <div className={style.paxDetails}>{passenger.firstName} {passenger.lastName}</div>
            <div className={style.paxDetails}>{passenger.birthDate}</div>
            <div className={style.paxDetails}>{passenger.civility==='MR'?'Male':'Female'}</div>
            <div ><a href="#" className={style.editPaxLink} onClick={handleSubmit}>Edit</a></div>
        </div>
    )
}
