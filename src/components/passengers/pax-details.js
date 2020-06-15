import React, {useState} from 'react'
import _ from 'lodash'
import style from "./pax-details.module.scss"
import SinglePaxDetails from "./single-pax-details";

export default function PaxDetails({passengers, onDataChange, highlightInvalidFields}) {
    // const [passengersList,setPassengersList] = useState(passengers);

    function onPassengerDataChanged(paxId, passengerRecord, isValid) {
        let paxListCopy = Object.assign([],passengers)
        let idx = findPaxIndex(paxListCopy,paxId);
        passengerRecord.isValid=isValid;
        if(idx==-1){
            paxListCopy.push(passengerRecord)
        }else{
            paxListCopy[idx] = passengerRecord;
        }
        let allPaxValid = paxListCopy.reduce((valid, pax) =>{
            return valid && pax.isValid;
        }, true);
        console.log("new passenger details:",passengerRecord);

        // setPassengersList(paxListCopy)
        onDataChange(paxListCopy, allPaxValid)
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
                            return (
                                <SinglePaxDetails
                                    key={pax.id}
                                    passengerId={pax.id}
                                    passengerType={pax.type}
                                    onDataChange={onPassengerDataChanged}
                                    initial={pax}
                                    highlightInvalidFields={highlightInvalidFields}
                                />)
                        })
                    }
                </div>
                <div className={style.footnote}>
                    We will send your tickets to your email. The travel supplier might send SMS to the provided phone number in case of changes or emergency situations
                </div>
            </>
        )
}
