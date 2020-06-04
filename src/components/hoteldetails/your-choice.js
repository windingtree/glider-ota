import React from "react";
import {Col, Container, Row} from "react-bootstrap";
import style from './your-choice.module.scss'
import _ from 'lodash'


export default function YourChoice({hotel, price, room}){
    return (
        <Container >
            <div className={style.title}>
                Your choice
            </div >
            <div className={style.roomName}>
                {room.name}
            </div>
            <div className={style.price}>
                {price.public} {price.currency} for [X] nights
            </div>
            <div className={style.guestInfo}>
               Guest 1
            </div>
            <div>
                <CheckinPolicy checkinoutPolicy={hotel.checkinoutPolicy}/>
            </div>
            <div>
                <OtherPolicies otherPolicies={hotel.otherPolicies}/>
            </div>
        </Container>
    )
}


export function CheckinPolicy({checkinoutPolicy, checkInDate, checkOutDate}){
    let checkInTime=checkinoutPolicy.checkinTime;
    let checkOutTime=checkinoutPolicy.checkoutTime;

    return (<>
        <div className={style.checkInTitle}>Check-in:</div>
        <div className={style.checkInItem}>{checkInTime}</div>
        <div className={style.checkInTitle}>Check-out:</div>
        <div className={style.checkInItem}>{checkOutTime}</div>
    </>)
}


export function OtherPolicies({otherPolicies}){
    return (<>
        <div className={style.otherPoliciesTitle}>
            Hotel policies
        </div>
        <div className={style.otherPoliciesItem}>
        {_.map(otherPolicies, (policy, id) => {
            return (
                <p key={id}>{policy}</p>
            )
        })}
        </div>
    </>)
}
