import React,{useState} from 'react'

import './hotel-details.module.scss'
import style from  './room-details.module.scss'
import {Button, Image, Row, Col} from 'react-bootstrap'
import _ from 'lodash'

import {ImageGallery} from "../accommodation-blocks/hotel-images"
import {RoomAmenities} from "../accommodation-blocks/room-amenities"
import {AddToTrip} from "../common-blocks/add-to-trip-button"



export function Room({room, roomPricePlansWithOffers, selectedOffer, onAddOfferToCart}) {

    const roomImages = room.media;

    return (
        <div className={style.roomContainer}>
            <ImageGallery images={roomImages}/>
            <div className={style.roomName}>{room.name}</div>
            <MaxOccupation maximumOccupancy={room.maximumOccupancy}/>
            <RoomSize room={room}/>
            <div className={'pt-4 pb-4'}>
                <RoomAmenities amenities={room.amenities} defaultExpanded={true}/>
            </div>
            <div className='d-flex flex-row flex-wrap flex-fill'>
                <div className='room-details__col2 d-flex flex-column flex-fill'>
                    {
                        roomPricePlansWithOffers.map(plan => {
                            let key = plan.offerId + room.roomTypeId + plan.pricePlanReference;
                            return (
                                <RoomPricePlan key={key}
                                           offer={plan} pricePlan={plan.pricePlan}
                                           selectedOffer={selectedOffer} onAddOfferToCart={onAddOfferToCart}/>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}

 const RoomSize = ({room}) =>{
    let size = '';
    if(room && room.size && room.size.value){
        size+=room.size.value;
        if(room.size._unit_)
            size+=' '+room.size._unit_;
        else
            size+=' Sq.M.';
    }
    return (<div className={style.roomDisclaimer}>{size}</div>)
}

 const RoomPrice = ({amount, currency}) =>{
    return (<div>
        <div className={style.roomPrice}>{amount} {currency}</div>
        <div className={style.roomPriceDisclaimer}>includes all taxes and charges</div>
    </div>)
}


export function RoomPricePlan({offer, pricePlan, selectedOffer, onAddOfferToCart}) {
    let price = offer.price;
    let isThisSelectedOffer = false;
    if(selectedOffer){
        if(selectedOffer.offerId === offer.offerId)
            isThisSelectedOffer=true;
    }
    let {name,penalties} = pricePlan||{}

    const onAddPricePlanToCart = () =>{
        if(onAddOfferToCart){
            let hotelCartItem = {
                offer: offer,
                price:price,
                offerId:offer.offerId,
                room: offer.room
            }
            onAddOfferToCart(hotelCartItem)
        }else{
            console.warn('onAddOfferToCart is not defined!');
        }
    }


    return (<div>
            <PlanPenalties penalties={penalties}/>
            <AddToTrip priceAmount={price.public} priceCurrency={price.currency} isAlreadyAdded={isThisSelectedOffer} onAdd={onAddPricePlanToCart}/>
            <div className={style.roomPriceDisclaimer}>includes all taxes and charges</div>
    </div>)
}



 function PlanPenalties({penalties}){
    if(penalties && penalties.refund) {
        let refund = penalties.refund;
        if (refund.refundable === true) {
            return (<div className={style.roomConditions}>Refundable</div>)
        } else {
            return (<div className={style.roomConditions}>Non-refundable</div>)
        }
    }else{
        return (<></>)
    }
}

 function MaxOccupation({maximumOccupancy}){
    let adults = maximumOccupancy.adults;
    let children = maximumOccupancy.childs?maximumOccupancy.childs:0;
    let text;
    if (adults === 1)
        text = `Up to 1 adult`;
    else
        text = `Up to ${adults} adults`;

    if (children === 1)
        text += ` and 1 child`;
    else if(children>1)
        text += ` and ${children} children`;
        return (<div className={style.roomDisclaimer}>{text}</div>)
}


  function RoomPolicies({policies}){
    return (<>
        {
            _.map(policies, (value, key) => {
                return (<div>{key} {value}</div>)
            })
        }
    </>)
}
