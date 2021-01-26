import React, {useState} from 'react'
import style from "./pax-summary.module.scss"
import {Button, Col, Row} from "react-bootstrap";
import SinglePaxDetails from "./single-pax-details";
import {retrievePassengerDetails,storePassengerDetails} from "../../utils/api-utils";

/**
 * Component which displays the list of passengers and allows in-place edit of passenger details.
 * @param passengers - list of passengers to displau
 * @param onEditFinished - called after passenger details edition is completed
 * @returns {*}
 * @constructor
 */
export default function PaxSummary({passengers=[], onEditFinished}) {
    const [editPassenger, setEditPassenger] = useState()

    //user requested to edit a passenger
    function onPassengerEdit(passenger){
        setEditPassenger(passenger)
    }

    //edit is completed - hide edit form and populate event up
    function onEditCompleted(){
        setEditPassenger(undefined)
        onEditFinished();
    }

    return (
        <div>
            <Row noGutters={true}><h2 className={style.header}>Traveler Info</h2></Row>
            <Row>
            {
                passengers.map((p)=>{
                    return (
                        <Col key={p.id} xs={12} md={6}>
                            <SinglePaxSummary key={p.id} passenger={p} onEditClicked={onPassengerEdit}/>
                        </Col>)
                })
            }
            </Row>
            {editPassenger && <EditPassengerForm key={editPassenger.id} passenger={editPassenger} onEditFinished={onEditCompleted}/>}
        </div>
    )
}


/**
 * Display single passenger details edit form
 * @param passenger
 * @param onEditFinished
 * @returns {*}
 * @constructor
 */
function EditPassengerForm({passenger, onEditFinished}) {
    const [passengerDetails,setPassengerDetails] = useState(passenger);
    const [isValid,setIsValid] = useState(true);

    //data has changed
    function onPassengerDataChanged(passengerId,paxDetails,isValid)
    {
        setPassengerDetails(paxDetails)
        setIsValid(isValid)

    }

    //save button clicked.
    async function saveClicked(){
        try{
            let currentPaxId = passengerDetails.id;

            //Retrieve all passengers details from backend
            let passengers = await retrievePassengerDetails();
            //find passenger that was edited and overwrite data from server with data from the form
            let newData = passengers.map(pax=>{
                if(pax.id === currentPaxId)
                    return passengerDetails;
                else
                    return pax;
            })
            //store new details on server
            let response = await storePassengerDetails(newData);
            console.log("Update completed, response=", response);
        }catch(error){
            console.error("Error while updating passenger detals", error)
        }
        finally{
            //finally hide edit form
            onEditFinished();
        }
    }

    console.log("EditPassengerForm, passengerDetails:",passengerDetails)
    return (
        <>
            <SinglePaxDetails initial={passenger} passengerId={passenger.id} passengerType={passenger.type} onDataChange={onPassengerDataChanged} />
            <div className='pt-3'/>

            <Button onClick={saveClicked} variant='primary' size='lg' disabled={!isValid}>Save</Button>
        </>
    )
}


export function SinglePaxSummary({passenger, onEditClicked}) {

    function handleSubmit(evt) {
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
            <div ><button className={style.editPaxLink} onClick={handleSubmit}>Edit</button></div>
        </div>
    )
}
