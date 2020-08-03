/**
 * Module contains various method which are used to enrich response from Glider Aggregator before it's returned to UI.
 * <br/>For example, search results don't contain full airport names (IATA codes instead), for the users however we need to display full airport name.
 * <br/>Therefore we cannot simply return 'raw' results, we need to 'enrich' them before.
 * @module _lib/response-decorator
 */

const {createLogger} = require('./logger');
const {getAirportByIataCode,getCountryByCountryCode, getAirlineByIataCode} = require ('./dictionary-data-cache')
const _ = require('lodash');
const {v4} = require('uuid');
const { utcToZonedTime,zonedTimeToUtc } = require('date-fns-tz');
const { parseISO } = require('date-fns');
const logger = createLogger('response-decorator-logger');



/**
 * Main function which takes care of enriching search results with additional information (e.g. full airport name, airline name)
 *
 * @param results
 */
function enrichResponseWithDictionaryData(results){

    //add origin & destination airport details (city_name and airport_name)
    enrichAirportCodesWithAirportDetails(results);
    //add airline details for each flight segment(airline_name)
    enrichOperatingCarrierWithAirlineNames(results);
    //add local time to each flight segment departure and arrival (dates returned by Glider are always UTC)
    convertUTCtoLocalAirportTime(results);
    //add small commission to the price to cover credit card transaction fee
    increaseOfferPriceWithStripeCommission(results);
    results['metadata']={
        uuid:v4(),
        timestamp:new Date(),
        numberOfOffers:Object.keys(results.offers).length
    }
}

function enrichAirportCodesWithAirportDetails(results){
    let segments = _.get(results,'itineraries.segments',[])
    _.each(segments, (segment,id)=>{
        let origin = segment.origin;
        let airportCode = origin.iataCode;
        let airportDetails = getAirportByIataCode(airportCode);
        if(airportDetails!==undefined){
            origin.city_name=airportDetails.city_name;
            origin.airport_name=airportDetails.airport_name;
        }else{
            logger.warn("Airport definition not found for airport code:%s",airportCode)
        }

        let destination = segment.destination;
        airportCode = destination.iataCode;
        airportDetails = getAirportByIataCode(airportCode);
        if(airportDetails!==undefined){
            destination.city_name=airportDetails.city_name;
            destination.airport_name=airportDetails.airport_name;
        }else{
            logger.warn("Airport definition not found for airport code:%s",airportCode)
        }
    });

}


function enrichOperatingCarrierWithAirlineNames(results){
    let segments = _.get(results,'itineraries.segments',[])
    _.each(segments, (segment,id)=>{
        let operator = segment.operator;
        let airlineCode  = operator.iataCode;
        let airlineDetails = getAirlineByIataCode(airlineCode);
        //{"airline_iata_code":"AQ","airline_name":"9 Air"},{"airline_iata_code":"RL","airline_name":"Royal Flight"}
        if(airlineDetails!==undefined){
            operator.airline_name=airlineDetails.airline_name;
        }else{
            logger.warn("Airline definition not found for airline code:%s",airlineCode)
        }
    });

}

/**
 * Departure date from UI may come in a local timezone and hour may be random.
 * <br/>We should search with UTC and with hour = 12
 * @param criteria
 */
function setDepartureDatesToNoonUTC(criteria){
    let segments = _.get(criteria,'itinerary.segments',[])
    _.each(segments, (segment,id)=>{

        let d=segment.departureTime.substr(0,10).split("-");
        let utc = new Date(Date.UTC(d[0],d[1]-1,d[2]))
        utc.setUTCHours(12);
        logger.debug(`Departure date from UI:${segment.departureTime}, UTC date which will be used for search:${utc}`)
        segment.departureTime=utc;
    });
}

function convertUTCtoLocalAirportTime(results){
    let segments = _.get(results,'itineraries.segments',[])
    _.each(segments, (segment,id)=>{
        let airportData = getAirportByIataCode(segment.origin.iataCode);
        if(airportData!==undefined && airportData.timezone){
            segment.departureTimeUtc=segment.departureTime;
            segment.departureTime=utcToZonedTime(segment.departureTime,airportData.timezone).toISOString();
        }else{
            throw new Error("Timezone definition not found for airport code:%s",segment.origin.iataCode);
        }

        airportData = getAirportByIataCode(segment.destination.iataCode);
        if(airportData!==undefined && airportData.timezone){
            segment.arrivalTimeUtc=segment.arrivalTime;
            segment.arrivalTime=utcToZonedTime(segment.arrivalTime,airportData.timezone).toISOString();
        }else{
            throw new Error("Timezone definition not found for airport code:%s",segment.destination.iataCode);
        }
    });
}


function increaseOfferPriceWithStripeCommission(results){
    let offers = _.get(results,'offers',{})
    _.each(offers, (offer,id)=>{
        let price = offer.price;
        price.public=_roundToTwoDecimals(_addOPCFee(price.public));;
    });
}


function increaseConfirmedPriceWithStripeCommission(repriceResponse){
    if (repriceResponse && repriceResponse.offer && repriceResponse.offer.price){
        let price = repriceResponse.offer.price;
        let priceWithoutOpcFee = Number(price.public);
        let priceWithOpcFee = _addOPCFee(price.public);
        price.public=_roundToTwoDecimals(priceWithOpcFee);
        price.publicWithoutFees=priceWithoutOpcFee;
        let diff = _roundToTwoDecimals(priceWithOpcFee-priceWithoutOpcFee);
        price.opcFee=diff;
    }
}

//add 5% on top of the total price to cover for OPC fee
//FIXME - replace hardcoded commission with configurable value
function _addOPCFee(price){
    return Number(price)*1.05;
}

function _roundToTwoDecimals(number){
    return Math.round( number * 100 + Number.EPSILON ) / 100
}
module.exports={
    enrichResponseWithDictionaryData,enrichAirportCodesWithAirportDetails,enrichOperatingCarrierWithAirlineNames,replaceUTCTimeWithLocalAirportTime: convertUTCtoLocalAirportTime, setDepartureDatesToNoonUTC, increaseConfirmedPriceWithStripeCommission
}
