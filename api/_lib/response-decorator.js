const {createLogger} = require('./logger');
const {getAirportByIataCode,getCountryByCountryCode, getAirlineByIataCode} = require ('./dictionary-data-cache')
const _ = require('lodash');
const {v4} = require('uuid');
const { utcToZonedTime,zonedTimeToUtc } = require('date-fns-tz');
const { parseISO } = require('date-fns');
const logger = createLogger('response-decorator-logger');


function enrichResponseWithDictionaryData(results){
    enrichAirportCodesWithAirportDetails(results);
    enrichOperatingCarrierWithAirlineNames(results);
    convertUTCtoLocalAirportTime(results);

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
 * We should search with UTC and with hour = 12
 * @param criteria
 */
function setDepartureDatesToNoonUTC(criteria){
    let segments = _.get(criteria,'itinerary.segments',[])
    _.each(segments, (segment,id)=>{
        let local=parseISO(segment.departureTime);
        local.setUTCDate(local.getDate());
        local.setUTCHours(12);
        local.setUTCMinutes(0);
        local.setUTCSeconds(0);
        segment.departureTime=local;
    });
}

function convertUTCtoLocalAirportTime(results){
    let segments = _.get(results,'itineraries.segments',[])
    _.each(segments, (segment,id)=>{
        let airport=segment.origin;
        let airportData = getAirportByIataCode(airport.iataCode);
        if(airportData!==undefined && airportData.timezone){
            let utc=segment.departureTime;
            segment.departureTime=utcToZonedTime(utc,airportData.timezone).toISOString();
            segment.departureTimeUtc=utc;
        }else{
            throw new Error("Timezone definition not found for airport code:%s",airport.iataCode);
        }

        airport=segment.destination;
        airportData = getAirportByIataCode(airport.iataCode);
        if(airportData!==undefined && airportData.timezone){
            segment.arrivalTimeUtc=segment.arrivalTime;
            segment.arrivalTime=utcToZonedTime(segment.arrivalTime,airportData.timezone).toISOString();
        }else{
            logger.warn("Timezone definition not found for airport code:%s",airport.iataCode)
            throw new Error("Timezone definition not found for airport code:%s",airport.iataCode);
        }
    });
}



module.exports={
    enrichResponseWithDictionaryData,enrichAirportCodesWithAirportDetails,enrichOperatingCarrierWithAirlineNames,replaceUTCTimeWithLocalAirportTime: convertUTCtoLocalAirportTime, setDepartureDatesToNoonUTC
}
