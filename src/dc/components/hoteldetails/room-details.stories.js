import React from 'react';
import {
    action
} from '@storybook/addon-actions';
import sample from "../../data/sample_response_hotels.json"
import Room, {MaxOccupation, PlanPenalties, RoomAmenities, RoomPolicies,RoomPricePlan} from './room-details'

let roomND = sample.accommodations["erevmax.07119"].roomTypes.ND
let roomND1 = sample.accommodations["erevmax.07119"].roomTypes.ND1
let roomNMD = sample.accommodations["erevmax.07119"].roomTypes.NMD


export default {
    title: 'DC/Hotels/Room details'
};

let amenities = [
    "Hairdryer",
    "Large work area",
    "Shower"
]


// export const SingleRoom = () => (<Room room={roomND} roomPricePlansWithOffers={sample}/> );
export const AmenitiesExpanded = () => (<RoomAmenities amenities={amenities} expanded={true}/> );
export const AmenitiesCollapsed = () => (<RoomAmenities amenities={amenities} expanded={false}/> );

let penaltiesRefundable={
    "refund": {
        "refundable": true
    }
}

let penaltiesNonrefundable={
    "refund": {
        "refundable": false
    }
}


export const PenaltiesRefundable = () => (<PlanPenalties penalties={penaltiesRefundable}/> );
export const PenaltiesNonRefundable = () => (<PlanPenalties penalties={penaltiesNonrefundable}/> );

let occupancy1 = {
    "adults": "1"
};
let occupancy2_1 = {
    "adults": "2",
    "childs": "1"
};


export const Occupancy1 = () => (<MaxOccupation maximumOccupancy={occupancy1}/> );
export const Occupancy1adult = () => (<MaxOccupation maximumOccupancy={occupancy2_1}/> );


let policy_smoking={
    "smoking_policy": "smoking"
}

let policy_nonsmoking={
    "smoking_policy": "non-Smoking"
}
let policy_accessible={
    "accessibility_policy": "All rooms are Accessible rooms"
}

export const PolicyNonSmoking = () => (<RoomPolicies policies={policy_nonsmoking}/> );
export const PolicySmoking = () => (<RoomPolicies policies={policy_smoking}/> );
export const PolicyAccessibility = () => (<RoomPolicies policies={policy_accessible}/> );

let roomPricePlansWithOffers=[];
export const ExampleRoomND = () => (<Room room={roomND} roomPricePlansWithOffers={roomPricePlansWithOffers} onOfferSelected={action("onOfferSelected")}/> );
export const ExampleRoomND1 = () => (<Room room={roomND1} roomPricePlansWithOffers={roomPricePlansWithOffers} onOfferSelected={action("onOfferSelected")}/> );
export const ExampleRoomNMD = () => (<Room room={roomNMD} roomPricePlansWithOffers={roomPricePlansWithOffers} onOfferSelected={action("onOfferSelected")}/> );


let offer1 = sample.offers["7ed6503f-70b6-408d-a60e-a5c04a1f0161"];
let pricePlanBAR = sample.pricePlans.BAR;
let pricePlanLSAVE = sample.pricePlans.LSAVE;

export const PricePlanBAR = () => (<RoomPricePlan offer={offer1} pricePlan={pricePlanBAR} room={roomND} onOfferSelected={action("onOfferSelected")}/> );
export const PricePlanLSAVE = () => (<RoomPricePlan offer={offer1} pricePlan={pricePlanLSAVE} room={roomNMD} onOfferSelected={action("onOfferSelected")}/> );
