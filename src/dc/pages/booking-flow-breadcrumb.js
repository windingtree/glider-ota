import React,{useState} from 'react';
import {FulfilmentBreadcrumbs} from "../components/common-blocks/fulfilment-breadcrumbs"

export const STEPS = {
    SEARCH: 'SEARCH',
    TRAVELLER_INFO: 'TRAVELLER_INFO',
    FLIGHT_DETAILS: 'FLIGHT_DETAILS',
    SEAT_SELECTION: 'SEAT_SELECTION',
    PAYMENT: 'PAYMENT',
}

const items = [
    {id: STEPS.SEARCH, label: 'Search'},
    {id: STEPS.TRAVELLER_INFO, label: 'Traveller info'},
    {id: STEPS.FLIGHT_DETAILS, label: 'Flight details'},
    {id: STEPS.SEAT_SELECTION, label: 'Seat selection'},
    {id: STEPS.PAYMENT, label: 'Payment'}
]


export const BookingFlowBreadcrumb = ({currentStepId = STEPS.SEARCH}) => {
    let currentItemIndex=0;
    let idx=0;
    let labels = items.map(item=>{
        if(currentStepId === item.id)
            currentItemIndex = idx;
        idx++;
        return item.label;
    })

    return <FulfilmentBreadcrumbs items={labels} currentItemIndex={currentItemIndex}/>
}
