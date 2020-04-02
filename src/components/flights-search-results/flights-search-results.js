import React from 'react'
import './flights-search-results.scss'
import {Container, Row, Col, Image, Button} from 'react-bootstrap'
import logo from '../../assets/airline_logo.png'
import {format, parseISO} from "date-fns";
import StopoverFilter from '../filters/stopover-filter'
import FastCheapFilter from '../filters/fast-cheap-filter'
import OfferUtils from '../../utils/offer-utils'
import PriceRangeFilter from '../filters/price-range-filter'
import _ from 'lodash'



export default class FlightsSearchResults extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
        this.handleInputValueChange = this.handleInputValueChange.bind(this);
        this.handleOfferDisplay = this.handleOfferDisplay.bind(this);
    }

    handleInputValueChange(event) {
    }

    handleOfferDisplay(combinationId,offerId) {
        console.log("handleOfferDisplay", offerId);
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
        return (
            <Container>
                <Row>
{/*                    <Col ms={2}>
                        <StopoverFilter/>
                        <PriceRangeFilter/>
                    </Col>*/}
                    <Col sm={12} md={10} lg={8} xl={7} className='search-results-container'>
                        <FastCheapFilter/>
                        {
                            searchResults.combinations.map(combination => {
                                return (<Offer key={combination.combinationId} combination={combination} onOfferDisplay={this.handleOfferDisplay}/>)
                            })
                        }
                    </Col>
                </Row>
            </Container>
        )
    }

}

const Offer = ({combination,onOfferDisplay}) =>{
    const outboundItinerary = OfferUtils.getOutboundItinerary(combination);
    const returnItinerary = OfferUtils.doesReturnItineraryExist(combination) ? OfferUtils.getReturnItinerary(combination) : undefined;
    const firstSegment = OfferUtils.getFirstSegmentOfItinerary(outboundItinerary);
    const cheapestOffer = OfferUtils.getCheapestOffer(combination);
    return (
        <Container className='offer-highlight--container d-flex' key={combination.combinationId}>
            <div className='border'>
            <Itinerary itinerary={outboundItinerary}/>
            {returnItinerary !== undefined && <Itinerary itinerary={returnItinerary}/>}
            </div>
            <div className='offer-highlight--column border'>
                <Carriers itinerary={outboundItinerary}/>
                <Ancillaries combination={combination}/>
                <Price combination={combination} offerWrapper={cheapestOffer} onOfferDisplay={onOfferDisplay}/>
            </div>
        </Container>
    )
}



const Itinerary = ({itinerary}) =>{
    return (
        <Row className='offer-highlight--itinerary-row'>
            <div className='offer-highlight--column pb-3 pt-3'><Airports itinerary={itinerary}/></div>
            <div className='offer-highlight--column-small d-flex'>
                <Duration itinerary={itinerary}/>
                <StopOverInfo itinerary={itinerary}/>
            </div>
        </Row>
    )
}



const Price = ({combination, offerWrapper, onOfferDisplay}) =>{
    let offer = offerWrapper.offer
    return (
            <div className='offer-highlight--content-big'>
                <Button className="offer-highlight--price" variant={"outline-primary"} size="lg" onClick={() => {
                    onOfferDisplay(combination.combinationId,offerWrapper.offerId)
                }}>{offer.price.public} {offer.price.currency}</Button>
            </div>
    )
}

const Carriers = ({itinerary}) =>{
    const operators = OfferUtils.getItineraryOperatingCarriers(itinerary);
    return (<span className='offer-highlight--logos-and-ancillaries'>
        {
            _.map(operators, (operator, id) => {
                let imgPath="/airlines/"+id+".png";
                return (<><img key={id} src={imgPath} className='offer-highlight--logos-and-ancillaries'/></>)
            })
        }
    </span>)
}

//TODO - extract ancillaries
const Ancillaries = ({combination}) =>{
    return (<span className='offer-highlight--logos-and-ancillaries'>
        <img src="/ancillaries/baggage.png" className='offer-highlight--logos-and-ancillaries'/>
    </span>)
}

const Airports = ({itinerary}) =>{
    const firstSegment = OfferUtils.getFirstSegmentOfItinerary(itinerary);
    const lastSegment = OfferUtils.getLastSegmentOfItinerary(itinerary);
    const startOfTrip = parseISO(firstSegment.departureTime);
    const endOfTrip = parseISO(lastSegment.arrivalTime);
    return (<>
            <div
                className='offer-highlight--title'>{firstSegment.origin.iataCode}-{lastSegment.destination.iataCode}</div>
            <div
                className='offer-highlight--content-big'>{format(startOfTrip, 'HH:mm')}-{format(endOfTrip, 'HH:mm')}</div>
        </>
    )
}
const Duration = ({itinerary}) =>{
    return (<div className='pl-4 pr-4' >
            <div className='offer-highlight--title '>DURATION</div>
            <div className='offer-highlight--content-small'>{OfferUtils.calculateDuration(itinerary)}</div>
        </div>
    )
}

const StopOverInfo = ({itinerary}) =>{
    const segments = OfferUtils.getItinerarySegments(itinerary);
    const stops = [];
    for (let i = 0; i < segments.length - 1; i++) {
        const segment = segments[i];
        if (i > 0)
            stops.push(',');
        stops.push(segment.destination.iataCode)
    }
    return (<div className='pl-4 pr-4'>
            <div className='offer-highlight--title'>STOPS</div>
            <div className='offer-highlight--content-small'>HKG,JNB{stops}</div>
        </div>
    )
}

