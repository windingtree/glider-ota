import React from 'react'
import style from './hotel-details.module.scss'
import {Container, Row, Col, Button, Image} from 'react-bootstrap'
import _ from 'lodash'
import PaxDetails from "../passengers/pax-details";
import Room from "./room-details"
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

    handleContactDetailsChange(contactDetails, allPassengersDetailsAreValid){
        this.setState({ contact_details:contactDetails})
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
                    <Col className={style.offerWrapper}>
                        <div className='glider-font-h1-fg mb-4'>
                            Book your room
                        </div>
                        <div className='glider-font-text24medium-fg mb-3'>
                            {hotel.name}
                        </div>
                        <div className='glider-font-text16-fg mb-5'>
                            on Olympuc st 14, Moscow | 1 adult for 2 nights
                        </div>
                            <HotelLeadingImage images={hotel.media}/>
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
        console.log("hotel",hotel)
        _.map(offers,(offer,offerId)=>{
            console.log("OfferID",offerId," = ",offer)
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





export function HotelLeadingImage({images}){
    const image = (images !== undefined && images.length > 0) ? images[0].url : default_hotel_image;
    return (
        <div className={style.mainImageContainer}>
            <Image className={style.mainImage} src={image}/>
        </div>
    )
}



export function HotelPriceSummary({price, onPayButtonClick}){
    return (<>
            <Row>
                <Col xs={12} lg={6} className={style.hotelPrice}>
                   Pay {price.public} {price.currency} to complete the booking
                </Col>
            </Row>
            <Row className='flex-row-reverse'>
                <Col xs={12} sm={3} lg={3} className={style.hotelPriceButton}>
                    <Button variant="primary" onClick={onPayButtonClick} size="lg" block>Pay now</Button>
                </Col>
            </Row>
            </>
    )
}
