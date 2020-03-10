import React from 'react'
import './hotel-search-results.css'
import {Container, Row, Col, Image, Button } from 'react-bootstrap'
import _ from 'lodash'
import default_hotel_image from "../../assets/default_hotel_image.png";


export default class HotelsSearchResults extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
        this.handleHotelSelected = this.handleHotelSelected.bind(this);
    }

    handleHotelSelected(hotel) {
        // console.log("handleHotelSelected", hotel);
        if (this.props.onHotelSelected) {
            this.props.onHotelSelected(hotel)
        }
    }


    render() {
        const {searchResults} = this.props;
        if (searchResults === undefined) {
            console.log('No data!!');
            return (<>Search for something</>)
        }
        const hotels = searchResults.accommodations;
        return (
            <Container>
                <Row>
                    <Col ms={2}>
                        {/*<StopoverFilter/>*/}
                        {/*<PriceRangeFilter/>*/}
                    </Col>
                    <Col sm={12} md={10} lg={8} xl={7} className='hotels-search-results-container'>
                        {/*<FastCheapFilter/>*/}
                        {
                            _.map(hotels, (hotel, id) => {
                           return (<SingleHotel hotel={hotel} key={id} handleClick={this.handleHotelSelected}/>)
                            })
                        }
                    </Col>
                    <Col/>
                </Row>
            </Container>
        )
    }



}


function SingleHotel({hotel,handleClick}){
    const image=(hotel.media!==undefined && hotel.media.length>0)?hotel.media[0].url:default_hotel_image;

/*
    const handleClick=function(id,hotel){
        console.log("Handle click",id)
    }
*/


    return (
        <Container className='hotel-offer-container' >
            <Row className='boarder' >
                <Col sm={4} className='border'>{<Image width={180} className='hotel-image-main' src={image} />}</Col>
                <Col  className='border'>
                    <Container>
                        <Row className='hotel-name'>
                            {hotel.name}
                        </Row>
                        <Row className='hotel-address'>
                            Moscow, Olympic St 14
                        </Row>
                        <Row  className='hotel-description'>
                            {extractShortInfoFromHotelDescription(hotel.description,100)}
                        </Row>
                        <Row className='hotel-price-text'>
                            from <span className='hotel-price-amount'>130 EUR</span> per night
                            <Button className='hotel-selectroom-button'
                            onClick={() => { handleClick(hotel)}}>select room</Button>

                        </Row>
                    </Container>

                </Col>
            </Row>
        </Container>
    )
}


//TODO - ideally it should not cut the text in the middle of a sentence
const extractShortInfoFromHotelDescription = (description, maxlen)=>{
        return description.slice(0,Math.min(maxlen,description.length));
}