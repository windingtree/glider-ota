import React from 'react'
import './hotel-search-results.scss'
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
            <Container fluid={false}>
                <Row className='hotels-search-results-wrapper'>
                        {
                            _.map(hotels, (hotel, id) => {
                           return (<SingleHotel hotel={hotel} key={id} handleClick={this.handleHotelSelected}/>)
                            })
                        }
                </Row>
            </Container>
        )
    }



}


function SingleHotel({hotel,handleClick}){
    const image=(hotel.media!==undefined && hotel.media.length>0)?hotel.media[0].url:default_hotel_image;
    console.log("Single hotel",hotel);
    return(
        <Container  className="hotel-search-offer__container d-flex flex-row flex-wrap p-3">
            <Row >
            <Col xs={12} md={3} className="hotel-search-offer__imagecontainer"><Image className="hotel-search-offer__image" height={140}  src={image} /></Col>
            <Col>
                <Container >
                    <Row className="hotel-search-offer__hotelname py-4">{hotel.name}</Row>
                    <Row className="hotel-search-offer__address pb-2">[Moscow, Olympic St 14]</Row>
                    <Row className="hotel-search-offer__description pb-2">{extractShortInfoFromHotelDescription(hotel.description,100)}</Row>
                    <Row noGutters={true}>
                        <Col md={8} xs={12} className="hotel-search-offer__price  pb-2">from <span className='glider-font-h2-fg'>130 EUR</span> per night</Col>
                        <Col className="align-self-end "><Button className="w-100" variant="outline-primary" size="lg" onClick={() => { handleClick(hotel)}}>select</Button></Col>
                    </Row>
                </Container>
            </Col>
            </Row>
        </Container>)
}


//TODO - ideally it should not cut the text in the middle of a sentence
const extractShortInfoFromHotelDescription = (description, maxlen)=>{
        return description.slice(0,Math.min(maxlen,description.length));
}