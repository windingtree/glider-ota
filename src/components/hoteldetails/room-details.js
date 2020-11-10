import React,{useState} from 'react'

import './hotel-details.module.scss'
import style from  './room-details.module.scss'
import {Button, Image} from 'react-bootstrap'
import _ from 'lodash'
import default_hotel_image from "../../assets/default_hotel_image.png";

export default function Room({room, roomPricePlansWithOffers, onOfferSelected, selectedOffer}) {
    return (
        <div className={style.roomContainer}>
            <div className={style.roomName} >{room.name}</div>
            <div className='d-flex flex-row flex-wrap flex-fill'>
                <div className='room-details__col1 d-flex flex-column pr-2' >
                    {/*<div className='glider-font-h2-fg'>{room.name}</div>*/}
                    {/*{room.roomTypeId}*/}
                    {/*<div>{room.description}</div>*/}
                    <div ><RoomImage images={room.media}/></div>
                    <div className='glider-font-text16-fg'><RoomSize room={room}/></div>
                    <div>
                        <RoomAmenities amenities={room.amenities}/>
                    </div>
                    {/*<Col className='border'>TOTAL PRICE</Col>*/}
                </div>
                <div className='room-details__col2 d-flex flex-column flex-fill'>
                    {
                        roomPricePlansWithOffers.map(plan => {
                            let key = plan.offerId + room.roomTypeId + plan.pricePlanReference;
                            return (
                                <RoomPricePlan key={key}
                                           offer={plan} room={room} pricePlan={plan.pricePlan}
                                           onOfferSelected={onOfferSelected} selectedOffer={selectedOffer}/>
                            )
                        })
                    }
                </div>
            </div>
            {/*       <Row>
            <Col>Policies</Col>
            <Col><RoomPolicies policies={room.policies}/> </Col>
        </Row>*/}
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
    return (<span>{size}</span>)
}

export function RoomPricePlan({offer, onOfferSelected, pricePlan, room, selectedOffer}) {
    // let room = offer.room;
    // let pricePlan = offer.pricePlan;
    let price = offer.price;

    let isThisSelectedOffer = false;
    if(selectedOffer){
        if(selectedOffer.offerId === offer.offerId)
            isThisSelectedOffer=true;
    }
    let {name,penalties} = pricePlan||{}
    return (<div className='d-flex flex-row flex-wrap border-bottom border-dark pb-3 mb-3'>
        <div className='glider-font-text18medium-fg d-flex flex-column flex-fill'>
            <div className={style.pricePlanName}>{name}</div>
            <div>
                <MaxOccupation maximumOccupancy={room.maximumOccupancy}/>
                <PlanPenalties penalties={penalties}/>
            </div>
        </div>
        <div>
            <div className='glider-font-text18medium-fg'>Total Price</div>
            <div className='glider-font-h2-fg mb-3'>{price.public} {price.currency} </div>
            <div><Button onClick={() => onOfferSelected(offer)} variant={isThisSelectedOffer?"primary":"outline-primary"} size="lg">Select room</Button></div>
        </div>
    </div>)
}


export function RoomAmenities({title = "More amenities", amenities, expanded = false}) {
    const [expandedState, setExpandedState] = useState(expanded);

    function onClick(e){
        e.preventDefault();
        setExpandedState(!expandedState);
    }

    return (<>
        <div className={style.amenitiesTitle}><a href="return false;" onClick={onClick}>{title}</a></div>
        {
            expandedState && amenities.map(rec => {
                return (<div className={style.amenitiesItem} key={rec}>{rec}</div>)
            })
        }
    </>)
}

export function PlanPenalties({penalties}){
    if(penalties && penalties.refund) {
        let refund = penalties.refund;
        if (refund.refundable === true) {
            return (<div className={style.penaltyRefundable}>Refundable</div>)
        } else {
            return (<div className={style.penaltyNonRefundable}>Non-refundable</div>)
        }
    }else{
        return (<></>)
    }
}

export function MaxOccupation({maximumOccupancy}){
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
        return (<div className={style.roomOccupancy}>{text}</div>)
}


export function RoomPolicies({policies}){
    return (<>
        {
            _.map(policies, (value, key) => {
                return (<div>{key} {value}</div>)
            })
        }
    </>)
}

export function RoomImage({images}){
    const image = (images !== undefined && images.length > 0) ? images[0].url : default_hotel_image;
    return (
        <div className={style.mainImageContainer}>
            <Image className={style.mainImage} src={image}/>
        </div>
    )
}


