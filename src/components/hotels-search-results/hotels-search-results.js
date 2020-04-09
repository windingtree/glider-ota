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
                    {/*<Col ms={2}>*/}
                        {/*<StopoverFilter/>*/}
                        {/*<PriceRangeFilter/>*/}
                    {/*</Col>*/}
                        {/*<FastCheapFilter/>*/}
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
    return (
        <div className="hotel-search-offer-container d-flex flex-row flex-wrap p-3">
            <div className="hotel-offer-container__image"><Image height={140}  src={image} /></div>
            <div>
                <div>
                    <div className="glider-font-text24medium-fg ">{hotel.name}</div>
                    <div className="glider-font-caps12medium-bg ">[Moscow, Olympic St 14]</div>
                    <div className="glider-font-text16-fg  mb-2">{extractShortInfoFromHotelDescription(hotel.description,100)}</div>
                </div>
                <div className='d-flex flex-row flex-wrap flex-fill'>
                    <div className="glider-font-text12-fg min-w100 min-w100 flex-fill">from <span className='glider-font-h2-fg'>130 EUR</span> per night</div>
                    <div className="min-w100 align-self-end"><Button variant="outline-primary" size="lg"
                                                                         onClick={() => { handleClick(hotel)}}>select room</Button></div>
                </div>
            </div>
        </div>
    )
}


//TODO - ideally it should not cut the text in the middle of a sentence
const extractShortInfoFromHotelDescription = (description, maxlen)=>{
        return description.slice(0,Math.min(maxlen,description.length));
}