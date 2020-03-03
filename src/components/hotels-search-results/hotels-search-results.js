import React from 'react'
import './hotel-search-results.css'
import {Container, Row, Col, Image} from 'react-bootstrap'
import _ from 'lodash'
import default_hotel_image from "../../assets/default_hotel_image.png";


export default class HotelsSearchResults extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
        this.handleOfferDisplay = this.handleOfferDisplay.bind(this);
    }

    handleOfferDisplay(combinationId,offerId) {
        // console.log("handleOfferDisplay", offer);
        if (this.props.onOfferDisplay) {
            this.props.onOfferDisplay(combinationId,offerId)
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
                           return (<SingleHotel hotel={hotel} id={id}/>)
                            })
                        }
                    </Col>
                    <Col/>
                </Row>
            </Container>
        )
    }



}


function SingleHotel({hotel,id}){
    const image=(hotel.media!==undefined && hotel.media.length>5)?hotel.media[2].url:default_hotel_image
    return (
        <Container className='offer-container' key={id}>
            <Row className='border' >
                <Col sm={4} className='border'><Image src={image} width={300}/></Col>
                <Col sm={4} className='border'>{hotel.name}</Col>
            </Row>
        </Container>
    )
}