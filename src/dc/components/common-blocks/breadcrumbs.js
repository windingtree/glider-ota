import React,{useState} from 'react';
import style from "./breadcrumbs.module.scss"
import {Breadcrumb} from "react-bootstrap";
import {useHistory} from "react-router-dom";
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
    {id: STEPS.SEARCH, label: 'Search', url:'/dc',  includedInFlows:[FLIGHT_FLOW,HOTEL_FLOW]},
    {id: STEPS.TRAVELLER_INFO, url:'/dc/pax', label: 'Traveller info', includedInFlows:[FLIGHT_FLOW,HOTEL_FLOW]},
    {id: STEPS.FLIGHT_DETAILS, url:'/dc/ancillaries', label: 'Flight details', includedInFlows:[FLIGHT_FLOW]},
    {id: STEPS.SEAT_SELECTION, url:'/dc/seatmap', label: 'Seat selection', includedInFlows:[FLIGHT_FLOW]},
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


export const BookingFlowBreadcrumb = ({isFlightBooking, isHotelBooking, currentStepId = STEPS.SEARCH, onClick}) => {
    let history = useHistory();
    let flow = [];
    if(isFlightBooking)
        flow.push(FLIGHT_FLOW)
    if(isHotelBooking)
        flow.push(HOTEL_FLOW)

    let itemsInBreadcrumb = getBreadcrumbItemsForFlow(flow)

    const onClickHandler = (e,id,url) => {
        e.preventDefault();
        //if onClick is defined - call it
        if(onClick){
            onClick(id,url)
        }else{
            //otherwise open url
            history.push(url);
        }
        console.log('onClick',id)
    }
    let currentStepAlreadyFound = false;

    return (<Breadcrumb className={style.breadCrumb} >
        {
            itemsInBreadcrumb.map(item=> {
                    let {id, url, label} = item;
                    let isActive = (id === currentStepId);
                    if (id === currentStepId) {
                        currentStepAlreadyFound = true;
                    }
                let breadcrumb;
                    if (!currentStepAlreadyFound) {
                        breadcrumb=<Breadcrumb.Item href={url} onClick={(e) => onClickHandler(e, id,url)}>{label}</Breadcrumb.Item>;
                    } else {
                        breadcrumb=<Breadcrumb.Item active={isActive} linkAs='text' >{label}</Breadcrumb.Item>;
                    }
                    return breadcrumb;
                }
            )
        }
    </Breadcrumb>)
}




const mapStateToProps = state => ({
    isFlightBooking: (flightOfferSelector(state)!==null),
    isHotelBooking: (hotelOfferSelector(state)!==null)
});


const mapDispatchToProps = (dispatch) => {
    return {
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(BookingFlowBreadcrumb);
