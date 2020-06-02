import React, {useState} from 'react'
import style from './hotel-details.module.scss'
import {Container, Row, Col, Button, Image} from 'react-bootstrap'
import _ from 'lodash'
import PaxDetails from "../passengers/pax-details";
import Room from "./room-details"
import YourChoice from "./your-choice";
import default_hotel_image from "../../assets/default_hotel_image.png";
import {storeSelectedOffer} from "../../utils/api-utils";
import {HotelSearchResultsWrapper} from "../../utils/hotel-search-results-wrapper";

export default function HotelDetails({hotel, searchResults}) {
    const [selectedOffer,setSelectedOffer] = useState()
    const [contact_details,setContactDetails] = useState()
    let searchResultsWrapper=new HotelSearchResultsWrapper(searchResults);

    function handleContactDetailsChange(contactDetails, allPassengersDetailsAreValid){
        setContactDetails(contactDetails);
    }

    function handleSelectedOfferChange(newOffer){
        console.log("Offer changed",newOffer)
        console.log("offerID",newOffer.offerId)
        let offer  = searchResultsWrapper.getOffer(newOffer.offerId)
        let results = storeSelectedOffer(offer);
        results.then((response) => {
            console.debug("Selected offer successfully added to a shopping cart", response);
        }).catch(err => {
            console.error("Failed to add selecteed offer to a shopping cart", err);
            //TODO - add proper error handling (show user a message)
        })
        setSelectedOffer(newOffer);
    }


    function handlePayButtonClick(){
        const contactDetails = contact_details;
        // const selectedOffer = this.state.selectedOffer;
        // console.log("Pay button clicked, offer:",selectedOffer, "pax details:", contactDetails);

    }

    function getHotelPricePlansWithOffers(hotel, offers, pricePlans){
        let hotelOffers = [];
        let roomTypes = hotel.roomTypes;
        let accommodationId = hotel.accommodationId;
        console.log("hotel",hotel)
        console.log("hotel accommodationId",accommodationId)
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

    function getRoomPricePlansWithOffers(roomType, hotelPlansWithOffers){
        console.log("getRoomPricePlansWithOffers, roomType:", roomType)
        return hotelPlansWithOffers.filter(rec=>{
            return rec.roomType === roomType;
        })
    }

        const offers=searchResults.offers;
        const pricePlans=searchResults.pricePlans;
        const rooms = hotel.roomTypes;
        const hotelPricePlansWithOffers = getHotelPricePlansWithOffers(hotel,offers,pricePlans);
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
                                    const roomPricePlansWithOffers=getRoomPricePlansWithOffers(roomId,hotelPricePlansWithOffers)
                                    return (<Room room={room} key={roomId} roomPricePlansWithOffers={roomPricePlansWithOffers} onOfferSelected={handleSelectedOfferChange}/>)
                                })
                            }

                        </div>
                        <div>
                                {selectedOffer!==undefined && (
                                    <YourChoice room={selectedOffer.room}
                                                hotel={hotel}
                                                price={selectedOffer.price}/>
                                    )}
                        </div>
                        <div>
                                <PaxDetails onDataChange={handleContactDetailsChange} passengers={passengers}/>
                        </div>
                        {selectedOffer!==undefined && (
                                <HotelPriceSummary price={selectedOffer.price} onPayButtonClick={payButtonClick}/>
                        )}
                    </Col>
                </Row>
            </Container>
        )
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
