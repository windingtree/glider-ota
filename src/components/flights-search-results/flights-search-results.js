import React from 'react'
import './flights-search-results.css'
import {Container, Row, Col, Image} from 'react-bootstrap'
import logo from '../../assets/airline_logo.png'
import {format, parseISO} from "date-fns";
import StopoverFilter from '../filters/stopover-filter'
import FastCheapFilter from '../filters/fast-cheap-filter'
import OfferUtils from '../../utils/offer-utils'
import PriceRangeFilter from '../filters/price-range-filter'



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
        return (
            <Container>
                <Row>
                    <Col ms={2}>
                        <StopoverFilter/>
                        <PriceRangeFilter/>
                    </Col>
                    <Col sm={12} md={10} lg={8} xl={7} className='search-results-container'>
                        <FastCheapFilter/>
                        {
                            searchResults.combinations.map(combination => {
                                return (<Offer combination={combination} onOfferDisplay={this.handleOfferDisplay}/>)
                            })
                        }
                    </Col>
                    <Col/>
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
        <Container className='offer-container' key={combination.combinationId}>
            <Row className='offer-row offer-row-metainfo' >
                <Col sm={4}
                     className='offer-col offer-col-price'><Price combination={combination} offerWrapper={cheapestOffer} onOfferDisplay={onOfferDisplay}/></Col>
                <Col sm={4} className='offer-col offer-col-ancillaries'>2</Col>
                <Col sm={4}
                     className='offer-col offer-col-operator'><AirlineLogo operator={firstSegment.operator}/></Col>
            </Row>
            <Itinerary itinerary={outboundItinerary}/>
            {returnItinerary !== undefined && <Itinerary itinerary={returnItinerary}/>}
        </Container>
    )
}



const Itinerary = ({itinerary}) =>{
    return (
        <Row className='offer-row offer-row-itinerary'>
            <Col sm={4} className='offer-col offer-col-airports'><Airports itinerary={itinerary}/></Col>
            <Col sm={4} className='offer-col offer-col-duration'><Duration itinerary={itinerary}/></Col>
            <Col sm={4} className='offer-col offer-col-stopover'><StopOverInfo itinerary={itinerary}/></Col>
        </Row>
    )
}



const Price = ({combination, offerWrapper, onOfferDisplay}) =>{
    let offer = offerWrapper.offer
    return (
        <>
            <div className='offer-details--title'>BOOK</div>
            <div className='offer-details--content'>
                {/*<Link to={link} className='offer-details-price'>{offer.price.public} {offer.price.currency}</Link>*/}
                <button className='offer-details-price' onClick={() => {
                    onOfferDisplay(combination.combinationId,offerWrapper.offerId)
                }}>{offer.price.public} {offer.price.currency}</button>
            </div>
        </>
    )
}

const Airports = ({itinerary}) =>{
    const firstSegment = OfferUtils.getFirstSegmentOfItinerary(itinerary);
    const lastSegment = OfferUtils.getLastSegmentOfItinerary(itinerary);
    const startOfTrip = parseISO(firstSegment.departureTime);
    const endOfTrip = parseISO(lastSegment.arrivalTime);
    return (<>
            <div
                className='offer-details--title'>{firstSegment.origin.iataCode}-{lastSegment.destination.iataCode}</div>
            <div
                className='offer-details--content'>{format(startOfTrip, 'HH:mm')}-{format(endOfTrip, 'HH:mm')}</div>
        </>
    )
}
const Duration = ({itinerary}) =>{
    return (<>
            <div className='offer-details--title'>DURATION</div>
            <div className='offer-details--content'>{OfferUtils.calculateDuration(itinerary)}</div>
        </>
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
    return (<>
            <div className='offer-details--title'>STOPS</div>
            <div className='offer-details--content'>{stops}</div>
        </>
    )
}

const AirlineLogo = ({operator})=>{
    return (
        <Image src={logo}/>
    )
}
