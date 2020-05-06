import React from 'react'
import './hotel-details.scss'
import {Container, Row, Col, Button, Image} from 'react-bootstrap'
import _ from 'lodash'
import PaxDetails from "../flightdetails/pax-details";
// import Room from "./room-offer"
import YourChoice from "./your-choice";
import default_hotel_image from "../../assets/default_hotel_image.png";

export default class HotelDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedOfferId:undefined,
            selectedOffer:undefined,
            contact_details:[]
        };
        this.handleContactDetailsChange = this.handleContactDetailsChange.bind(this);
        this.handlePayButtonClick = this.handlePayButtonClick.bind(this);
        this.handleSelectedOfferChange= this.handleSelectedOfferChange.bind(this);
    }

    handleContactDetailsChange(contactDetails){
        this.setState({ contact_details:contactDetails})
        console.log("Contact details",contactDetails)
    }

    handleSelectedOfferChange(newOffer){
        console.log("Offer changed",newOffer)
        this.setState({
            // selectedOfferId:newOffer.offerId,
            selectedOffer:newOffer
        })
    }


    handlePayButtonClick(){
        const contactDetails = this.state.contact_details;
        // const selectedOffer = this.state.selectedOffer;
        // console.log("Pay button clicked, offer:",selectedOffer, "pax details:", contactDetails);

    }

    render() {
        const {hotel,searchResults} = this.props;
        const offers=searchResults.offers;
        const pricePlans=searchResults.pricePlans;
        const rooms = hotel.roomTypes;
        const hotelPricePlansWithOffers = this.getHotelPricePlansWithOffers(hotel,offers,pricePlans);
        const passengers = searchResults.passengers;

        const payButtonClick= () =>{

        }

        return (
            <Container >
                <Row>
                    <Col className='hotel-offer-details__wrapper'>
                        <div className='glider-font-h1-fg mb-4'>
                            Book your room
                        </div>
                        <div className='glider-font-text24medium-fg mb-3'>
                            {hotel.name}
                        </div>
                        <div className='glider-font-text16-fg mb-5'>
                            on Olympuc st 14, Moscow | 1 adult for 2 nights
                        </div>
                        <div className='hotel-offer-details_main-image-container pb-4'>
                            <HotelLeadingImage images={hotel.media}/>
                        </div>
                        <div>
                            {
                                _.map(rooms, (room, roomId) => {
                                    const roomPricePlansWithOffers=this.getRoomPricePlansWithOffers(roomId,hotelPricePlansWithOffers)

                                    return (<Room room={room} key={roomId} roomPricePlansWithOffers={roomPricePlansWithOffers} onOfferSelected={this.handleSelectedOfferChange}/>)
                                })
                            }

                        </div>
                        <div>
                                {this.state.selectedOffer!==undefined && (
                                    <YourChoice room={this.state.selectedOffer.room}
                                                hotel={hotel}
                                                price={this.state.selectedOffer.price}/>
                                    )}
                        </div>
                        <div>
                                <PaxDetails onDataChange={this.handleContactDetailsChange} passengers={passengers}/>
                        </div>
                        {this.state.selectedOffer!==undefined && (
                                <HotelPriceSummary price={this.state.selectedOffer.price} onPayButtonClick={payButtonClick}/>
                        )}
                    </Col>
                </Row>
            </Container>
        )
    }
    /*
    "offers": {
        "b64a914d-53a1-4df0-a5a3-731dd780e8b5": {
          "pricePlansReferences": {
            "LSAVE": {
              "accommodation": "erevmax.07119",
              "roomType": "ND"
            }
          },
          "price": {
            "currency": "SEK",
            "public": "576.0",
            "taxes": -64
          }
        },


     */

    getHotelPricePlansWithOffers(hotel, offers, pricePlans){
        let hotelOffers = [];
        let roomTypes = hotel.roomTypes;
        let accommodationId = hotel.accommodationId;

        _.map(offers,(offer,offerId)=>{
            _.map(offer.pricePlansReferences,(ppRef,ppRefId)=>{
                if(ppRef.accommodation === accommodationId){
                    hotelOffers.push({
                        accommodation:accommodationId,
                        roomType:ppRef.roomType,
                        pricePlanReference:ppRefId,
                        pricePlan:pricePlans[ppRefId],
                        price:offer.price,
                        offerId:offerId,
                        room:roomTypes[ppRef.roomType]
                    })
                }
            })
        })
        hotelOffers.sort((a,b)=>{
            return a.price.public>b.price.public?1:-1;
        });

        return hotelOffers
    }

    getRoomPricePlansWithOffers(roomType, hotelPlansWithOffers){
        return hotelPlansWithOffers.filter(rec=>{
            return rec.roomType === roomType;
        })
    }
}







function Room({room, roomPricePlansWithOffers, onOfferSelected}) {
    return (
        <div className='room-details__container'>
            <div className='glider-font-h2-fg mb-3' >{room.name}</div>
            <div className='d-flex flex-row flex-wrap flex-fill'>
                <div className='room-details__col1 d-flex flex-column ' >
                    {/*<div className='glider-font-h2-fg'>{room.name}</div>*/}
                    {/*{room.roomTypeId}*/}
                    {/*<div>{room.description}</div>*/}
                    <div ><RoomImage images={room.media}/></div>
                    <div className='glider-font-text16-fg'>{room.size.value} {room.size._unit_}</div>
                    <div>
                        <RoomAmenities amenities={room.amenities}/>
                    </div>
                    {/*<Col className='border'>TOTAL PRICE</Col>*/}
                </div>
                <div className='room-details__col2 flex-fill'>
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
                </div>
            </div>
            {/*       <Row>
            <Col>Policies</Col>
            <Col><RoomPolicies policies={room.policies}/> </Col>
        </Row>*/}
        </div>
    )
}


function RoomOffer({offer, onOfferSelected}) {
    let room = offer.room;
    let pricePlan = offer.pricePlan;
    let price = offer.price;


    return (<div className='d-flex flex-row flex-wrap border-bottom border-dark pb-3 mb-3'>
        <div className='glider-font-text18medium-fg d-flex flex-column flex-fill'>
            <div>{pricePlan.name}</div>
            <div className='glider-font-text16-fg'>
                <MaxOccupation maximumOccupancy={room.maximumOccupancy}/>
                <PlanPenalties penalties={pricePlan.penalties}/>
            </div>
        </div>
        <div>
            <div className='glider-font-text18medium-fg'>Total Price</div>
            <div className='glider-font-h2-fg mb-3'>{price.public}</div>
            <div><Button onClick={() => onOfferSelected(offer)} variant="outline-primary" size="lg">Select room</Button></div>
        </div>
    </div>)
}


const RoomAmenities = ({amenities}) => {
    return (<><div className='glider-font-text16-primary'>amenities</div>
        {
            amenities.map(rec => {
                return (<div className='glider-font-text16-fg' key={rec}><small>{rec}</small></div>)
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

const HotelLeadingImage = ({images}) => {
    const image = (images !== undefined && images.length > 0) ? images[0].url : default_hotel_image;
    return (
        <Image className='hotel-offer-details_main-image' src={image}/>
    )
}

const RoomImage = ({images}) => {
    const image = (images !== undefined && images.length > 0) ? images[0].url : default_hotel_image;
    return (<Image width={180} className='hotel-offer-details_room-image' src={image}/>)
}



const HotelPriceSummary = ({price, onPayButtonClick}) =>{
    return (
        <>
            <Row className='pt-5'>
                <Col >
                    <div className='glider-font-h2-fg'>Pay {price.public} {price.currency} to complete the booking</div>
                </Col>
                <Col xl={2}>
                    <Button variant="primary" onClick={onPayButtonClick} size="lg" >Pay now</Button>
                </Col>
            </Row>
        </>
    )
}