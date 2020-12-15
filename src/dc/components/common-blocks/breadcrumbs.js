import React,{useState} from 'react';
import style from "./breadcrumbs.module.scss"
import {Breadcrumb} from "react-bootstrap";
import {
    flightOfferSelector,
    hotelOfferSelector,
} from "../../../redux/sagas/shopping-cart-store";
import {connect} from "react-redux";


export const STEPS = {
    SEARCH: 'SEARCH',
    TRAVELLER_INFO: 'TRAVELLER_INFO',
    FLIGHT_DETAILS: 'FLIGHT_DETAILS',
    SEAT_SELECTION: 'SEAT_SELECTION',
    PAYMENT: 'PAYMENT',
}

const FLIGHT_FLOW='flight'
const HOTEL_FLOW='hotel'
const items = [
    {id: STEPS.SEARCH, label: 'Search', includedInFlows:[FLIGHT_FLOW,HOTEL_FLOW]},
    {id: STEPS.TRAVELLER_INFO, label: 'Traveller info', includedInFlows:[FLIGHT_FLOW,HOTEL_FLOW]},
    {id: STEPS.FLIGHT_DETAILS, label: 'Flight details', includedInFlows:[FLIGHT_FLOW]},
    {id: STEPS.SEAT_SELECTION, label: 'Seat selection', includedInFlows:[FLIGHT_FLOW]},
    {id: STEPS.PAYMENT, label: 'Payment', includedInFlows:[FLIGHT_FLOW,HOTEL_FLOW]}
]

const getBreadcrumbItemsForFlow = (flows = [FLIGHT_FLOW, HOTEL_FLOW]) =>{
    let filteredItems = items.filter(item=>{
        const {includedInFlows} = item;

        for(const flow of flows){
            if(includedInFlows.includes(flow))
                return true;
        }
        return false;
    })
    return filteredItems
}


export const BookingFlowBreadcrumb = ({flightOffer, hotelOffer, currentStepId = STEPS.SEARCH}) => {
    console.log('BookingFlowBreadcrumb,flightOffer=',flightOffer,' hotelOffer=',hotelOffer)
    let flow = [];
    if(flightOffer)
        flow.push(FLIGHT_FLOW)
    if(hotelOffer)
        flow.push(HOTEL_FLOW)

    let itemsInBreadcrumb = getBreadcrumbItemsForFlow(flow)
    let currentItemIndex=0;
    let idx=0;
    let labels = itemsInBreadcrumb.map(item=>{
        if(currentStepId === item.id)
            currentItemIndex = idx;
        idx++;
        return item.label;
    })

    return <Breadcrumbs items={labels} currentItemIndex={currentItemIndex}/>
}



export const Breadcrumbs = ({items = [], currentItemIndex = 0}) => {
    items = items || [];

    let index=0;
    return (
        <Breadcrumb className={style.breadCrumb} >
        {
            items.map(item=> {
                let isActive= (index++ === currentItemIndex);
                return (<Breadcrumb.Item linkAs='text' active={isActive}>{item}</Breadcrumb.Item>)
            }
            )
        }
        </Breadcrumb>
    );
}


const mapStateToProps = state => ({
    flightOffer: flightOfferSelector(state),
    hotelOffer: hotelOfferSelector(state),
});


const mapDispatchToProps = (dispatch) => {
    return {
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(BookingFlowBreadcrumb);
