import React, {useState} from 'react'
import style from './hotel-details.module.scss'
import {Container, Row, Col, Image} from 'react-bootstrap'
import _ from 'lodash'
import Room from "./room-details"
import default_hotel_image from "../../../assets/default_hotel_image.png";
import {storeSelectedAccommodation} from "../../../utils/api-utils";
import {HotelSearchResultsWrapper} from "../../../utils/hotel-search-results-wrapper";

export default function HotelDetails({hotel, searchResults}) {
    const [selectedOffer,setSelectedOffer] = useState()

    let searchResultsWrapper=new HotelSearchResultsWrapper(searchResults);


    function handleSelectedOfferChange(newOffer){
        let offer  = searchResultsWrapper.getOffer(newOffer.offerId)

        let results = storeSelectedAccommodation({
            offerId:newOffer.offerId,
            offer:offer
        }, true);
        results.then((response) => {
            console.debug("Selected offer successfully added to a shopping cart", response);
        }).catch(err => {
            console.error("Failed to add selecteed offer to a shopping cart", err);
            //TODO - add proper error handling (show user a message)
        })
        setSelectedOffer(newOffer);
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

    function getRoomPricePlansWithOffers(roomType, hotelPlansWithOffers) {
        return hotelPlansWithOffers.filter(rec => {
            return rec.roomType === roomType;
        })
    }


    const offers = searchResults.offers;
    const pricePlans = searchResults.pricePlans;
    const rooms = hotel.roomTypes;
    const hotelPricePlansWithOffers = getHotelPricePlansWithOffers(hotel, offers, pricePlans);

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
                            <HotelAddress hotel={hotel}/>
                        </div>
                            <HotelLeadingImage images={hotel.media}/>
                        <div>
                            {
                                _.map(rooms, (room, roomId) => {
                                    const roomPricePlansWithOffers=getRoomPricePlansWithOffers(roomId,hotelPricePlansWithOffers)
                                    return (<Room room={room} key={roomId} roomPricePlansWithOffers={roomPricePlansWithOffers} onOfferSelected={handleSelectedOfferChange} selectedOffer={selectedOffer}/>)
                                })
                            }

                        </div>
                    </Col>
                </Row>
            </Container>
        )
}





export function HotelLeadingImage({images}){
    const image = (images !== undefined && images.length > 0) ? images[0].url : default_hotel_image;
    return (
        <div className={style.mainImageContainer}>
            <Image className={style.mainImage} src={image}/>
        </div>
    )
}


function HotelAddress({hotel}){
    if (hotel && hotel.contactInformation && hotel.contactInformation.address){
        const address = hotel.contactInformation.address;
        return (<>{address.streetAddress}, {address.locality}</>)
    }else{
        return (<></>)
    }
}

