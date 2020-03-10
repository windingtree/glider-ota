import React from 'react'
import './hotel-details.css'
import {Container, Row, Col} from 'react-bootstrap'
import _ from 'lodash'
import PassengersDetailsForm from "../flights-offer-details/passenger-details";
import {HotelLeadingImage} from "./hotel-image";
import Room from "./room-offer"
import YourChoice from "./your-choice";

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
        return (
            <Container>
                <Row>
                    <Col sm={12} md={10} lg={8} xl={7} className='hotel-rooms-container'>
                        Hotel details are here {hotel.name}
                        <HotelLeadingImage images={hotel.media}/>
                    </Col>
                </Row>
                <Row>
                    {
                        _.map(rooms, (room, roomId) => {
                            const roomPricePlansWithOffers=this.getRoomPricePlansWithOffers(roomId,hotelPricePlansWithOffers)

                            return (<Room room={room} key={roomId} roomPricePlansWithOffers={roomPricePlansWithOffers} onOfferSelected={this.handleSelectedOfferChange}/>)
                        })
                    }

                </Row>
                <Row>
                    <Col>
                        {this.state.selectedOffer!==undefined && (
                            <YourChoice room={this.state.selectedOffer.room}
                                        hotel={hotel}
                                        price={this.state.selectedOffer.price}/>
                            )}
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <PassengersDetailsForm onDataChange={this.handleContactDetailsChange} passengers={passengers}/>
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


