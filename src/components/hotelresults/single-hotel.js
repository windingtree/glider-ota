import React from 'react'
import style from './single-hotel.module.scss'
import {Container, Row, Col, Image, Button } from 'react-bootstrap'
import default_hotel_image from "../../assets/default_hotel_image.png";


export default function SingleHotel({hotel, bestoffer, handleClick}){
    const image=(hotel.media!==undefined && hotel.media.length>0)?hotel.media[0].url:default_hotel_image;
    let bestPrice = bestoffer.price;
    return(
        <Container  className={style.container}>
        {/*<Container  className="hotel-search-offer__container d-flex flex-row flex-wrap p-3">*/}
            <Row >
            <Col xs={12} md={3} className={style.imagecontainer}><Image className={style.image} height={140}  src={image} /></Col>
            <Col>
                <Container >
                    <Row className={style.hotelname}>{hotel.name}</Row>
                    <Row className={style.address}>[Moscow, Olympic St 14]</Row>
                    <Row className={style.description}>{extractShortInfoFromHotelDescription(hotel.description,100)}</Row>
                    <Row noGutters={true}>
                        <Col md={8} xs={12}><HotelPrice price={bestPrice}/> </Col>
                        <Col className="align-self-end "><Button className="w-100" variant="outline-primary" size="lg" onClick={() => { handleClick(hotel)}}>select</Button></Col>
                    </Row>
                </Container>
            </Col>
            </Row>
        </Container>)
}

function HotelPrice({price}){
    return (<div className={style.price}>
        from <span className='glider-font-h2-fg'>{price.public} {price.currency}</span> per night
    </div>)
}


//TODO - ideally it should not cut the text in the middle of a sentence
const extractShortInfoFromHotelDescription = (description, maxlen)=>{
        return description.slice(0,Math.min(maxlen,description.length));
}
