const {decorate} = require('../_lib/decorators');
const {createLogger} = require('../_lib/logger')
const {sendErrorResponse,ERRORS} = require("../_lib/rest-utils")
const dictionary = require("../_lib/dictionary-data-cache")

const logger = createLogger('/lookup/airportByIata')
const lookupController = async (req, res) => {
    let iataCode = req.query.iata;
    if(!validateRequest(iataCode)){
        sendErrorResponse(res,400,ERRORS.INVALID_INPUT,"Invalid request parameter, iata="+iataCode,req.body);
        return;
    }
    try{
        let results = dictionary.getAirportByIataCode(iataCode)
        res.json({ results: results})
    }catch(error){
        logger.error("Got error while lookup, error:%s",error.message,error)
        sendErrorResponse(res,500,ERRORS.INTERNAL_SERVER_ERROR);
    }
};

function validateRequest(iataCode){
    if(iataCode==undefined || iataCode.length!=3)
        return false;
    return true;
}
module.exports = decorate(lookupController);