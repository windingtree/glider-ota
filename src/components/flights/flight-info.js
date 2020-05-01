import OfferUtils from "../../utils/offer-utils";
import {Col, Container, Image, Row} from "react-bootstrap";
import {format} from "date-fns";
import logo from "../../assets/airline_logo.png";
import {iataToCityName} from "../../utils/offer-utils"
import React from "react";
import "./flight-info.scss";



export default function YourFlightInfo({combination}){
    if(combination===undefined){
        return (<>nothing to display</>)
    }

    const outboundItinerary = OfferUtils.getOutboundItinerary(combination);
    const returnItinerary = OfferUtils.doesReturnItineraryExist(combination)?OfferUtils.getReturnItinerary(combination) : undefined;


    return(
        <>
            <div className='offer-detail--header'>Your flight</div>
             <ItineraryHeader combination={combination}/>
             <ItineraryDetailsNew itinerary={outboundItinerary}/>
                    {returnItinerary!==undefined &&
                    <ItineraryDetailsNew itinerary={returnItinerary}/>
                    }
        </>
    )
}


/**
 * Upper part of a detailed flight offer. Contains information about the routing (e.g. Paris-London) and departure/return dates
 * @param combination
 * @returns {*}
 * @constructor
 */
function ItineraryHeader({combination}){
    const outboundItinerary = OfferUtils.getOutboundItinerary(combination);
    const returnItinerary = OfferUtils.doesReturnItineraryExist(combination)?OfferUtils.getReturnItinerary(combination) : undefined;
    const depCityName = OfferUtils.getItineraryDepartureCityName(outboundItinerary);
    const arrivCityName = OfferUtils.getItineraryArrivalCityName(outboundItinerary);
    let departureDateStr = format(OfferUtils.getItineraryDepartureDate(outboundItinerary), 'LLL dd (EEE)')
    let returnDateStr = '';
    if(returnItinerary!==undefined){
        returnDateStr  = ' | '+format(OfferUtils.getItineraryDepartureDate(returnItinerary), 'LLL dd (EEE)');
    }

    return (
        <div className='d-flex flex-row flex-wrap mb-2'>
            <span className='glider-font-text24medium-fg pr-3'>{depCityName}-{arrivCityName} </span>
            <span className='glider-font-text18medium-bg'> {departureDateStr} {returnDateStr}</span>
        </div>
    )

}



function ItineraryDetailsNew({itinerary}){
    let dptrDate=OfferUtils.getItineraryDepartureDate(itinerary);
    let arrivalDate=OfferUtils.getItineraryArrivalDate(itinerary);
    let operatingCarrier=OfferUtils.getItineraryOperatingCarrier(itinerary);

    return (
        <div className="offer-detail-container d-flex flex-row flex-wrap my-5 p-4">
            <div>
                <div className='d-flex flex-row flex-wrap mb-5'>
                    <div className='glider-font-text24medium-fg min-width-290'>{format(dptrDate,'MMMM d')}</div>
                    <div className='glider-font-regular18-fg'>{OfferUtils.getItineraryDepartureCityName(itinerary)} - {OfferUtils.getItineraryArrivalCityName(itinerary)}</div>
                </div>
                <div className='d-flex flex-row flex-wrap-reverse'>
                    <div className='d-flex flex-row min-width-290'>
                        <div><img src={"/airlines/"+operatingCarrier.iataCode+".png"} className='offer-detail--trip-logo'/></div>
                        <div className='d-flex flex-column'>
                            <div className='glider-font-filtercategories13-fg'>{operatingCarrier.airlineName}</div>
                            <div className='glider-font-filtercategories13-bg'>{operatingCarrier.flight}</div>
                        </div>
                    </div>
                    <div className='d-flex flex-column flex-wrap'>
                        <div className='d-flex flex-row flex-wrap  pb-4'>
                            <div className='flex-row flex-wrap min-width-210'>
                                <span className='glider-font-h2-fg pr-1'>{format(dptrDate, 'HH:mm')}</span>
                                <span className='glider-font-regular18-fg pr-3 align-self-center'>{format(dptrDate, 'MMM dd')}</span>
                            </div>
                            <div className='flex-row flex-wrap  min-width-330'>
                                <span className='glider-font-filtercategories13-fg pr-1'>{OfferUtils.getItineraryDepartureAirportName(itinerary)}</span>
                                <span className='glider-font-filtercategories13-bg'>{OfferUtils.getItineraryDepartureAirportCode(itinerary)}</span>
                            </div>
                        </div>
                        <div className='d-flex flex-row flex-wrap '>
                            <div className='flex-row flex-wrap min-width-210'>
                                <span className='glider-font-h2-fg glider-font-h2-fg pr-1'>{format(arrivalDate, 'HH:mm')}</span>
                                <span className='glider-font-regular18-fg align-self-center'>{format(arrivalDate, 'MMM dd')}</span>
                            </div>
                            <div className='flex-row flex-wrap  min-width-330'>
                                <span className='glider-font-filtercategories13-fg pr-1'>{OfferUtils.getItineraryArrivalAirportName(itinerary)}</span>
                                <span className='glider-font-filtercategories13-bg'>{OfferUtils.getItineraryArrivalAirportCode(itinerary)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='d-flex flex-row flex-wrap'>
                <div className='glider-font-regular18-fg py-3 min-width-100'>{OfferUtils.calculateDuration(itinerary)}</div>
                <div className='glider-font-filtercategories13-fg py-3 min-width-100'>No luggage</div>
            </div>
        </div>
    )
}

