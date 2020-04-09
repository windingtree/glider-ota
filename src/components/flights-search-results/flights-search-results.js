import React from 'react'
import './flights-search-results.scss'
import {Container, Row, Col, Image, Button} from 'react-bootstrap'
import {format, parseISO} from "date-fns";
// import {config} from "../../config/default"
import Filters from '../filters/filters'
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
            <Container fluid={false} className='flights-search-results-container d-flex flex-row'>
                <div><Filters/>
                </div>
                <div>
                    {/*    <FastCheapFilter/>*/}
                        {
                            searchResults.combinations.map(combination => {
                                return (<Offer key={combination.combinationId} combination={combination} onOfferDisplay={this.handleOfferDisplay}/>)
                            })
                        }
                </div>
            </Container>
        )
    }

}

const Offer = ({combination,onOfferDisplay}) =>{
    const outboundItinerary = OfferUtils.getOutboundItinerary(combination);
    const returnItinerary = OfferUtils.doesReturnItineraryExist(combination) ? OfferUtils.getReturnItinerary(combination) : undefined;
    const firstSegment = OfferUtils.getFirstSegmentOfItinerary(outboundItinerary);
    const cheapestOffer = OfferUtils.getCheapestOffer(combination);
    let offer = cheapestOffer.offer
    return (
        <div className='flight-search-offer-container d-flex flex-row flex-wrap mb-2 p-4' key={combination.combinationId}>
            <div>
                <Itinerary itinerary={outboundItinerary}/>
                {returnItinerary !== undefined && <Itinerary itinerary={returnItinerary}/>}
            </div>
            <div className='flex-fill '>
                <Button className="offer-highlight--price align-self-center" variant="outline-primary" size="lg" onClick={() => {
                    onOfferDisplay(combination.combinationId,cheapestOffer.offerId)
                }}>{offer.price.public} {offer.price.currency}</Button>
            </div>
        </div>
    )
}



const Itinerary = ({itinerary}) =>{
    const firstSegment = OfferUtils.getFirstSegmentOfItinerary(itinerary);
    const lastSegment = OfferUtils.getLastSegmentOfItinerary(itinerary);
    const startOfTrip = parseISO(firstSegment.departureTime);
    const endOfTrip = parseISO(lastSegment.arrivalTime);
    const segments = OfferUtils.getItinerarySegments(itinerary);
    const stops = [];
    for (let i = 0; i < segments.length - 1; i++) {
        const segment = segments[i];
        if (i > 0)
            stops.push(',');
        stops.push(segment.destination.iataCode)
    }
    const operators = OfferUtils.getItineraryOperatingCarriers(itinerary);
    return (
        <div className='offer-highlight--itinerary-row d-flex flex-row flex-wrap'>
            <div className='offer-highlight--column pb-3'>
                <div className='glider-font-h2-fg'>{format(startOfTrip, 'HH:mm')}-{format(endOfTrip, 'HH:mm')}</div>
                <div className='glider-font-caps18-bg uppercase mt-1'>{format(startOfTrip, 'dd MMM, EE')}</div>
            </div>
            <div className='offer-highlight--column d-flex flex-row pb-5'>
                <div className='mr-5'>
                    <div className='glider-font-regular18-fg uppercase'>{OfferUtils.calculateDuration(itinerary)}</div>
                    <div className='glider-font-regular18-bg uppercase underline mt-2'>{firstSegment.origin.iataCode}-{lastSegment.destination.iataCode}</div>
                </div>
                <div className='ml-1'>
                    <div className='glider-font-regular18-fg uppercase '>{stops.length} STOP</div>
                    <div className='glider-font-regular18-bg uppercase underline mt-2'>{stops}</div>
                </div>
            </div>
            <div className='offer-highlight--column d-flex flex-row pb-5'>
                <span className='offer-highlight--logos-and-ancillaries pr-4'>
                {
                    _.map(operators, (operator, id) => {
                        let imgPath="/airlines/"+id+".png";
                        return (<><img key={id} src={imgPath} className='offer-highlight--logos-and-ancillaries'/></>)
                    })
                }
                </span>
                <span className='offer-highlight--logos-and-ancillaries pl-4'>
                    <img src="/ancillaries/baggage.png" className='offer-highlight--logos-and-ancillaries'/>
                </span>
            </div>
        </div>
    )
}



const Price = ({combination, offerWrapper, onOfferDisplay}) =>{
    let offer = offerWrapper.offer
    return (
            <>
                <Button className="offer-highlight--price" variant={"outline-primary"} size="lg" onClick={() => {
                    onOfferDisplay(combination.combinationId,offerWrapper.offerId)
                }}>{offer.price.public} {offer.price.currency}</Button>
            </>
    )
}


//TODO - extract ancillaries
const Ancillaries = ({combination}) =>{
    return (<span className='offer-highlight--logos-and-ancillaries'>
        <img src="/ancillaries/baggage.png" className='offer-highlight--logos-and-ancillaries'/>
    </span>)
}

