const {createLogger} = require('./logger');
const {getAirportByIataCode,getCountryByCountryCode, getAirlineByIataCode} = require ('./dictionary-data-cache')
const _ = require('lodash');
const {v4} = require('uuid');
// log REST calls to a separate logger
const restlogger = createLogger('response-decorator-logger');



function enrichResponseWithDictionaryData(results){
    enrichAirportCodesWithAirportDetails(results);
    enrichOperatingCarrierWithAirlineNames(results);
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
        //{"city_name":"Arraias","city_code":"AAI","country_code":"BR","airport_name":"Arraias","airport_iata_code":"AAI","type":"AIRPORT","country_name":"Brazil"}
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



module.exports={
    enrichResponseWithDictionaryData,enrichAirportCodesWithAirportDetails,enrichOperatingCarrierWithAirlineNames
}