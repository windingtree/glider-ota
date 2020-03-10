import React from "react";
import {Button, Col, Container, Row} from "react-bootstrap";
import {RoomImage} from "./hotel-image";
import './room-offer.css'
import _ from 'lodash'


function Room({room, roomPricePlansWithOffers, onOfferSelected}) {
    return (
        <Container>
            <Row>
                <Col md={3} className='border'><b>{room.name}</b> {room.roomTypeId}
                    <div>{room.description}</div>
                </Col>
                <Col className='border'>TOTAL PRICE</Col>
            </Row>
            <Row>
                <Col>
                    <RoomImage images={room.media}/>
                    <div>{room.size.value} {room.size._unit_}</div>
                    <RoomAmenities amenities={room.amenities}/>
                </Col>
                <Col>
                    {
                        roomPricePlansWithOffers.map(plan => {
                            let key = plan.offerId + room.roomTypeId + plan.pricePlanReference;
                            return (
                                <RoomOffer key={key}
                                           offer={plan}
                                           onOfferSelected={onOfferSelected}/>
                            )
                        })
                    }
                </Col>
            </Row>
            {/*       <Row>
            <Col>Policies</Col>
            <Col><RoomPolicies policies={room.policies}/> </Col>
        </Row>*/}
        </Container>
    )
}


function RoomOffer({offer, onOfferSelected}) {
    let room = offer.room;
    let pricePlan = offer.pricePlan;
    let price = offer.price;


    return (<Container className='border'>
        <Row>
            <Col>
                {pricePlan.name}
                <MaxOccupation maximumOccupancy={room.maximumOccupancy}/>
                <PlanPenalties penalties={pricePlan.penalties}/>
            </Col>
            <Col>
                {price.public} <Button onClick={() => onOfferSelected(offer)}>Select</Button>
            </Col>
        </Row>
    </Container>)
}


const RoomAmenities = ({amenities}) => {
    return (<><span>amenities</span>
        {
            amenities.map(rec => {
                return (<div key={rec}><small>{rec}</small></div>)
            })
        }
    </>)
}

const PlanPenalties = ({penalties}) => {
    let refund = penalties.refund;
    if (refund.refundable === true) {
        return (<div className='room-penalty refundable'>Refundable</div>)
    } else {
        return (<div className='room-penalty non-refundable'>Non-refundable</div>)
    }
}

const MaxOccupation = ({maximumOccupancy}) => {
    let adults = maximumOccupancy.adults;
    let children = maximumOccupancy.childs;
    return (<div className='room-occupancy'>Up to {adults} guests</div>)
}


function RoomPolicies({policies}) {
    return (<>
        {
            _.map(policies, (value, key) => {
                return (<div>{key} {value}</div>)
            })
        }
    </>)
}

export default Room