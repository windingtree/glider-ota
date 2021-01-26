import React from 'react';
import {Breadcrumb} from "react-bootstrap";
import style from "./breadcrumbs.module.scss"
import {useHistory} from "react-router-dom";
import {flightOfferSelector, hotelOfferSelector,} from "../../redux/sagas/shopping-cart-store";
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
    {id: STEPS.SEARCH, label: 'Search', url:'/',  includedInFlows:[FLIGHT_FLOW,HOTEL_FLOW]},
    {id: STEPS.TRAVELLER_INFO, url:'/pax', label: 'Traveler Info', includedInFlows:[FLIGHT_FLOW,HOTEL_FLOW]},
    {id: STEPS.FLIGHT_DETAILS, url:'/ancillaries', label: 'Flight Details', includedInFlows:[FLIGHT_FLOW]},
    {id: STEPS.SEAT_SELECTION, url:'/seatmap', label: 'Seat Selection', includedInFlows:[FLIGHT_FLOW]},
    {id: STEPS.PAYMENT, label: 'Payment', includedInFlows:[FLIGHT_FLOW,HOTEL_FLOW]}
]

const getBreadcrumbItemsForFlow = (flows = [FLIGHT_FLOW, HOTEL_FLOW]) =>{
    return items.filter(item => {
        const {includedInFlows} = item;

        for (const flow of flows) {
            if (includedInFlows.includes(flow))
                return true;
        }
        return false;
    })
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
            itemsInBreadcrumb.map((item, index)=> {
                    let {id, url, label} = item;
                    let isActive = (id === currentStepId);
                    if (id === currentStepId) {
                        currentStepAlreadyFound = true;
                    }
                let breadcrumb;
                    if (!currentStepAlreadyFound) {
                        breadcrumb=<Breadcrumb.Item key={index} href={url} onClick={(e) => onClickHandler(e, id,url)}>{label}</Breadcrumb.Item>;
                    } else {
                        breadcrumb=<Breadcrumb.Item key={index} active={isActive} linkAs='text' >{label}</Breadcrumb.Item>;
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


const mapDispatchToProps = () => {
    return {
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(BookingFlowBreadcrumb);
