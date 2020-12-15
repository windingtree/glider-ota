import React,{useState} from 'react';
import {Breadcrumbs} from "../components/common-blocks/breadcrumbs"
import {
    bookAction,
    errorSelector,
    flightOfferSelector,
    hotelOfferSelector,
    isShoppingCartUpdateInProgress, requestCartRestoreFromServer
} from "../../redux/sagas/shopping-cart-store";
import {requestSearchResultsRestoreFromCache} from "../../redux/sagas/shopping-flow-store";
import {connect} from "react-redux";
import {ShoppingCart} from "../components/shopping-cart/shopping-cart";

export const STEPS = {
    SEARCH: 'SEARCH',
    TRAVELLER_INFO: 'TRAVELLER_INFO',
    FLIGHT_DETAILS: 'FLIGHT_DETAILS',
    SEAT_SELECTION: 'SEAT_SELECTION',
    PAYMENT: 'PAYMENT',
}

const FLIGHT_FLOW='flight'
const BOOKING_FLOW='flight'
const items = [
    {id: STEPS.SEARCH, label: 'Search', includedInFlows:[FLIGHT_FLOW,BOOKING_FLOW]},
    {id: STEPS.TRAVELLER_INFO, label: 'Traveller info', includedInFlows:[FLIGHT_FLOW,BOOKING_FLOW]},
    {id: STEPS.FLIGHT_DETAILS, label: 'Flight details', includedInFlows:[FLIGHT_FLOW]},
    {id: STEPS.SEAT_SELECTION, label: 'Seat selection', includedInFlows:[FLIGHT_FLOW]},
    {id: STEPS.PAYMENT, label: 'Payment', includedInFlows:[FLIGHT_FLOW,BOOKING_FLOW]}
]

const getBreadcrumbItemsForFlow = (flows = [FLIGHT_FLOW, BOOKING_FLOW]) =>{
    let filteredItems = items.filter(item=>{
        const {includedInFlows} = item;

        for(const flow of flows){
            if(includedInFlows.includes(flow))
                return true;
        }
        return false;
    })
}

export const BookingFlowBreadcrumb = ({flightOffer, hotelOffer, currentStepId = STEPS.SEARCH}) => {
    let currentItemIndex=0;
    let idx=0;
    let labels = items.map(item=>{
        if(currentStepId === item.id)
            currentItemIndex = idx;
        idx++;
        return item.label;
    })

    return <Breadcrumbs items={labels} currentItemIndex={currentItemIndex}/>
}



const mapStateToProps = state => ({
    flightOffer: flightOfferSelector(state),
    hotelOffer: hotelOfferSelector(state),
});


const mapDispatchToProps = (dispatch) => {
    return {
        restoreCartFromServer: () => {
            dispatch(requestCartRestoreFromServer())
        },
        restoreSearchResultsFromCache: ()=>{
            dispatch(requestSearchResultsRestoreFromCache())
        },
        onStore: () => {
            dispatch(bookAction())
        },

    }
}
export default connect(mapStateToProps, mapDispatchToProps)(BookingFlowBreadcrumb);
